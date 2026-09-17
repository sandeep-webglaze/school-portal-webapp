"use client";
import React, { FC, useEffect, useMemo } from "react";
import { Button } from "../Button";
import FilterContent from "../Modals/FiltersModal/FilterContent";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import useFilterStore from "@/hooks/useFiltersStore";
import { FiltersMap, ISchoolFilters, SortFilters } from "@/api/schools";
import SortBy from "../SortBy/component";
import { removeNullOrUndefinedEmptyFields } from "@/helpers";
import { GrPowerReset } from "react-icons/gr";

export type SchoolFiltersProps = {
  filtersMap: FiltersMap;
};
export const SchoolFilters: FC<SchoolFiltersProps> = (props) => {
  const router = useRouter();
  const { slug } = useParams();
  const store = useFilterStore();
  // Pulled out via selector so we get a STABLE function reference between
  // renders — using `store.setFilters` directly in deps would re-fire the
  // sync effect on every render (the `store` object identity changes).
  const setFilters = useFilterStore((s) => s.setFilters);
  const searchParams = useSearchParams();
  const minFees = searchParams.get("minFees");
  const maxFees = searchParams.get("maxFees");
  const city = searchParams.get("city"); // ✅ city URL se read karo

  const queryData = useMemo<ISchoolFilters>(() => {
    const classification = searchParams.getAll("classification");
    const schoolBoards = searchParams.getAll("schoolBoards");
    const type = searchParams.getAll("type");
    const sortBy = (searchParams.get("sortBy") ?? undefined) as SortFilters;
    const cityParam = searchParams.get("city") ?? undefined;
    const filters: ISchoolFilters = {
      classification,
      schoolBoards,
      type,
      sortBy,
      city: cityParam, // ✅ city filter mein include karo
    };
    return filters;
  }, [searchParams]);

  useEffect(() => {
    if (minFees && maxFees) {
      queryData.maxFees = Number(maxFees);
      queryData.minFees = Number(minFees);
    }
    // if (typeof queryData.sortBy === "string")
    //   queryData.sortBy = JSON.parse(queryData.sortBy);
    setFilters(queryData);
    // queryData is already memoized on `searchParams`; minFees/maxFees come
    // from the same searchParams so `queryData` covers them, but listing
    // them explicitly satisfies the linter and documents intent.
  }, [queryData, minFees, maxFees, setFilters]);

  const resetFilters = () => {
    // ✅ FIX: reset ke baad city preserve karo — user ki city gayab na ho
    const cityParam = searchParams.get("city");
    store.resetFilters();
    if (cityParam) store.setFilters({ city: cityParam });
    store.applyFilters(slug, router);
  };

  const isFilters =
    Object.keys(removeNullOrUndefinedEmptyFields(store.filters)).length === 0 &&
    Object.keys(removeNullOrUndefinedEmptyFields(queryData)).length === 0;

  return (
    <div className="hidden xl:block max-w-[450px] h-max w-full bg-white border filters-position   rounded-md p-6 overflow-hidden ">
      <div className="flex justify-between items-center py-2">
        <p className="text-2xl font-bold text-blacky-default">Filters</p>
        {!isFilters && (
          <div
            className="text-green-500 font-semibold cursor-pointer flex items-center gap-x-2"
            onClick={resetFilters}
          >
            <GrPowerReset />
            <p>Reset Filters</p>
          </div>
        )}
      </div>
      <SortBy />
      <FilterContent
        {...props}
        filters={store.filters}
        setFilters={store.setFilters}
      />
      <div className="py-2">
        <Button
          fullWidth
          disabled={isFilters}
          label={"Apply"}
          onClick={() => store.applyFilters(slug, router)}
        />
      </div>
    </div>
  );
};
