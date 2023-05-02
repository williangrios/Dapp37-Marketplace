import { CourseList } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { getAllCourses } from "@content/courses/fetcher";
import { useWalletInfo } from "@components/hooks/web3";
import { MarketHeader } from "@components/ui/marketplace";

export default function Marketplace({courses}) {
  const {hasConnectedWallet, isConnecting} = useWalletInfo();
  

  
  return (
    <>
      <MarketHeader />
      <CourseList courses={courses} hasConnectedWallet={hasConnectedWallet} isConnecting={isConnecting}/>
    </>
  );
}

export function getStaticProps(){
  const {data} = getAllCourses();
  return{
    props: {
      courses: data
    }
  }
}

Marketplace.Layout = BaseLayout