import { useOwnedCourses, useWalletInfo } from "@components/hooks/web3";
import { useWeb3 } from "@components/providers";
import { Button, Loader, Message } from "@components/ui/common";
import { CourseCard } from "@components/ui/course";
import { OrderModal } from "@components/ui/orders";
import { useState } from "react";

export default function List({ courses }) {
  const { web3, contract, requireInstall } = useWeb3();
  const { hasConnectedWallet, isConnecting, account } = useWalletInfo();
  //const { account } = useAccount();
  const { ownedCourses } = useOwnedCourses(courses, account.data);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isNewPurchase, setIsNewPuchase] = useState(true);

  const purchaseCourse = async (order) => {
    const hexCourseId = web3.utils.utf8ToHex(selectedCourse.id);
    const orderHash = web3.utils.soliditySha3(
      { type: "bytes16", value: hexCourseId },
      { type: "address", value: account.data }
    );

    const value = web3.utils.toWei(String(order.price));

    if(isNewPurchase){
      const emailHash = web3.utils.sha3(order.email);
      const proof = web3.utils.soliditySha3(
        { type: "bytes32", value: emailHash },
        { type: "bytes32", value: orderHash }
      );
      _purchaseCourse(hexCourseId, proof, value);
    }else{
      _repurchaseCourse(orderHash, value);
    }

  };

  const _purchaseCourse = async (hexCourseId, proof, value) => {
    try {
      const result = await contract.methods
        .purchaseCourse(hexCourseId, proof)
        .send({ from: account.data, value });
      console.log(result);
    } catch (error) {
      console.log("purchase failed" + error);
    }
  }

  const _repurchaseCourse = async  (courseHash, value) => {
    try {
      const result = await contract.methods
        .repurchaseCourse(courseHash)
        .send({ from: account.data, value });
      console.log(result);
    } catch (error) {
      console.log("purchase failed" + error);
    }
  }

  return (
    <section className="grid md:grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
      {courses.map((course) => {
        const owned = ownedCourses.lookup[course.id];
        return (
          <CourseCard
            key={course.id}
            course={course}
            state={owned?.state}
            Footer={() => {
              if (requireInstall) {
                return (
                  <Button size="sm" variant="lightPurple" disabled={true}>
                    Install
                  </Button>
                );
              }

              if (isConnecting) {
                return (
                  <Button size="sm" variant="lightPurple" disabled={true}>
                    <Loader size="sm" />
                  </Button>
                );
              }

              if (!ownedCourses.hasInitialResponse) {
                return (
                  <Button size="sm" variant="lightPurple" disabled={true}>
                    <Loader size="sm" />
                  </Button>
                );
              }

              if (owned) {
                return (
                  <>
                    <div>
                      <Button
                        onClick={() => {
                          alert("ok");
                        }}
                        disabled={false}
                        size="sm"
                        variant="white"
                      >
                        Yours &#10004;
                      </Button>
                      {owned.state === "Deactivated" && (
                        <Button
                          onClick={() => {
                            setIsNewPuchase(false);
                            setSelectedCourse(course);
                          }}
                          size="sm"
                          variant="purple"
                          className="ml-1"
                        >
                          Fund to Activate
                        </Button>
                      )}
                    </div>
                  </>
                );
              }

              return (
                <Button
                  variant="lightPurple"
                  size="sm"
                  disabled={!hasConnectedWallet}
                  onClick={() => setSelectedCourse(course)}
                >
                  Purchase
                </Button>
              );
            }}
          />
        );
      })}
      {selectedCourse && (
        <OrderModal
          isNewPurchase = {isNewPurchase}
          course={selectedCourse}
          onSubmit={purchaseCourse}
          onClose={() => {
            setSelectedCourse(null);
            setIsNewPuchase(true);
          }}
        />
      )}
    </section>
  );
}
