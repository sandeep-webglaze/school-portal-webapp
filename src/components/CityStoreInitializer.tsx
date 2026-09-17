"use client";
import { ICity } from "@/api/HomePage";
import useCityStore from "@/hooks/useCityStore";
import { useRef } from "react";

interface CityStoreInitializerProps {
  cities?: ICity[] | null;
}

function CityStoreInitializer({ cities }: CityStoreInitializerProps) {
  const initialized = useRef(false);
  if (!initialized.current) {
    useCityStore.setState({ cities: cities ?? [] });
    initialized.current = true;
  }
  return null;
}

export default CityStoreInitializer;
