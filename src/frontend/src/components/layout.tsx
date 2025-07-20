import React from "react";
import { NavigationBar } from "./nav-bar";
import { LoadingComponent } from "./loading";

interface LayoutProps {
  children: React.ReactNode;
  isLoadPage: boolean;
}

export function ActivityLayout({ children, isLoadPage }: LayoutProps) {
  if (isLoadPage) return <LoadingComponent />;
  return (
    <div>
      {/* navbar */}
      <NavigationBar />
      <div className="pt-16">{children}</div>
    </div>
  );
}
