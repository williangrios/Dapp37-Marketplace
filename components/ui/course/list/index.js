import { useOwnedCourses, useWalletInfo } from "@components/hooks/web3";
import { useWeb3 } from "@components/providers";
import { Button, Loader, Message } from "@components/ui/common";
import { CourseCard } from "@components/ui/course";
import { OrderModal } from "@components/ui/orders";
import { useState } from "react";
import { withToast } from "@utils/toast";

export default function List({ courses }) {
  const { web3, contract, requireInstall } = useWeb3();
  const { hasConnectedWallet, isConnecting, account } = useWalletInfo();
  const { ownedCourses } = useOwnedCourses(courses, account.data);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [busyCourseId, setBusyCourseId] = useState(null);
  const [isNewPurchase, setIsNewPuchase] = useState(true);

  const purchaseCourse = async (order, course) => {
    const hexCourseId = web3.utils.utf8ToHex(selectedCourse.id);
    const orderHash = web3.utils.soliditySha3(
      { type: "bytes16", value: hexCourseId },
      { type: "address", value: account.data }
    );

    const value = web3.utils.toWei(String(order.price));

    setBusyCourseId(course.id);
    if (isNewPurchase) {
      const emailHash = web3.utils.sha3(order.email);
      const proof = web3.utils.soliditySha3(
        { type: "bytes32", value: emailHash },
        { type: "bytes32", value: orderHash }
      );
      withToast(_purchaseCourse({ hexCourseId, proof, value }, course));
    } else {
      withToast(_repurchaseCourse({ courseHash: orderHash, value }, course));
    }
  };

  const _purchaseCourse = async ({ hexCourseId, proof, value }, course) => {
    try {
      const result = await contract.methods
        .purchaseCourse(hexCourseId, proof)
        .send({ from: account.data, value });
      ownedCourses.mutate([
        ...ownedCourses.data,
        {
          ...course,
          proof,
          state: "Purchased",
          owner: account.data,
          price: value,
        },
      ]);
      return result;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setBusyCourseId(null);
    }
  };

  const _repurchaseCourse = async ({ courseHash, value }, course) => {
    try {
      const result = await contract.methods
        .repurchaseCourse(courseHash)
        .send({ from: account.data, value });
      
      const index = ownedCourses.data.findIndex(c => c.id === course.id)
      
      if(index >=0 ){
        ownedCourses.data[index].state = "Purchased"
        ownedCourses.mutate(ownedCourses.data);
      }else{
        ownedCourses.mutate();
      }

      return result;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setBusyCourseId(null);
    }
  };

  const cleanUpModal = () => {
    setSelectedCourse(null);
    setIsNewPuchase(true);
  };

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
                    {
                      hasConnectedWallet ? 
                      <Loader size="sm" />
                      :
                      "Connect"
                    }
                    
                  </Button>
                );
              }

              const isBusy = busyCourseId === course.id;

              if (owned) {
                return (
                  <>
                    <div className="flex">
                      <Button
                        disabled={false}
                        size="sm"
                        variant="white"
                      >
                        Yours &#10004;
                      </Button>
                      {owned.state === "Deactivated" && (
                        <Button
                          disabled={isBusy}
                          onClick={() => {
                            setIsNewPuchase(false);
                            setSelectedCourse(course);
                          }}
                          size="sm"
                          variant="purple"
                          className="ml-1"
                        >
                          {isBusy ? (
                            <div className="flex">
                              <Loader size="sm" />
                              <div className="ml-2">In progress</div>
                            </div>
                          ) : (
                            <div>Fund to activate</div>
                          )}
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
                  disabled={!hasConnectedWallet || isBusy}
                  onClick={() => setSelectedCourse(course)}
                >
                  {isBusy ? (
                    <div className="flex">
                      <Loader size="sm" />
                      <div className="ml-2">In progress</div>
                    </div>
                  ) : (
                    <div>Purchase</div>
                  )}
                </Button>
              );
            }}
          />
        );
      })}
      {selectedCourse && (
        <OrderModal
          isNewPurchase={isNewPurchase}
          course={selectedCourse}
          onSubmit={(formData, course, order) => {
            purchaseCourse(formData, course, order);
            cleanUpModal();
          }}
          onClose={cleanUpModal}
        />
      )}
    </section>
  );
}
