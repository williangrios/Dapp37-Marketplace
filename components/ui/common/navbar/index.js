import { useWeb3 } from "@components/providers";
import Button from "../button";
import { useRouter } from "next/router";
import { useAccount } from "@components/hooks/web3";
import ActiveLink from "../link";

export default function Navbar() {
  const { isLoading, connect, requireInstall } = useWeb3();

  const {pathname} = useRouter()
  const { account} = useAccount();

  return (
    <section>
      <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
        <nav className="relative" aria-label="Global">
          <div className="flex flex-col xs:flex-row justify-between items-center">
            <div>
              <ActiveLink href="/">
                <div className="inline font-medium mr-8 text-gray-500 hover:text-gray-900">
                  Home
                </div>
              </ActiveLink>

              <ActiveLink href="/marketplace">
                <div className=" inline font-medium mr-8 text-gray-500 hover:text-gray-900">
                  Marketplace
                </div>
              </ActiveLink>
              <ActiveLink href="/blogs">
                <div className="inline font-medium mr-8 text-gray-500 hover:text-gray-900">
                  Blogs
                </div>
              </ActiveLink>
            </div>
            <div className="text-center">
              <ActiveLink legacyBehavior href="/wishlist">
                <a className="font-medium sm:mr-8 mr-1 text-gray-500 hover:text-gray-900">
                  Wishlist
                </a>
              </ActiveLink>
              {isLoading ? (
                <Button disabled={true}>Loading...</Button>
              ) : account.data ? (
                <Button hoverable={false} className="cursor-default">
                  Hi, there {account.isAdmin && "Admin"}
                </Button>
              ) : requireInstall ? (
                <Button
                  onClick={() =>
                    window.open("https://metamask.io/download.html")
                  }
                >
                  Install Meta
                </Button>
              ) : (
                <Button onClick={connect}>Connect</Button>
              )}
            </div>
          </div>
        </nav>
      </div>
      {account.data && !pathname.includes("/marketplace") && (
        <div className="flex justify-end pt-1 sm:px-6 lg:px-8">
          <div className="text-white bg-indigo-600 rounded-md p-2">
            {account.data}
          </div>
        </div>
      )}
    </section>
  );
}
