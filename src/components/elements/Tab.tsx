"use client";
interface TabProps {
  active: string | number;
  setActive: React.Dispatch<React.SetStateAction<string>> | any; //any type was infered for number values
  data: { id: number; name: string }[];
}

interface TabMenuProp {
  label: string;
  active: boolean;
  onClick: () => void;
}

const TabMenu: React.FC<TabMenuProp> = ({ label, active, onClick }) => {
  return (
    <p
      className={`text-sm px-4 py-2 text-dark-1 font-medium rounded-lg all__trans cursor-pointer whitespace-nowrap ${
        active
          ? "bg-white text-primary-default font-semibold"
          : "hover:text-primary-default"
      }`}
      onClick={onClick}
    >
      {label}
    </p>
  );
};

const Tab: React.FC<TabProps> = ({ active, setActive, data }) => {
  return (
    <nav className="overflow-x-auto">
      <div className="flex w-full md:gap-14 bg-[#D2DBFA] rounded-lg">
        {data &&
          data.map((item: any) => (
            <div
              className={`m-1 ${item.id !== 1 ? "ml-2" : null}`}
              key={item.id}
            >
              <TabMenu
                active={active === item.id}
                onClick={() => setActive(item.id)}
                label={item.name}
              />
            </div>
          ))}
      </div>
    </nav>
  );
};

export default Tab;
