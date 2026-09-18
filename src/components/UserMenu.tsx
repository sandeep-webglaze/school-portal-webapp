"use client";
import { SetStateAction, useCallback, useRef, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { useRouter } from "next/navigation";
import useLoginModal from "@/hooks/useLoginModal";
import Avatar from "./Avatar";
import useOutsideClick from "@/hooks/useOutsideClick";
import useAuthStore from "@/hooks/useUserState";
import { removeUserToken } from "@/helpers";
import { CgProfile } from "react-icons/cg";

interface UserMenuProps {}
const UserMenu: React.FC<UserMenuProps> = () => {
  const { user: currentUser } = useAuthStore();
  const router = useRouter();
  const ref = useRef();

  useOutsideClick(ref, () => setIsOpen(false));
  const loginModal = useLoginModal();

  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const signOut = () => {
    setIsOpen(false);
    removeUserToken();
    window.location.reload();
  };

  if (currentUser)
    return (
      <div className="relative">
        <div
          onClick={toggleOpen}
          className="
          md:py-1
          md:px-2
          border-[1px]
          border-neutral-200
          flex
          flex-row
          items-center
          gap-3
          rounded-full
          cursor-pointer
          hover:shadow-md
          transition
          "
        >
          <div className="">
            <Avatar src={currentUser?.imageUrl} />
          </div>
          <AiOutlineMenu className="hidden md:block" />
        </div>
        {isOpen && (
          <div
            ref={ref as any}
            className="
            absolute
            shadow-lg
            rounded-xl
            border
            min-w-[150px]
            max-w-max
            bg-white
            overflow-hidden
            right-0
            top-12
            text-sm
          "
          >
            <div className="flex flex-col cursor-pointer">
              {currentUser && (
                <>
                  <MenuItem
                    label="My Account"
                    setIsOpen={setIsOpen}
                    onClick={() => router.push("/account/profile")}
                  />
                  <MenuItem
                    label="ShortListed Schools"
                    setIsOpen={setIsOpen}
                    onClick={() => router.push("/account/shortlist")}
                  />
                  <MenuItem
                    label="Logout"
                    setIsOpen={setIsOpen}
                    onClick={() => signOut()}
                  />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  // Highlighted "Login" pill (bordered → fills on hover)
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border-2 border-green-600 px-4 py-2 text-sm font-semibold text-green-600 hover:bg-green-600 hover:text-white cursor-pointer transition-colors"
      onClick={loginModal.onOpen}
    >
      <CgProfile size={18} />
      <span>Login</span>
    </div>
  );
};

export default UserMenu;

interface MenuItemProps {
  onClick: () => void;
  label: string;
  setIsOpen: (value: SetStateAction<boolean>) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ onClick, label, setIsOpen }) => {
  return (
    <div
      onClick={() => {
        setIsOpen(false);
        onClick();
      }}
      className="
        px-4
        py-3
        hover:bg-grayish-light
        transition
        font-semibold
      "
    >
      {label}
    </div>
  );
};
