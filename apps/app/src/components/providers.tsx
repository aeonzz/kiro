import React from "react";

import { OrganizationProvider } from "./organization-context";
import { ThemeProvider } from "./theme-providers";
import { TooltipProvider } from "./ui/tooltip";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <OrganizationProvider>{children}</OrganizationProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
