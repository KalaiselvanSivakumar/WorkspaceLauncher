import React from "react";

interface PageHeaderProps extends React.PropsWithChildren {
  title: string;
}

function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="border-b border-border flex justify-between items-center px-6 py-4">
      <h1 className="font-heading text-base font-medium">{title}</h1>
      {children}
    </div>
  );
}

export default PageHeader;
