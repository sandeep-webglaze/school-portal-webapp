"use client";

import { HomePageSlug, ICity } from "@/api/HomePage";
import { SchoolList, getAllSchools } from "@/api/schools";
import { useEffect, useState } from "react";
import Select from "react-select";
import { toTitleCase } from "@/helpers/functions";

interface SchoolSearchProps {
  city?: ICity;
  value?: SchoolList;
  placeHolder?: string;
  isDisabled?: boolean;
  onChange: (value: SchoolList) => void;
}

const SchoolSearch: React.FC<SchoolSearchProps> = ({
  value,
  onChange,
  city,
  isDisabled = false,
}) => {
  const [search, setSearch] = useState("");
  const [schools, setSchools] = useState<SchoolList[]>();

  useEffect(() => {
    if (city?._id)
      getAllSchools({ city: city._id }).then((res) => {
        setSchools(res.data?.schools as unknown as SchoolList[]);
      });
  }, [city]);

  return (
    <div className="w-full">
      <Select
        isDisabled={isDisabled}
        className="text-xs md:text-sm font-normal text-start"
        placeholder="Select School"
        isClearable
        menuPlacement="auto"
        minMenuHeight={300}
        // components={isMobile ? { DropdownIndicator: ()=> null , IndicatorSeparator:() => null } : {}}
        isOptionSelected={(option) => option._id === value?._id}
        options={schools}
        value={value === undefined ? "" : value}
        onChange={(value) => onChange(value as SchoolList)}
        formatOptionLabel={(option: any) => (
          <div className="z-100 flex flex-row items-center " key={option._id}>
            <div>{toTitleCase(option?.name)}</div>
          </div>
        )}
        classNames={{
          control: () => " ",
          input: () => "text-lg",
          option: () => "text-lg",
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: "#16a34a",
            primary25: "#fffff",
          },
        })}
      />
    </div>
  );
};

export { SchoolSearch };