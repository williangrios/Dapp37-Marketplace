import { useEthPrice, COURSE_PRICE } from "@components/hooks/useEthPrice";
import { Loader } from "@components/ui/common";
import Image from "next/legacy/image";

export default function EthRates() {
  const { eth } = useEthPrice();

  return (
    <div className="flex flex-col xs:flex-row text-center">
      <div className="p-6 border drop-shadow rounded-md mr-2">
        <div className="flex items-center justify-center">
          {!eth.data ? (
            <div className="w-full flex justify-center pb-4">
              <Loader size="md" />
            </div>
          ) : (
            <>
              <Image
                layout="fixed"
                height="35px"
                width="35px"
                src="/small-eth.webp"
              />
              <span className="text-xl font-bold">ETH = {eth.data}</span>
            </>
          )}
        </div>
        <p className="text-lx text-gray-500">Current eth Price</p>
      </div>
      <div className="p-6 border drop-shadow rounded-md">
        <div className="flex items-center justify-center">
          {!eth.data ? (
            <div className="w-full flex justify-center pb-4">
              <Loader size="md" />
            </div>
          ) : (
            <>
              <span className="text-2xl font-bold">{eth.perItem}</span>
              <Image
                layout="fixed"
                height="35px"
                width="35px"
                src="/small-eth.webp"
              />
              <span className="text-xl font-bold"> = {COURSE_PRICE} $</span>
            </>
          )}
        </div>
        <p className="text-lg text-gray-500">Price per course</p>
      </div>
    </div>
  );
}
