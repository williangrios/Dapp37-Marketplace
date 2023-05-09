import courses from "./courses.json"
// import learningCourses from "./myLearningCourses.json"
import teachingCourses from "./myTeachingCourses.json"

export const getAllCourses = () => {
    console.log('carregou cursos');
    return({
        data: courses,
        courseMap: courses.reduce((acc, course, id) => {
            acc[course.id] = course
            acc[course.id].index = id
            return acc
        }, {})
    })
}

export const getMyTeachingCourses = () => {
    console.log(teachingCourses);
    return({
        data: teachingCourses,
        courseMap: teachingCourses.reduce((acc, course, id) => {
            acc[course.id] = course
            acc[course.id].index = id
            return acc
        }, {})
    })
}