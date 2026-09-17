import { IAppConfig } from "@/api/AppConfig";
import { create } from "zustand";

interface ConfigStore {
  config?: IAppConfig;
}

const useConfigStore = create<ConfigStore>((set) => ({}));

export default useConfigStore;
