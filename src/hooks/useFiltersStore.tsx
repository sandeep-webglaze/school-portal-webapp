import { ISchoolFilters } from "@/api/schools";
import { NextRouter } from "next/router";
import { create } from "zustand";
import qs from "query-string";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useSearchParams } from "next/navigation";
import { isEmpty } from "@/helpers";

interface FilterStore {
  filters: ISchoolFilters;
  setFilters: (newVal: ISchoolFilters) => void;
  resetFilters: () => void;
  applyFilters: (slug: string | string[], router: AppRouterInstance) => void;
}

const useFilterStore = create<FilterStore>((set) => ({
  filters: {},
  setFilters: (newVal: ISchoolFilters) => set({ filters: newVal }),
  resetFilters: () => set({ filters: {} }),
  applyFilters: (slug: string | string[], router: AppRouterInstance) => {
    // ✅ FIX: spread karo — directly mutate mat karo original store state ko
    const updatedQuery: any = { ...useFilterStore.getState().filters };

    if (isEmpty(updatedQuery.name) || updatedQuery.name == "")
      delete updatedQuery.name;

    if (typeof updatedQuery.sortBy !== "string") {
      updatedQuery.sortBy = JSON.stringify(
        useFilterStore.getState().filters.sortBy,
      );
    }

    // undefined/null sortBy URL mein nahi jaana chahiye
    if (!updatedQuery.sortBy || updatedQuery.sortBy === "undefined")
      delete updatedQuery.sortBy;

    const url = qs.stringifyUrl(
      {
        url: `/search/${slug}`,
        query: updatedQuery,
      },
      { skipNull: true, skipEmptyString: true },
    );
    router.push(url);
  },
}));

export default useFilterStore;
