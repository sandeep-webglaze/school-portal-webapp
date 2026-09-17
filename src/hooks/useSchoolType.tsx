import { ISchoolType } from "@/api/schools";
import { create } from "zustand";

type SelectSchoolType = {
  label: string;
  value: string;
};
interface SchoolTypeStore {
  schoolTypes: SelectSchoolType[] | null;
  setSchoolType: (newSchoolType: SelectSchoolType[] | null) => void;
}

const useSchoolType = create<SchoolTypeStore>((set) => ({
  schoolTypes: null,
  setSchoolType: (newSchoolType: SelectSchoolType[] | null) =>
    set({ schoolTypes: newSchoolType }),
}));

export default useSchoolType;
