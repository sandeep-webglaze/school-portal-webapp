import React from "react";
import Select, { StylesConfig } from "react-select";
import { HomePageSlug } from "@/api/HomePage";

interface SchoolTypeSelectProps {
  SchoolTypeList: HomePageSlug[];
  value?: HomePageSlug;
  placeHolder?: string;
  onChange: (value: HomePageSlug) => void;
}

const styles: StylesConfig<HomePageSlug, false> = {
  control: (base) => ({
    ...base,
    height: "40px",
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    height: "40px",
  }),

  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: "40px",
  }),
  option: (base) => ({
    ...base,
    color: "inherit",
    "&:hover": {
      background: "#16a34a",
      color: "#fff",
    },
  }),
  menu: (base) => ({
    ...base,
    "@media (max-width: 450px)": {
      left: "0px",
      width: "280px",
    },
  }),
};

const SchoolTypeSelect: React.FC<SchoolTypeSelectProps> = ({
  value,
  SchoolTypeList,
  onChange,
}) => {
  return (
    <div className="w-full z-50">
      {/* Set the height here */}
      <Select
        id="schoolTypeSelect"
        className="text-xs  sm:text-sm lg:text-base  font-normal text-start"
        placeholder="School Type"
        isClearable
        menuPlacement="auto"
        menuPosition="absolute"
        styles={styles}
        isOptionSelected={(option) => option._id === value?._id}
        options={SchoolTypeList}
        value={value ?? ""}
        onChange={(value) => onChange(value as HomePageSlug)}
        formatOptionLabel={(option: any) => (
          <div
            className="z-100 flex flex-row items-center cursor-pointer"
            key={option._id}
          >
            <div className="capitalize">{option?.formattedText}</div>
          </div>
        )}
        classNames={{
          control: () => " cursor-pointer",
          input: () => "text-lg cursor-pointer",
          option: () => "text-lg cursor-pointer ",
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

export { SchoolTypeSelect };
