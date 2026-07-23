import React from "react";
import GoToHomeScreenButton from "./GoToHomeScreenButton";

interface PageHeaderProps extends React.PropsWithChildren {
  title: string;
  showBackAction?: boolean;
}

function PageHeader({
  title,
  children,
  showBackAction = false,
}: PageHeaderProps) {
  return (
    <div className="border-b border-border flex justify-between items-center px-6 py-4">
      <div className="flex gap-2 items-center">
        {showBackAction && <GoToHomeScreenButton variant="icon" />}
        <h1 className="font-heading text-base font-medium">{title}</h1>
      </div>
      {children}
    </div>
  );
}

export default PageHeader;
