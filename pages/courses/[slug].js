import { useAccount, useOwnedCourse } from "@components/hooks/web3";
import { Message, Modal } from "@components/ui/common";
import { Curriculum, Keypoints, CourseHero } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { getAllCourses } from "@content/courses/fetcher";

export default function Course({ course }) {
  const { account } = useAccount();
  const { ownedCourse } = useOwnedCourse(course, account.data);
  const courseState = ownedCourse.data?.state;
  //const courseState = "Activated"
  const isLocked = courseState === "Purchased" || courseState === "Deactivated"
  
  return (
    <>
      <CourseHero
        title={course.title}
        description={course.description}
        image={course.coverImage}
        hasOwner={!!ownedCourse.data}
      />
      <Keypoints points={course.wsl} />
      {courseState && (
        <div className="max-w-5xl mx-auto">
          {courseState === "Purchased" && (
            <Message type="warning">
              Course is purchased and waiting for activaction. Process can take
              up to 24 hours.
              <i className="block font-normal">
                In case of any questions send email for @@@
              </i>
            </Message>
          )}
          {courseState === "Activated" && (
            <Message type="success">
              Enjoy the course
            </Message>
          )}
          {courseState === "Deactivated" && (
            <Message type="danger">
              Course has been deactivated, due the incorrect purchase data. The functionality to watch the course has been temporaly disables.
              <i className="block font-normal">
                Please, contact @@
              </i>
            </Message>
          )}
        </div>
      )}

      <Curriculum locked={isLocked} courseState={courseState} />
      <Modal />
    </>
  );
}

export function getStaticPaths() {
  const { data } = getAllCourses();

  return {
    paths: data.map((c) => ({
      params: {
        slug: c.slug,
      },
    })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  const { data } = getAllCourses();
  const course = data.filter((c) => c.slug === params.slug)[0];
  return {
    props: {
      course,
    },
  };
}

Course.Layout = BaseLayout;
