"use client";

import { IAppConfig } from "@/api/AppConfig";
import useConfigStore from "@/hooks/useConfigStore";
import { useRef } from "react";

interface ConfigStoreProps {
  config?: IAppConfig;
}

function ConfigStore({ config }: ConfigStoreProps) {
  const initialized = useRef(false);
  if (!initialized.current) {
    useConfigStore.setState({ config });
    initialized.current = true;
  }
  return null;
}

export default ConfigStore;
