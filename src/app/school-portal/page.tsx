"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/api/school-panel/client";

// Entry point: send schools to their dashboard (or login if not signed in).
export default function SchoolPortalIndex() {
  const router = useRouter();
  useEffect(() => {
    router.replace(
      isLoggedIn() ? "/school-portal/dashboard" : "/school-portal/login"
    );
  }, [router]);
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-600/30 border-t-green-600" />
    </div>
  );
}
