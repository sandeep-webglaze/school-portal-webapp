import { ICity } from "@/api/HomePage";
import { create } from "zustand";

interface CityStore {
  cities: ICity[] | null;
  steCities: (newCities: ICity[] | null) => void;
}

const useCityStore = create<CityStore>((set) => ({
  cities: null,
  steCities: (newCities: ICity[] | null) => set({ cities: newCities }),
}));

export default useCityStore;
