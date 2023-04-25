import { useAccount } from "@components/hooks/web3";
import { useWeb3 } from "@components/providers";
import { Button } from "@components/ui/common";
import { CourseCard } from "@components/ui/course";
import { OrderModal } from "@components/ui/orders";
import { useState } from "react";

export default function List({ courses, canPurchaseCourse }) {
  const { web3, contract } = useWeb3();
  const { account } = useAccount();
  const [selectedCourse, setSelectedCourse] = useState(null);

  const purchaseCourse = async (order) => {
    const hexCourseId = web3.utils.utf8ToHex(selectedCourse.id);
    const orderHash = web3.utils.soliditySha3(
      { type: "bytes16", value: hexCourseId },
      { type: "address", value: account.data }
    );
    const emailHash = web3.utils.sha3(order.email);
    const proof = web3.utils.soliditySha3(
      { type: "bytes32", value: emailHash },
      { type: "bytes32", value: orderHash }
    );

    const value = web3.utils.toWei(String(order.price));

    try {
      const result = await contract.methods.purchaseCourse(hexCourseId, proof).send({from: account.data, value });
      console.log(result);
    } catch (error) {
      console.log( "purchase failed" + error);
    }

  };

  return (
    <section className="grid md:grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          Footer={() => (
            <div className="mt-4">
              <Button
                variant="lightPurple"
                disabled={!canPurchaseCourse}
                onClick={() => setSelectedCourse(course)}
              >
                Purchase
              </Button>
            </div>
          )}
        />
      ))}
      {selectedCourse && (
        <OrderModal
          course={selectedCourse}
          onSubmit={purchaseCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </section>
  );
}
