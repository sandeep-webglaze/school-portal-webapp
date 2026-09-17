"use client";

import { ICity } from "@/api/HomePage";
import { getCities } from "@/api/city";
import useCityStore from "@/hooks/useCityStore";
import { useEffect, useMemo, useRef, useState } from "react";
import Select, { GroupBase, StylesConfig } from "react-select";
import Image from "next/image";

interface CitySelectProps {
  value?: ICity;
  cityList?: ICity[];
  placeHolder?: string;
  isDisabled?: boolean;
  onChange: (value: ICity) => void;
  positioningSm?: boolean;
  required?: boolean;
  textSize?: "small" | "medium" | "large";
}

const CitySelect: React.FC<CitySelectProps> = ({
  value,
  cityList,
  placeHolder,
  isDisabled = false,
  positioningSm = false,
  onChange,
  required,
  textSize = "medium",
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  // Pulled via selectors so we get stable references — using `useCityStore()`
  // (no selector) returns a new object reference on every store mutation,
  // which would re-fire any effect that depends on it.
  const cities = useCityStore((s) => s.cities);
  const setCities = useCityStore((s) => s.steCities);
  const [searchResults, setSearchResults] = useState<ICity[] | null>(
    cityList ?? cities,
  );

  // ✅ FIX Bug 2: ref always holds the latest inputValue
  // so async searchCities() never uses a stale value
  const inputValueRef = useRef(inputValue);
  inputValueRef.current = inputValue;

  const styles: StylesConfig<ICity, false, GroupBase<ICity>> = {
    control: (base) => ({
      ...base,
      minHeight: "40px",
      fontSize:
        textSize === "small" ? "16px" : textSize === "large" ? "18px" : "16px",
      "@media (max-width: 1024px)":
        textSize === "small" ? { fontSize: "14px" } : {},
      "@media (max-width: 640px)":
        textSize === "small" ? { fontSize: "12px" } : {},
    }),
    option: (base) => ({
      ...base,
      fontSize:
        textSize === "small" ? "16px" : textSize === "large" ? "18px" : "16px",
      color: "inherit",
      "&:hover": { background: "#16a34a", color: "#fff" },
      "@media (max-width: 1024px)":
        textSize === "small" ? { fontSize: "14px" } : {},
      "@media (max-width: 640px)":
        textSize === "small" ? { fontSize: "12px" } : {},
    }),
    menu: (base) =>
      positioningSm
        ? {
            ...base,
            "@media (max-width: 450px)": { left: "-100px", width: "280px" },
          }
        : { ...base },
  };

  useEffect(() => {
    // Mount-only city fetch — only runs if the global store hasn't loaded
    // cities yet. We deliberately use the stable `cities` / `setCities`
    // selector references (above) so this effect can run exactly once.
    if (cities !== null) return;
    setIsLoading(true);
    getCities()
      .then((res) => {
        if (res.data) setCities(res.data);
      })
      .catch((err) => console.error("❌ Error fetching cities:", err))
      .finally(() => setIsLoading(false));
    // Intentional: this is a one-shot bootstrap effect. We don't want to
    // re-fetch every time `cities` changes (we just set it!) or `setCities`
    // identity churns. Selectors make those stable but we still pin to [].
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Reset visible results to the full list when the search box is empty.
    // `inputValue` MUST be in deps so the effect re-runs when the user
    // clears the input — the inner `if` then short-circuits for non-empty
    // values, so this stays cheap.
    if (inputValue === "") {
      setSearchResults(cityList ?? cities);
    }
  }, [cityList, cities, inputValue]);

  useEffect(() => {
    const query = inputValue; // capture current value for this effect run
    const timerId = setTimeout(() => {
      if (query !== "") {
        console.log("🔍 Searching cities for:", query);
        searchCities(query); // ✅ pass query directly, no stale closure
      }
    }, 500);
    return () => clearTimeout(timerId);
  }, [inputValue]);

  const options = useMemo(() => {
    const allCities = searchResults ?? cityList ?? cities ?? [];
    const filtered =
      inputValue.trim() !== ""
        ? allCities.filter(
            (city) =>
              city.city?.toLowerCase().includes(inputValue.toLowerCase()) ||
              city.state?.toLowerCase().includes(inputValue.toLowerCase()),
          )
        : allCities;

    console.log("🗂️ Options computed:", {
      totalCities: allCities.length,
      filteredCount: filtered.length,
      inputValue,
    });

    return filtered.map((option) => ({
      ...option,
      value: option._id,
      label: option.city,
    }));
  }, [searchResults, inputValue, cityList, cities]);

  return (
    <div className="w-full cursor-pointer">
      <Select
        isDisabled={isDisabled}
        className={`font-normal text-start cursor-pointer ${
          textSize === "small"
            ? "text-sm"
            : textSize === "large"
              ? "text-lg"
              : "text-base"
        }`}
        placeholder={placeHolder}
        isClearable
        styles={styles}
        isLoading={isLoading}
        menuPlacement="bottom"
        menuPosition="absolute"
        required={required}
        options={options}
        isOptionSelected={(option) => option._id === value?._id}
        value={value === undefined ? null : value}
        onChange={(selectedValue) => {
          console.log("✅ City selected:", {
            _id: (selectedValue as ICity)?._id,
            city: (selectedValue as ICity)?.city,
            state: (selectedValue as ICity)?.state,
            full: selectedValue,
          });
          onChange(selectedValue as ICity);
        }}
        onInputChange={(val, action) => {
          console.log("🔤 onInputChange:", { val, action: action.action });
          if (action.action === "input-change") {
            setInputValue(val);
            if (val === "") {
              setSearchResults(cityList ?? cities);
            }
          }
        }}
        formatOptionLabel={(option: any) => (
          <div
            className="z-50 flex flex-row items-center gap-3 cursor-pointer"
            key={option._id}
          >
            {/* ✅ FIX Bug 1: Added width & height — was crashing without them */}
            <div className="w-12 h-12 flex-shrink-0">
              <Image
                src={option?.icon}
                width={48}
                height={48}
                alt={option?.city ?? "city icon"}
                className="w-12 h-12 object-contain"
              />
            </div>
            <div className="capitalize">
              {option?.city}
              <div className="text-xs">{option?.state}</div>
            </div>
          </div>
        )}
        classNames={{
          control: () => "cursor-pointer",
          input: () => "text-lg cursor-pointer",
          option: () => "text-lg cursor-pointer",
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

  // ✅ FIX: accepts query as parameter — no stale closure possible
  async function searchCities(query: string) {
    setIsLoading(true);
    try {
      const res = await getCities({ city: query });
      console.log("📦 Search results for:", query, "→", res.data?.length, "cities");
      if (res.data) {
        // ✅ Only update if the query is still what the user typed
        // (guards against slow API responses arriving out of order)
        if (inputValueRef.current === query) {
          setSearchResults([...(res.data ?? [])]);
        } else {
          console.log("⚠️ Stale result ignored — query changed while fetching");
        }
      }
    } catch (err) {
      console.error("❌ searchCities error:", err);
    } finally {
      setIsLoading(false);
    }
  }
};

export { CitySelect };