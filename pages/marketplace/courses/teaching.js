import { useAccount, useOwnedCourses } from "@components/hooks/web3";
import { useWeb3 } from "@components/providers";
import { Button, Message } from "@components/ui/common";
import { OwnedCourseCard } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { getMyTeachingCourses } from "@content/courses/fetcher";
import Link from "next/link";
import { useRouter } from "next/router";

export default function TeachingCourses({ courses }) {
  const { requireInstall } = useWeb3();
  const router = useRouter();
  const { account } = useAccount();
  const  teachingCourses = getMyTeachingCourses();

  return (
    <> 
      <MarketHeader />
      <section className="grid grid-cols-1">
        {teachingCourses.data ? (
          <div>tem</div>
        ) : (
          <div>
            <Message type="warning">
              <div>You don&apos;t own any courses</div>
              <Link href="/marketplace" legacyBehavior>
                <a className="font-normal hover:underline">
                  <i>Create course</i>
                </a>
              </Link>
            </Message>
          </div>
        )}
      </section>
    </>
  );
}

export function getServerSideProps() {
  const { data } = getMyTeachingCourses();
  console.log(data);
  return {
    props: {
      courses: data,
    },
  };
}

TeachingCourses.Layout = BaseLayout;
