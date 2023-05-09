import { useAccount } from "@components/hooks/web3";
import { Breadcrumbs } from "@components/ui/common";
import { EthRates, WalletBar } from "@components/ui/web3";

const LINKS = [
  {
    href: "/marketplace",
    value: "Buy",
  },
  {
    href: "/marketplace/courses/owned",
    value: "My Learning",
  },
  {
    href: "/marketplace/courses/teaching",
    value: "Teaching",
  },
  {
    href: "/marketplace/courses/managed",
    value: "Manage Courses",
    requireAdmin: true
  },
];

export default function Header() {

  const {account} = useAccount()

  return (
    <>
      <WalletBar />
      <EthRates />
      <Breadcrumbs isAdmin={account.isAdmin} items={LINKS} />
    </>
  );
}
