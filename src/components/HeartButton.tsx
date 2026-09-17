"use client";
import revalidateSchools from "@/actions/revalidate-schools";
import revalidateShortList from "@/actions/revalidate-shortlist";
import { removeFavorite, toogleFavorite } from "@/api/shortlist";
import { getToken } from "@/helpers";
import useLoginModal from "@/hooks/useLoginModal";
import useAuthStore from "@/hooks/useUserState";
import { useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface HeartButtonProps {
  listingId: string;
  isFavorite: boolean;
  onToggle: Function;
}

const HeartButton: React.FC<HeartButtonProps> = ({
  listingId,
  isFavorite,
  onToggle,
}) => {
  const { user: currentUser } = useAuthStore();
  const loginModal = useLoginModal();
  // Use a ref for the debounce timer instead of state — we never render based
  // on the timer value, so state would just cause needless re-renders and
  // force `timer` into the useCallback deps (where its identity changes
  // every click would re-create the callback).
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // Same trick for `onToggle` — keep the latest function in a ref so the
  // callback below doesn't need to depend on it (parents rarely memoize
  // their onToggle prop, which would otherwise re-create this callback
  // on every parent render).
  const onToggleRef = useRef(onToggle);
  onToggleRef.current = onToggle;
  const callbackDelay = 200;

  const toggleFavorite = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.preventDefault();
      if (!currentUser) {
        return loginModal.onOpen();
      }
      const token = getToken();
      if (!token) return;
      onToggleRef.current();
      if (timerRef.current) {
        clearTimeout(timerRef.current); // Clear the previous timer if it exists
      }
      timerRef.current = setTimeout(async () => {
        try {
          if (isFavorite) {
            const res = await removeFavorite(token, listingId);
            if (res.data) {
              toast.success("School Successfully Removed from Shortlist");
              revalidateSchools();
              revalidateShortList();
            }
          } else {
            const res = await toogleFavorite(token, listingId);
            if (res.data) {
              toast.success("School Successfully Added in Shortlist");
              revalidateShortList();
              revalidateSchools();
            }
          }
        } catch (error) {
          console.log("error in toogle heart=>,", error);
          toast.error("Something went wrong.");
        }
      }, callbackDelay);
    },
    [currentUser, listingId, loginModal, isFavorite]
  );

  return (
    <div
      onClick={toggleFavorite}
      className="
        hover:opacity-80
        transition
        cursor-pointer
      "
    >
      <div className="relative">
        <AiOutlineHeart
          size={28}
          className="
          fill-white
          absolute
          -top-[2px]
          -right-[2px]
        "
        />
        <AiFillHeart
          size={24}
          className={isFavorite ? "fill-rose-500" : "fill-neutral-500/70"}
        />
      </div>
    </div>
  );
};

export default HeartButton;
