import Image from "next/legacy/image";

const STATE_COLORS ={
  Purchased: "indigo",
  Activated: "green",
  Deactivated: "red"
}

export default function OwnedCourseCard({ children, course }) {

  const stateColor = STATE_COLORS[course.state];

  return (
    <div className="bg-white border shadow overflow-hidden sm:rounded-lg mb-3">
      <div className="sm:flex">
        <div className="flex-1">
          <div className="h-full next-image-wrapper">
            {/* algumas coisas não funcionaram na aula 201 */}
            <Image
              className="object-cover"
              src={course.coverImage}
              width="45" 
              height="45"
              layout="responsive"
            />
          </div>
        </div>
        <div className="flex-4">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              <span className="mr-2">Course: {course.title}</span>
              <span className={`text-xs text-${stateColor}-700 bg-${stateColor}-200 rounded-full p-2`}>{course.state}</span>
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Price: {course.price}
            </p>
          </div>

          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Course ID</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {course.ownedCourseId}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Proof</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 break-words">
                  {course.proof}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:px-6">{children}</div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
