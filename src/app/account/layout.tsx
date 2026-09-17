"use client";
import { Container } from "@/components/Container";
import { removeUserToken } from "@/helpers";
import useAuthStore from "@/hooks/useUserState";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { MdDeleteOutline } from "react-icons/md";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const state = useAuthStore();
  const logOut = () => {
    removeUserToken();
    window.location.reload();
  };
  if (!state.isLoaded) return;

  if (state.isAuthenticated)
    return (
      <Container>
        <div className=" flex flex-col md:flex-row  gap-10  flex-auto flex-shrink-0  text-gray-800 relative">
          <div className=" flex flex-col  left-0 lg:min-w-72 bg-white h-full border rounded shadow lg:sticky lg:top-24 ">
            <div className="overflow-y-auto overflow-x-hidden flex-grow">
              <ul className="flex flex-col py-4 space-y-1">
                <li className="px-5">
                  <div className="flex flex-row items-center h-8">
                    <div className="text-sm font-light tracking-wide text-gray-500">
                      Menu
                    </div>
                  </div>
                </li>
                <li>
                  <Link
                    href="/account/profile"
                    className={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-green-500 border-l-4  hover:border-green-500 border-transparent ${
                      pathName === "/account/profile" &&
                      " border-l-4 !border-green-500  text-green-500 bg-gray-50"
                    } pr-6`}
                  >
                    <span className="inline-flex justify-center items-center ml-4">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </span>
                    <span className="ml-2 text-sm tracking-wide truncate">
                      Profile
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account/shortlist"
                    className={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-green-500 border-l-4  hover:border-green-500 border-transparent ${
                      pathName === "/account/shortlist" &&
                      " border-l-4 !border-green-500  text-green-500 bg-gray-50"
                    } pr-6`}
                  >
                    <span className="inline-flex justify-center items-center ml-4">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                    </span>
                    <span className="ml-2 text-sm tracking-wide truncate">
                      ShortListed Schools
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account/my-reviews"
                    className={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-green-500 border-l-4  hover:border-green-500 border-transparent ${
                      pathName === "/account/my-reviews" &&
                      " border-l-4 !border-green-500  text-green-500 bg-gray-50"
                    } pr-6`}
                  >
                    <span className="inline-flex justify-center items-center ml-4">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                    </span>
                    <span className="ml-2 text-sm tracking-wide truncate">
                      All Reviews
                    </span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/account/delete"
                    className={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-green-500 border-l-4  hover:border-green-500 border-transparent ${
                      pathName === "/account/delete" &&
                      " border-l-4 !border-green-500  text-green-500 bg-gray-50"
                    } pr-6`}
                  >
                    <span className="inline-flex justify-center items-center ml-4">
                      <MdDeleteOutline size={20} />
                    </span>
                    <span className="ml-2 text-sm tracking-wide truncate">
                      Delete Account
                    </span>
                  </Link>
                </li>
                <li>
                  <div
                    onClick={logOut}
                    className={`relative cursor-pointer flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-green-500 border-l-4  hover:border-green-500 border-transparent  pr-6`}
                  >
                    <span className="inline-flex justify-center items-center ml-4">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                    </span>
                    <span className="ml-2 text-sm tracking-wide truncate">
                      Logout
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          {children}
        </div>
      </Container>
    );
  else redirect("/");
}
