import Image from "next/legacy/image";
import Link from "next/link";

export default function Card({ course, Footer }) {
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
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            {course.type}
          </div>
          <Link legacyBehavior
            href={`/courses/${course.slug}`}
            className="font-medium mr-8 text-gray-500 hover:text-gray-900"
          >
            <a
                href="#"
                className="block mt-1 text-sm xs:text-lg leading-tight font-medium text-black hover:underline"
            >
            {course.title}
            </a>
          </Link>

          <p className="mt-2 text-gray-500 text-sm xs:text-base">{course.description.substring(0, 70)}...</p>
          {Footer && <Footer />}
        </div>
      </div>
    </div>
  );
}
