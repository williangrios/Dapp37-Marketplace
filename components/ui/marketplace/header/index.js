import { Breadcrumbs } from "@components/ui/common";
import { EthRates, WalletBar } from "@components/ui/web3";

const LINKS = [
  {
    href: "/marketplace",
    value: "Buy",
  },
  {
    href: "/marketplace/courses/owned",
    value: "My Courses",
  },
  {
    href: "/marketplace/courses/managed",
    value: "Manage Courses",
  },
];

export default function Header() {
  return (
    <>
      <WalletBar />
      <EthRates />
      <Breadcrumbs items={LINKS} />
    </>
  );
}
