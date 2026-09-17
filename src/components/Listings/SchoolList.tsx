"use client";
import { VIEW_TYPE } from "@/constants";
import useSearchModal from "@/hooks/useModal";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa6";
import { ListGridToogle } from "../ListGridToggle";
import { SchoolList as ISchools } from "@/api/schools";
import Schools from "./Schools";
import dynamic from "next/dynamic";
import useFilterStore from "@/hooks/useFiltersStore";
import { BiSearch } from "react-icons/bi";

type SchoolListProps = {
  schools: ISchools[];
  totalCount: number;
};

const LoadMore = dynamic(
  () => import("./LoadMoreSchools").then((mod) => mod.LoadMore),
  { ssr: false },
);

const NoDataFound = dynamic(() => import("../NoDataFound"), { ssr: false });

const SchoolList: FC<SchoolListProps> = ({ schools, totalCount }) => {
  const searchParams = useSearchParams();
  const [view, setView] = useState(VIEW_TYPE.GRIDVIEW);
  const filterModal = useSearchModal();
  const store = useFilterStore();
  const { slug } = useParams();
  const router = useRouter();
  // ✅ FIX: name search ke liye city URL se store mein seed karo
  const cityParam = searchParams.get("city") ?? undefined;
  const handleListClick = () => {
    setView(VIEW_TYPE.LISTVIEW);
  };
  const handleGridClick = () => {
    setView(VIEW_TYPE.GRIDVIEW);
  };

  function hasQueryParams(url: string) {
    return url.includes("?");
  }

  useEffect(() => {
    // Scroll to a specific section when the query parameters change
    const handleScroll = () => {
      if (hasQueryParams(window.location.href)) {
        const sectionElement = document.getElementById("Schools-List");
        if (sectionElement) {
          const offsetTop = sectionElement.offsetTop;
          window.scrollTo({ top: offsetTop - 50, behavior: "smooth" });
        }
      }
    };
    // Call handleScroll immediately to handle the initial scroll when the component mounts
    handleScroll();
  }, [searchParams]);

  return (
    <div className="md:p-6 w-full" id="Schools-List">
      <div className="flex items-center justify-between mb-4">
        <p className={` text-xl lg:text-3xl font-bold  mx-0  `}>
          List of All <span className="text-greenish-light">Schools</span>{" "}
          <span className=" text-sm ">(Found {totalCount})</span>
        </p>
        <div className="flex gap-x-2">
          <div
            className="block shadow-md xl:hidden p-3 rounded-full bg-white border text-green-500 "
            onClick={filterModal.onOpen}
          >
            <FaFilter />
          </div>
          <ListGridToogle
            view={view}
            handleGridClick={handleGridClick}
            handleListClick={handleListClick}
          />
        </div>
      </div>
      <div className="my-3 flex justify-between items-center gap-x-2">
        <input
          placeholder="Search Schools"
          className={`
          peer
          w-full
          px-2
          h-[40px]
          leading-[40px]
          font-light 
          bg-white 
          border
          border-[#cccccc]
          rounded-md
          outline-none
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          placeholder:text-[#808080]
          pl-2
          focus:border-2 focus:border-black
          
        `}
          onChange={({ target }) =>
            // ✅ FIX: city bhi preserve karo jab name type karo
            store.setFilters({
              ...store.filters,
              city: store.filters.city ?? cityParam,
              name: target.value,
            })
          }
        />
        <button
          className="
            p-2 
            bg-green-500 
            rounded-full 
            text-white
          "
          onClick={() => store.applyFilters(slug, router)}
        >
          <BiSearch size={18} />
        </button>
      </div>
      {schools.length < 1 && <NoDataFound />}
      <div
        className={`
        flex flex-col gap-6 items-center
          ${view === VIEW_TYPE.GRIDVIEW && "md:grid md:grid-cols-2  md:gap-6 "}
        `}
      >
        <Schools view={view} schools={schools} />
        <LoadMore view={view} totalCount={totalCount} />
      </div>
    </div>
  );
};

export { SchoolList };
