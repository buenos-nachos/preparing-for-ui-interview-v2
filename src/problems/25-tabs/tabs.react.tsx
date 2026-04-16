import cx from "@course/cx";
import flex from "@course/styles";
import {
	createContext,
	type HTMLAttributes,
	type ReactElement,
	type RefObject,
	useContext,
	useId,
	useState,
} from "react";
import { createPortal } from "react-dom";
import tabs from "./tabs.module.css";

type TabState = Readonly<{
	parentId: string;
	activeTabName: string;
	namesToIds: Map<string, string>;
	onActiveTabChange: (newTab: string) => void;
}>;

const tabStateContext = createContext<TabState | null>(null);

function useTabStateContext(): TabState {
	const value = useContext(tabStateContext);
	if (value === null) {
		throw new Error("Child tab is being mounted outside of parent tab list");
	}
	return value;
}

type TabProps = Omit<HTMLAttributes<HTMLButtonElement>, "id"> & {
	name: string;
};

export function Tab({ name, onClick, ...props }: TabProps) {
	const { parentId, activeTabName, namesToIds, onActiveTabChange } =
		useTabStateContext();

	const id = namesToIds.get(name);
	if (id === undefined) {
		throw new Error(`Unable to retrieve ID for name ${name}`);
	}

	return (
		<li>
			<button
				{...props}
				role="tab"
				id={id}
				data-tab-name={name}
				aria-selected={name === activeTabName}
				aria-controls={parentId}
				onClick={(e) => {
					if (name !== activeTabName) {
						onActiveTabChange(activeTabName);
					}
					onClick?.(e);
				}}
			>
				{name}
			</button>
		</li>
	);
}

type TabsProps = {
	target?: RefObject<HTMLElement>;
	defaultTab?: string;
	children: ReactElement<TabProps, typeof Tab>[];
};

export function Tabs({ defaultTab, children, target }: TabsProps) {
	if (children.length === 0) {
		throw new Error("Children for Tabs cannot be empty");
	}

	const hookId = useId();
	const [activeTab, setActiveTab] = useState(
		defaultTab || children[0].props.name || "",
	);

	const tabState: TabState = {
		activeTabName: activeTab,
		parentId: `${hookId}-tab-panel`,
		onActiveTabChange: setActiveTab,
		namesToIds: new Map(
			children.map((c) => {
				const name = c.props.name;
				return [name, `${hookId}-tab-${name}`];
			}),
		),
	};

	const content = children.find((child) => child.props.name === activeTab)
		?.props.children;

	return (
		<div>
			<nav>
				<tabStateContext.Provider value={tabState}>
					<ul role="tablist" className={cx(flex.flexRowStart, flex.flexGap16)}>
						{children}
					</ul>
				</tabStateContext.Provider>
			</nav>

			{target?.current ? (
				createPortal(
					<div
						role="tabpanel"
						id={tabState.parentId}
						aria-labelledby={tabState.namesToIds.get(activeTab)}
					>
						{content}
					</div>,
					target.current,
				)
			) : (
				<section
					role="tabpanel"
					id={tabState.parentId}
					aria-labelledby={tabState.namesToIds.get(activeTab)}
					className={tabs.container}
				>
					{content}
				</section>
			)}
		</div>
	);
}
