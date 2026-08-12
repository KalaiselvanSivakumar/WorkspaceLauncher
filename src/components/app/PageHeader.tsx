import React from "react";
import GoToHomeScreenButton from "./GoToHomeScreenButton";

interface PageHeaderProps extends React.PropsWithChildren {
  title: string;
  description?: string;
  showBackAction?: boolean;
}

function PageHeader({
  title,
  description,
  children,
  showBackAction = false,
}: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-background border-b border-border flex justify-between items-center px-6 py-4">
      <div className="flex gap-2 items-center">
        {showBackAction && <GoToHomeScreenButton variant="icon" />}
        <div>
          <h1 className="font-semibold text-xl">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

export default PageHeader;
