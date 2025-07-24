'use client';

import { useState, useCallback, ReactNode } from 'react';

interface TabProps {
  data: { id: string; name: string | ReactNode; content: ReactNode }[];
  initialTab?: string;
}

interface TabMenuProps {
  label: string | ReactNode;
  active: boolean;
  onClick: () => void;
}

const TabMenu: React.FC<TabMenuProps> = ({ label, active, onClick }) => (
  <div
    className={`px-1 py-2 all__trans cursor-pointer whitespace-nowrap text-sm ${
      active
        ? 'text-primary-default border-b-2 border-primary-default font-medium'
        : 'text-gray-600'
    }`}
    onClick={onClick}
  >
    {label}
  </div>
);

const TabView: React.FC<TabProps> = ({ data, initialTab = data[0].id }) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [currentContent, setCurrentContent] = useState<ReactNode>(
    data.find((item) => item.id === initialTab)?.content
  );

  const handleTabClick = useCallback(
    (id: string, content: ReactNode) => {
      setActiveTab(id);
      setCurrentContent(content);
    },
    [setActiveTab, setCurrentContent]
  );

  return (
    <div>
      <nav className="flex gap-4 w-full overflow-x-auto border-b border-gray-400">
        {data.map((item) => (
          <TabMenu
            key={item.id}
            label={item.name}
            active={activeTab === item.id}
            onClick={() => handleTabClick(item.id, item.content)}
          />
        ))}
      </nav>
      <div className="mt-5">{currentContent}</div>
    </div>
  );
};

export default TabView;
