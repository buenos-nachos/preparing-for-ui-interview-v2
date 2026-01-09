import { useRef, useEffect } from "react";
import { Tabs, Tab } from "./tabs.react";
import { Tabs as VanillaTabs } from "./tabs";


export function TabsExample() {
    return (
        <Tabs defaultTab="Tab 1">
            <Tab name="Tab 1">Content 1</Tab>
            <Tab name="Tab 2">Content 2</Tab>
            <Tab name="Tab 3">Content 3</Tab>
        </Tabs>
    );
}

export function TabsVanillaExample() {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!rootRef.current) return;

        const tabs = new VanillaTabs({
            root: rootRef.current,
            className: [],
            tabs: [
                { name: 'Tab 1', content: '<div>Content 1</div>' },
                { name: 'Tab 2', content: '<div>Content 2</div>' },
                { name: 'Tab 3', content: '<div>Content 3</div>' },
            ]
        });

        tabs.render();

        return () => tabs.destroy();
    }, []);

    return <div ref={rootRef}></div>;
}
