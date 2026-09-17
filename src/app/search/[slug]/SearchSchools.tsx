"use client";
import React from "react";
import dynamic from "next/dynamic";
import { Container } from "@/components/Container";
import { SchoolList } from "@/components/Listings/SchoolList";
import { SchoolFilters } from "@/components/Listings/SchoolFilters";
import { FiltersMap } from "@/api/schools/ListofSchools";
import { SchoolList as ISchools } from "@/api/schools";

const FiltersBar = dynamic(() => import("@/components/FiltersBar/component"), {
  ssr: false,
});
const FiltersModal = dynamic(
  () => import("@/components/Modals").then((mod) => mod.FiltersModal),
  { ssr: false }
);

interface SchoolData {
  totalCount?: number;
  schools?: ISchools[];
}

interface SearchSchoolsProps {
  filtersMap?: FiltersMap; // Define the type of filtersMap appropriately
  schoolsData: SchoolData; // Define the type of schoolsData appropriately
}

const SearchSchools: React.FC<SearchSchoolsProps> = ({
  filtersMap,
  schoolsData,
}) => {
  return (
    <>
      <FiltersBar />
      {filtersMap && <FiltersModal filtersMap={filtersMap} />}
      <Container bgColor="!px-6">
        <div className="md:flex gap-4">
          {filtersMap && <SchoolFilters filtersMap={filtersMap} />}
          <SchoolList
            schools={schoolsData.schools ?? []}
            totalCount={schoolsData.totalCount ?? 0}
          />
        </div>
      </Container>
    </>
  );
};

export default SearchSchools;
