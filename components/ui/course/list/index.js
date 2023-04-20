import { Button } from "@components/ui/common";
import { CourseCard } from "@components/ui/course";
import { OrderModal } from "@components/ui/orders";
import { useState } from "react";

export default function List({courses, canPurchaseCourse}) {
  const [selectedCourse, setSelectedCourse] = useState(null);

  const purchaseCourse = (order) => {
    alert(JSON.stringify(order))
  }
  return (
    <section className="grid md:grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
      {courses.map((course) => (
        <CourseCard  key={course.id} course={course} Footer={() => 
          <div className="mt-4">
            <Button variant="lightPurple" disabled={!canPurchaseCourse} onClick={() => setSelectedCourse(course)}>
              Purchase
            </Button>
          </div>
        }/>
      ))}
      { selectedCourse &&
        <OrderModal course={selectedCourse}
          onSubmit={purchaseCourse}
          onClose={() => setSelectedCourse(null)}
        />
      }
      
    </section>
  );
}
