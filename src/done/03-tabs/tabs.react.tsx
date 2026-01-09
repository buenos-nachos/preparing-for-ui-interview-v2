import React, {
    useState,
    type PropsWithChildren,
    type ReactElement,
    type RefObject,
} from "react";
import flex from "@course/styles";
import tabs from "./tabs.module.css";
import cx from "@course/cx";
import { createPortal } from "react-dom";



type TTabProps = PropsWithChildren<{
    name: string;
}>;

type TTabsProps = {
    target?: RefObject<HTMLElement>;
    defaultTab?: string;
    children: ReactElement<TTabProps, typeof Tab>[];
}

export function Tab({ name }: TTabProps) {
    return <li><button data-tab-name={name}>{name}</button></li>
}

export function Tabs({ defaultTab, children, target }: TTabsProps) {
    const [activeTab, setActiveTab] = useState<string>(defaultTab || children[0].props.name);

    const handleTabClick = ({ target }: React.MouseEvent<HTMLUListElement>) => {
        if (target instanceof HTMLButtonElement) {
            const tabName = target.dataset.tabName;
            tabName && setActiveTab(tabName);
        }
    };

    const content = children.find(child => child.props.name === activeTab)?.props.children;
    return <div>
        <nav>
            <ul onClickCapture={handleTabClick} className={cx(flex.flexRowStart, flex.flexGap16)}>{children}</ul>
        </nav>
        {content && target?.current != null ? createPortal(content, target.current) : <section className={tabs.container}>{content}</section>}
    </div>
}



