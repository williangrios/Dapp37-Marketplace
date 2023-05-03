import Image from "next/legacy/image";
import Link from "next/link";
import { AnimateKeyframes } from "react-simple-animate";

export default function Card({ course, Footer, state }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="flex h-full">
        <div className="flex-1 h-full next-span-wrapper">
          <Image
            className="object-cover"
            src={course.coverImage}
            width="200"
            layout="responsive"
            height="230"
            alt={course.title}
          />
        </div>
        <div className="p-8 flex-2">
          <div className="flex items-center">
            <div className="uppercase mr-2 tracking-wide text-sm text-indigo-500 font-semibold">
              {course.type}
            </div>
            <div>
              {state === "Activated" && (
                <div className="text-xs text-black bg-green-200 p-1 px-3 rounded-full">
                  Activated
                </div>
              )}
              {state === "Deactivated" && (
                <div className="text-xs  text-black bg-red-200 p-1 px-3 rounded-full">
                  Deactivated
                </div>
              )}
              {state === "Purchased" && (
                <AnimateKeyframes play duration={2} keyframes={["opacity: 0.2", "opacity: 1"]} iterationCount="infinite">
                  <div className="text-xs  text-black bg-yellow-200 p-1 px-3 rounded-full">
                    Pending
                  </div>
                </AnimateKeyframes>
              )}
            </div>
          </div>

          <Link
            legacyBehavior
            href={`/courses/${course.slug}`}
            className="font-medium mr-8 text-gray-500 hover:text-gray-900"
          >
            <a
              href="#"
              className="block mt-1 text-sm sm:text-base leading-tight font-medium text-black hover:underline"
            >
              {course.title}
            </a>
          </Link>

          <p className="mt-2 mb-4 text-gray-500 text-sm xs:text-base">
            {course.description.substring(0, 70)}...
          </p>
          {Footer && (
            <div className="my-1">
              <Footer />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
