import React, { ReactNode } from "react";

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
        {icon && <span className="text-primary">{icon}</span>} {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export default SectionCard;
