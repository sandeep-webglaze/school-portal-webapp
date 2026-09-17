"use client";

import { IUser } from "@/api/CurrentUser";
import useAuthStore from "@/hooks/useUserState";
import { useRef } from "react";

interface StoreInitializerProps {
  isAuthenticated: boolean;
  user: IUser | null;
}

function StoreInitializer({ isAuthenticated, user }: StoreInitializerProps) {
  const initialized = useRef(false);
  if (!initialized.current) {
    useAuthStore.setState({ isAuthenticated, user, isLoaded: true });
    initialized.current = true;
  }
  return null;
}

export default StoreInitializer;
