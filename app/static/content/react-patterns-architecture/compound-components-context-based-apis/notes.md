Implement a fully working Tabs compound component with Tabs, Tabs.List, Tabs.Tab, and Tabs.Panel. Support both controlled and uncontrolled modes. Guard against sub-components being used outside the parent.

```jsx
const TabContext = React.createContext(null);

const useTabs = () => {
    const ctx = useContext(TabContext);
    if (!ctx) {
        throw new Error("useTabs must be used within a <Tabs> component");
    }

    return ctx;
}


const Tabs = ({ defaultTab, activeTab, onTabChange, children }) => {
    const isControlled = activeTab !== undefined;
    const [internal, setInternal] = useState(defaultTab ?? null);
    const currentTab = isControlled ? activeTab : internal;


    const setTab = useCallback((id) => {
        if (isControlled) {
            onTabChange?.(id);
        } else {
            setInternal(id);
        }
    }, [isControlled, onTabChange]);

    const value = useMemo(() => ({ currentTab, onTabChange: setTab }), [currentTab, setTab]);

    return (
        <TabContext.Provider value={value}>
            {children}
        </TabContext.Provider>
    )
}

Tabs.List = function TabsList({ children }) {
  return <div role="tablist">{children}</div>;
};

Tabs.Tab = function Tab({ id, children }) {
  const { currentTab, onTabChange } = useTabs();
  return (
    <button
      role="tab"
      aria-selected={currentTab === id}
      aria-controls={`panel-${id}`}
      onClick={() => onTabChange(id)}
    >
      {children}
    </button>
  );
};

Tabs.Panel = function Panel({ id, children }) {
  const { currentTab } = useTabs();
  if (currentTab !== id) return null;
  return (
    <div role="tabpanel" id={`panel-${id}`}>
      {children}
    </div>
  );
};


- define the context using the createContext API.
- create a custom hook useTabs to access the context and throw an error if used outside of the Tabs component.
- implement the Tabs component to manage the active tab state, supporting both controlled and uncontrolled modes.
- implement the Tabs.List, Tabs.Tab, and Tabs.Panel sub-components to consume the context and render accordingly.


```