import React from "react";
import { SearchX } from "lucide-react"; // ikon dari lucide-react

interface EmptyResultProps {
  title?: string;
  description?: string;
  actionButton?: React.ReactNode;
  fullScreen?: boolean;
}

export function EmptyResult({
  title = "No results found",
  description = "Please check your search keywords again or reload the page.",
  actionButton,
  fullScreen = false,
}: EmptyResultProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center space-y-3 text-gray-600
      ${fullScreen ? "min-h-screen" : "py-10 w-full"}`}
    >
      <SearchX className="w-16 h-16 text-gray-400" />
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      <p className="max-w-md text-sm">{description}</p>
      {actionButton && <div className="mt-4">{actionButton}</div>}
    </div>
  );
}
