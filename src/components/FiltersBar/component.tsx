"use client";
import useSearchModal from "@/hooks/useModal";
import React, { Fragment, useState } from "react";
import { BsSortAlphaUp } from "react-icons/bs";
import { LiaFilterSolid } from "react-icons/lia";
import dynamic from "next/dynamic";

const BottomSheet = dynamic(() => import("@/components/BottomSheet"), {
  ssr: false,
});

const SortBy = dynamic(() => import("@/components/SortBy/component"), {
  ssr: false,
});

const FiltersBar = () => {
  const filtersModal = useSearchModal();
  const [show, setShow] = useState(false);
  return (
    <Fragment>
      <div className="lg:hidden  fixed bottom-0 right-0 left-0 w-full flex gap-4 items-center justify-center p-4 bg-white border-t-2 shadow-2xl z-20 ">
        <div
          className="border-r border-black flex items-center justify-center gap-2 w-full"
          onClick={() => setShow(true)}
        >
          <BsSortAlphaUp size={24} className="text-green-500" />
          <p className=" font-semibold text-base">Sort By</p>
        </div>
        <div
          className=" flex items-center  justify-center gap-2 w-full"
          onClick={filtersModal.onOpen}
        >
          <LiaFilterSolid size={24} className="text-green-500" />
          <p className="font-semibold text-base">Filters</p>
        </div>
      </div>
      <BottomSheet show={show} onHide={() => setShow(false)}>
        <SortBy onClose={() => setShow(false)} showBtn />
      </BottomSheet>
    </Fragment>
  );
};

export default FiltersBar;
