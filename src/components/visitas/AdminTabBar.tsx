export type ActiveTab = "mis-visitas" | "conserjeria";

interface AdminTabBarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

const TABS: { key: ActiveTab; label: string }[] = [
  { key: "mis-visitas", label: "Mis visitas" },
  { key: "conserjeria", label: "Conserjería" },
];

export function AdminTabBar({ activeTab, onSelectTab }: AdminTabBarProps) {
  return (
    <div className="bg-white border-b border-border sticky top-0 z-10">
      <div className="max-w-2xl mx-auto flex">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onSelectTab(key)}
            className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === key
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-text"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
