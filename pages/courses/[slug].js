import { Modal } from "@components/ui/common";
import { Curriculum, Keypoints, CourseHero } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { getAllCourses } from "@content/courses/fetcher";

export default function Course({course}) {
  return (
    <>
      <CourseHero title={course.title} description={course.description} image={course.coverImage}/>
      <Keypoints points={course.wsl}/>
      <Curriculum locked={course.locked} />
      <Modal />
    </>
  );
}

export function getStaticPaths(){
  const {data} = getAllCourses()

  return{
    paths: data.map(c => ({
      params:{
        slug: c.slug
      }
    })),
    fallback: false
  }
}

export function getStaticProps({params}){
  const {data} = getAllCourses();
  const course = data.filter(c => c.slug === params.slug)[0]
  return{
    props: {
      course
    }
  }
}

Course.Layout = BaseLayout;
