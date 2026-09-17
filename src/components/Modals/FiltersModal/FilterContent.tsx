"use client";
import { FiltersMap, ISchoolFilters } from "@/api/schools";
import { MultiRangeSlider } from "@/components/MultiRangeSlider";
import React, { FC, Fragment } from "react";

type FilterContentProps = {
  filters: ISchoolFilters;
  setFilters: (newVal: ISchoolFilters) => void;
  filtersMap: FiltersMap;
};
const FilterContent: FC<FilterContentProps> = ({
  filters,
  setFilters,
  filtersMap,
}) => {
  function handleChangeFilters(
    key: keyof ISchoolFilters,
    value: string,
    checked: boolean
  ) {
    if (checked) {
      return setFilters({
        ...filters,
        [key]: [...(filters[key] ?? ([] as any)), value],
      });
    }
    setFilters({
      ...filters,
      [key]: (filters[key] as Array<any>)?.filter(
        (item: string) => item != value
      ),
    });
  }
  return (
    <Fragment>
      <>
        <p className="my-2  text-gray-900 ">Classification</p>
        <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg grid grid-cols-3 ">
          {filtersMap.schoolClassifications.map((classification, idx) => (
            <li
              className="w-full border-b border-gray-200 sm:border-b-0 border-r "
              style={{ flex: "1 0 32%" }}
              key={classification._id}
            >
              <div className="flex items-center ps-3 border-b border-gray-200">
                <input
                  id={`vue-checkbox-list${idx}`}
                  type="checkbox"
                  onChange={(e) =>
                    handleChangeFilters(
                      "classification",
                      classification._id,
                      e.target.checked
                    )
                  }
                  checked={
                    filters.classification?.includes(classification._id) ??
                    false
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded transition-all peer-checked:block"
                />
                <label
                  htmlFor={`vue-checkbox-list${idx}`}
                  className="w-full py-3 ms-2 text-sm font-medium text-gray-900 capitalize "
                >
                  {classification.name}
                </label>
              </div>
            </li>
          ))}
        </ul>

        <p className="my-4  text-gray-900 ">Type of Schools</p>
        <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border-t border-l border-r border-gray-200 rounded-lg grid grid-cols-2 ">
          {filtersMap.schoolTypes.map((type, idx) => (
            <li
              className="w-full border-b border-gray-200 sm:border-b-0 border-r "
              style={{ flex: "1 0 32%" }}
              key={type._id}
            >
              <div className="flex items-center ps-3 border-b border-gray-200">
                <input
                  id={`schoolType-list${idx}`}
                  type="checkbox"
                  onChange={(e) =>
                    handleChangeFilters("type", type._id, e.target.checked)
                  }
                  checked={filters.type?.includes(type._id) ?? false}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded transition-all peer-checked:block"
                />
                <label
                  htmlFor={`schoolType-list${idx}`}
                  className="w-full py-3 ms-2 text-sm font-medium text-gray-900 capitalize "
                >
                  {type.name}
                </label>
              </div>
            </li>
          ))}
        </ul>

        <p className="my-2  text-gray-900 ">Boards</p>
        <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg grid grid-cols-2 ">
          {filtersMap.schoolBoards.map((board, idx) => (
            <li
              className="w-full border-b border-gray-200 sm:border-b-0 border-r "
              key={board._id}
            >
              <div className="flex items-center ps-3 border-b border-gray-200">
                <input
                  id={`schoolBoard-list${idx}`}
                  type="checkbox"
                  onChange={(e) =>
                    handleChangeFilters(
                      "schoolBoards",
                      board._id,
                      e.target.checked
                    )
                  }
                  checked={filters.schoolBoards?.includes(board._id) ?? false}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded transition-all peer-checked:block"
                />
                <label
                  htmlFor={`schoolBoard-list${idx}`}
                  className="w-full py-3 ms-2 text-sm font-medium text-gray-900 capitalize "
                >
                  {board.name}
                </label>
              </div>
            </li>
          ))}
        </ul>
        <div className=" pb-5">
          <MultiRangeSlider
            min={500}
            max={2000000}
            onChange={({ min, max }: { min: number; max: number }) =>
              setFilters({ ...filters, minFees: min, maxFees: max })
            }
          />
        </div>
      </>
    </Fragment>
  );
};

export default FilterContent;
