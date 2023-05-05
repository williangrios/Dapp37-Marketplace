import { useAdmin, useManagedCourses } from "@components/hooks/web3";
import { useWeb3 } from "@components/providers";
import { Button, Message } from "@components/ui/common";
import { CourseFilter, ManagedCourseCard } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { normalizeOwnedCourse } from "@utils/normalize";
import { withToast } from "@utils/toast";
import { useEffect, useState } from "react";

const VerificationInput = ({ onVerify }) => {
  const [email, setEmail] = useState("");
  return (
    <div className="flex mr-2 relative rounded-md">
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="text"
        name="account"
        id="account"
        className="w-96 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
        placeholder="0x2341ab..."
      />
      <Button onClick={() => onVerify(email)}>Verify</Button>
    </div>
  );
};

export default function ManagedCourses() {
  const [proofOwnership, setProofOwnership] = useState({});
  const [searchedCourse, setSearchedCourse] = useState(null);
  const [filters, setFilters] = useState({state: "All"})
  const { web3, contract } = useWeb3();
  const { account } = useAdmin({ redirectTo: "/marketplace" });
  const { managedCourses } = useManagedCourses(account);
  const verifyCourse = (email, { hash, proof }) => {
    if (!email) return
    const emailHash = web3.utils.sha3(email);
    const proofToCheck = web3.utils.soliditySha3(
      { type: "bytes32", value: emailHash },
      { type: "bytes32", value: hash }
    );
    proofToCheck === proof
      ? setProofOwnership({
          ...proofOwnership,
          [hash]: true,
        })
      : setProofOwnership({
          ...proofOwnership,
          [hash]: false,
        });
  };

  const changeCourseState = async (courseHash, method) => {
    try {
      const result = await contract.methods[method](courseHash).send({ from: account.data });
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const activateCourse = async (courseHash) => {
    withToast(changeCourseState(courseHash, "activateCourse"));
  };

  const deactivateCourse = async (courseHash) => {
    withToast(changeCourseState(courseHash, "deactivateCourse"));
  };

  const searchCourse = async (courseHash) => {
    const re = /[0-9A-Fa-f]{6}/g;

    if (courseHash && courseHash.length === 66 && re.test(courseHash)) {
      const course = await contract.methods.getCourseByHash(courseHash).call();
      if (course.owner !== "0x0000000000000000000000000000000000000000") {
        const normalized = normalizeOwnedCourse(web3)({ courseHash }, course);
        setSearchedCourse(normalized);
        console.log(normalized);
        return;
      }
    }

    setSearchedCourse(null);
  };

  const renderCard = (course, isSearched) => {
    return (
      <ManagedCourseCard key={course.ownedCourseId} course={course} isSearched={isSearched}>
        <VerificationInput
          onVerify={(email) => {
            verifyCourse(email, { hash: course.hash, proof: course.proof });
          }}
        />
        {proofOwnership[course.hash] && (
          <div className="mt-2">
            <Message>Verified</Message>
          </div>
        )}
        {proofOwnership[course.hash] === false && (
          <div className="mt-2">
            <Message type="danger">Wrong proof</Message>
          </div>
        )}
        {course.state === "Purchased" && (
          <div className="mt-2">
            <Button onClick={() => activateCourse(course.hash)} variant="green">
              Activate
            </Button>
            <Button onClick={() => deactivateCourse(course.hash)} variant="red">
              Deactivate
            </Button>
          </div>
        )}
      </ManagedCourseCard>
    );
  };


  

  if (!account.isAdmin) {
    return null;
  }

  const filteredCourses = managedCourses.data
  ?.filter((course) => {
    if(filters.state === "All"){
      return true
    }
    return course.state === filters.state 
  })
  .map((course) => renderCard(course))

  return (
    <>
      <MarketHeader />
      <CourseFilter onSearchSubmit={searchCourse} onFilterSelect={(value) => setFilters({state: value})} />
      <section className="grid grid-cols-1">
        {searchedCourse && 
          
          <div>
            <h1 className="text-2xl font-bold p-5 ">Result</h1>
            {renderCard(searchedCourse, true)}
          </div>
        }
        <h1 className="text-2xl font-bold p-5 ">All courses</h1>
        {
          filteredCourses
        }
        {
          filteredCourses?.length === 0 && 
            <Message type= "warning">
              No courses to display
            </Message>
        }
      </section>
    </>
  );
}

ManagedCourses.Layout = BaseLayout;
