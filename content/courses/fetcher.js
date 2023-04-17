import courses from "./index.json"

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