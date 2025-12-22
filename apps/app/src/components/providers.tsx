import React from "react";

import { OrganizationProvider } from "./organization-context";
import { PreferenceProvider } from "./preference-provider";
import { ThemeProvider } from "./theme-providers";
import { Toaster } from "./ui/sonner";
import { TooltipProvider } from "./ui/tooltip";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <PreferenceProvider>
        <TooltipProvider>
          <OrganizationProvider>{children}</OrganizationProvider>
        </TooltipProvider>
        <Toaster />
      </PreferenceProvider>
    </ThemeProvider>
  );
}
