"use client";
import React, { FC, useCallback, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { SchoolTypeSelect } from "../SchoolTypeSelect";
import { CitySelect } from "../LocationSelect";
import { HomePageSlug, ICity } from "@/api/HomePage";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type SearchBarProps = {
  citiesList?: ICity[];
  schoolTypeList?: HomePageSlug[];
};

const SearchBar: FC<SearchBarProps> = ({ citiesList, schoolTypeList }) => {
  const [schoolType, setSchoolType] = useState<HomePageSlug>();
  const [city, setCity] = useState<ICity>();
  const router = useRouter();

  const compareObjects = (obj1: any, obj2: any) =>
    JSON.stringify(obj1) === JSON.stringify(obj2);

  const handleSearchClick = () => {
    if (!schoolType) {
      return toast.error("Please select School Type first", {
        id: "searchError_schoolType",
        duration: 3000,
      });
    }
    if (!city) {
      return toast.error("Please select a City", {
        id: "searchError_city",
        duration: 3000,
      });
    }

    const { _id, id, city: s, ...selectedSchoolCategoryFilter } =
      schoolType.filters;

    // ✅ Step 1: Try to find exact pre-built slug for this city + schoolType
    const matchedSlug = schoolTypeList?.find(
      ({ filters: { school, _id, id, ...schoolFilters }, _id: categoryId }) =>
        schoolType?._id !== categoryId &&
        compareObjects(
          { city: city._id, ...selectedSchoolCategoryFilter },
          schoolFilters
        )
    )?.slug;

    if (matchedSlug) {
      // Popular city — pre-built slug exists e.g. /search/boys-schools-in-delhi
      return router.push(`/search/${matchedSlug}`);
    }

    // ✅ Step 2: No pre-built slug — strip city from base slug, pass city as query param
    // "boys-schools-in-delhi" → "boys-schools-in-delhi" + ?city=<any_city_id>
    // Backend getAllSchools accepts both categorySlug + city filter together
    const baseSlug = schoolType.slug;

    if (!baseSlug) {
      return toast.error("No results found. Please try another combination.", {
        id: "searchError_noslug",
        duration: 3000,
      });
    }

    // Navigate with city as query param — works for ANY city, not just popular ones
    return router.push(`/search/${baseSlug}?city=${city._id}`);
  };

  const handleChangeCateogary = useCallback(
    (category: HomePageSlug) => {
      if (!category) {
        setSchoolType(undefined);
        setCity(undefined);
        return;
      }
      setSchoolType(category);
      setCity(undefined);
    },
    []
  );

  return (
    <div className="border w-full md:w-auto py-2 rounded-full shadow-xl transition bg-white text-gray-500 px-1">
      <div className="flex flex-row items-center justify-between">
        <div className="text-sm px-2 w-[70%] md:w-5/12 md:px-4">
          <SchoolTypeSelect
            placeHolder="School Type"
            onChange={handleChangeCateogary}
            value={schoolType}
            SchoolTypeList={
              schoolTypeList?.filter((school) => school.isHomepageSlug) ?? []
            }
          />
        </div>

        {/* ✅ cityList prop hata diya — CitySelect ab apni API se
            koi bhi city search kar sakta hai, sirf popular cities nahi */}
        <CitySelect
          placeHolder="Search City"
          value={city}
          textSize="small"
          positioningSm
          onChange={(value: ICity) => setCity(value)}
        />

        <div className="text-sm pl-2 md:pl-4 pr-2 text-gray-600 flex flex-row items-center gap-1 md:gap-3">
          <button
            className="p-2 bg-green-500 rounded-full text-white"
            onClick={handleSearchClick}
            aria-label="Search schools"
          >
            <BiSearch size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export { SearchBar };