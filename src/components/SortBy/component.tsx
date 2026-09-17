"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { FC, Fragment, useMemo } from "react";

import { PiCurrencyInrThin, PiListThin, PiStarThin } from "react-icons/pi";
import qs from "query-string";
import useFilterStore from "@/hooks/useFiltersStore";
import { SortFilters } from "@/api/schools";
import { SORTING_TYPE } from "@/constants";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Button } from "../Button";
import { removeNullOrUndefinedEmptyFields } from "@/helpers";
import "react-perfect-scrollbar/dist/css/styles.css";

type SortByProps = {
  showBtn?: boolean;
  onClose?: Function;
};
const SortBy: FC<SortByProps> = ({ showBtn = false, onClose = () => {} }) => {
  const router = useRouter();
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const sortBy = qs.parse(searchParams.getAll("sortBy") as unknown as string);
  const store = useFilterStore();

  const parsedSortBy: SortFilters = useMemo(() => {
    if (typeof store.filters.sortBy === "string")
      return JSON.parse(store.filters.sortBy);
    return store.filters.sortBy;
  }, [store.filters.sortBy]);

  const handleChangeSortBy = (key: keyof SortFilters, value: SORTING_TYPE) => {
    if (store.filters.sortBy && store.filters.sortBy[key]) {
      const newFilters = { ...store.filters };
      delete newFilters?.sortBy?.[key];
      return store.setFilters(removeNullOrUndefinedEmptyFields(newFilters));
    }
    store.setFilters({
      ...store.filters,
      sortBy: { [key]: value },
    });
  };

  const handleResetSortBy = () => {
    const { sortBy, ...rest } = store.filters;
    // ✅ FIX: city preserve karo sort reset pe bhi
    const cityParam = searchParams.get("city") ?? undefined;
    store.setFilters({
      ...rest,
      city: rest.city ?? cityParam,
    });
    store.applyFilters(slug, router);
    onClose();
  };

  const handleApply = () => {
    store.applyFilters(slug, router);
    onClose();
  };

  return (
    <Fragment>
      <PerfectScrollbar>
        <div className="flex  gap-3 items-center  w-full my-2">
          <SortByCard
            selected={Boolean(parsedSortBy?.isFeatured)}
            handleChange={() =>
              handleChangeSortBy("isFeatured", SORTING_TYPE.DESC)
            }
            icon={PiListThin}
            heading={"Popularity"}
            subHeading={" Popularity First"}
          />
          <SortByCard
            selected={Boolean(parsedSortBy?.minFees)}
            handleChange={() => handleChangeSortBy("minFees", SORTING_TYPE.ASC)}
            icon={PiCurrencyInrThin}
            heading={"Price"}
            subHeading={"Low to High"}
          />
          <SortByCard
            selected={Boolean(parsedSortBy?.maxFees)}
            handleChange={() =>
              handleChangeSortBy("maxFees", SORTING_TYPE.DESC)
            }
            icon={PiCurrencyInrThin}
            heading={"Price"}
            subHeading={"High To Low"}
          />
          <SortByCard
            selected={Boolean(parsedSortBy?.avgRating)}
            handleChange={() =>
              handleChangeSortBy("avgRating", SORTING_TYPE.DESC)
            }
            icon={PiStarThin}
            heading={"Ratings"}
            subHeading={"Highest Ratings"}
          />
        </div>
      </PerfectScrollbar>

      {showBtn && (
        <div className="flex gap-4 items-center justify-center w-full px-4 ">
          <Button fullWidth outline label="Reset" onClick={handleResetSortBy} />
          <Button fullWidth label="Save" onClick={handleApply} />
        </div>
      )}
    </Fragment>
  );
};

type SortByCardProps = {
  selected: boolean;
  handleChange: () => void;
  icon: any;
  heading: string;
  subHeading: string;
};
const SortByCard: FC<SortByCardProps> = ({
  selected,
  handleChange,
  heading,
  subHeading,
  ...props
}) => (
  <div
    className={`flex flex-col items-center justify-center py-2 border  border-green-500  h-full rounded shadow-md  cursor-pointer ${
      selected && "bg-green-500 !text-white"
    }`}
    style={{ flex: "0 0 90px" }}
    onClick={handleChange}
  >
    <props.icon
      size={18}
      className={selected ? "text-white font-medium " : "text-green-500   "}
    />
    <p
      className={`text-[12px] font-semibold text-neutral-700  ${
        selected && "text-white"
      }`}
    >
      {heading}
    </p>
    <p
      className={`text-[10px] text-gray-500 font-semibold pt-1  ${
        selected && "text-white"
      }`}
    >
      {subHeading}
    </p>
  </div>
);

export default SortBy;
