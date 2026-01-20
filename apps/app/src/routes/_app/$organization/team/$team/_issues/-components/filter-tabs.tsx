import * as React from "react";

import { issueFilterTabs } from "@/config/team";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FilterTabsProps {}

export function FilterTabs() {
  return (
    <Tabs defaultValue={issueFilterTabs[0].value}>
      <TabsList className="w-full">
        {issueFilterTabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {issueFilterTabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {/* Content for {tab.label} */}
        </TabsContent>
      ))}
    </Tabs>
  );
}
