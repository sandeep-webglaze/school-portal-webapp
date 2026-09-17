import React, { useContext } from "react";
import {
  HiOutlineAcademicCap,
  HiPencilAlt,
  HiOutlineTrash,
} from "react-icons/hi";
import Image from "next/image";
import useAuthStore from "@/hooks/useUserState";
import { IUser, updateUser } from "@/api/CurrentUser";
import toast from "react-hot-toast";

export function Profilecard() {
  const store = useAuthStore();
  const user = store.user;
  const [open, setOpen] = React.useState(false);
  const [deletephoto, setDeletephoto] = React.useState(false);

  function modalOpen() {
    setOpen(!open);
  }

  const changeStoreUserImage = (image?: string | null) => {
    if (user == null || image === undefined) return;
    const newUser = { ...user, imageUrl: image };
    store.setAuthStore({
      isAuthenticated: true,
      user: newUser,
    });
  };

  const changeProfileImage = async (image?: string | null) => {
    try {
      const res = await updateUser({ imageUrl: image });
      if (!res.data) {
        toast.error("Something Went Wrong!", {
          id: "userImgError",
        });
      } else {
        toast.success("Profile image updated Successfully", {
          id: "userImguccess",
        });
        changeStoreUserImage(image);
      }
    } catch (err: any) {
      console.log("Err in Updating User=>", err);
      if (err && err["error"] != null) {
        toast.error(err.error?.displayMessage ?? "Something Went Wrong!", {
          id: "userImgError",
        });
      } else
        toast.error("Something Went Wrong!", {
          id: "userImgError",
        });
    }
  };

  return (
    <>
      <div className="shadow-lg max-w-[300px] rounded-2xl w-full bg-white  border relative">
        <div className="flex flex-col items-center justify-center p-6">
          <div className="absolute top-5 right-5">
            <HiOutlineTrash
              size="28"
              color="gray"
              className="cursor-pointer"
              onClick={() => setDeletephoto(!deletephoto)}
            />
          </div>
          <div className="block relative rounded-full border max-h-16 max-w-16">
            <Image
              alt="profile"
              src={user?.imageUrl ?? "/images/placeholder.webp"}
              width={64}
              height={64}
              className=" object-cover rounded-full "
            />
          </div>
          <div className="-mt-[216px] ml-[62px] absolute rounded-full bg-white p-1 ">
            <HiPencilAlt
              size="35"
              color="green"
              onClick={modalOpen}
              className="cursor-pointer"
            />
          </div>
          <p className="text-gray-800  text-xl md:text-2xl font-medium mt-4">
            {user?.name}
          </p>

          <div className=" mt-3 rounded-full flex items-center justify-center bg-green-600 p-1 w-full">
            <div className="p-1">
              <p className="text-sm md:text-md tracking-wide text-center text-white">
                Email - {user?.mail}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
