"use client"

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter, usePathname } from "next/navigation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { restoreAuth, token, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    restoreAuth();
  }, [restoreAuth]);

  useEffect(() => {
    if (!mounted) return;
    
    const isAuthRoute = pathname === "/login" || pathname === "/register";
    const hasToken = !!localStorage.getItem("auth_token");

    // Static Protection Logic:
    if (!hasToken && !isAuthRoute) {
      // Not logged in and trying to access protected route
      router.replace("/login");
    } else if (hasToken && isAuthRoute) {
      // Logged in and trying to access login page
      router.replace("/environments"); // or home root
    }
  }, [pathname, mounted, isAuthenticated, router]);

  // Optionally show a loading skeleton while mounting to prevent flicker
  if (!mounted) return null;

  return <>{children}</>;
}
