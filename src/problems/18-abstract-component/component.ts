/**
 * Step 1: Understand TComponentConfig
 * - Generic type that extends T with component options
 * - root: the parent HTMLElement to mount into
 * - className: optional CSS classes for the container
 * - listeners: optional event types to bind (e.g., 'click', 'input')
 * - tag: optional HTML tag for the container element (default: 'div')
 */

type HtmlTag = keyof HTMLElementTagNameMap;

type ComponentConfigBase<TTag extends HtmlTag> = {
	className: string[];
	listeners: string[];
	tag: TTag;
};

export type ComponentConfig<
	T extends NonNullable<unknown>,
	TTag extends HtmlTag = "div",
> = T &
	Partial<ComponentConfigBase<TTag>> & {
		root: HTMLElement;
	};

export type InitializedComponentConfig<
	T extends NonNullable<unknown>,
	TTag extends HtmlTag = "div",
> = T &
	ComponentConfigBase<TTag> & {
		root: HTMLElement;
	};

const defaultConfig: ComponentConfigBase<"div"> = {
	className: [],
	listeners: [],
	tag: "div",
};

type ComponentListener = {
	type: string;
	callback: EventListenerOrEventListenerObject;
};

function toEventName(type: string): string {
	if (!type) return "";
	else return `on${type[0].toUpperCase()}${type.slice(1)}`;
}

export abstract class AbstractComponent<
	T extends NonNullable<unknown>,
	TTag extends HtmlTag = "div",
> {
	container: HTMLElement | null;
	config: InitializedComponentConfig<T, TTag>;
	events: ComponentListener[];

	/**
	 * Step 2: Understand constructor
	 * - Merges DEFAULT_CONFIG with the provided config
	 * - Initializes container as null (created later in init)
	 * - Initializes events as an empty array
	 */
	constructor(config: ComponentConfig<T, TTag>) {
		const merged: InitializedComponentConfig<T, TTag> = {
			...config,
			tag: config.tag ?? defaultConfig.tag,
			className: config.className ?? defaultConfig.className,
			listeners: config.listeners ?? defaultConfig.listeners,
		};
		this.config = merged;
		this.container = null;
		this.events = [];
	}

	/**
	 * Step 3: Implement init
	 * - Create a container element using document.createElement with config.tag
	 * - Add CSS classes from config.className to the container
	 * - For each listener in config.listeners:
	 *   - Convert type to handler name using toEventName (e.g., 'click' -> 'onClick')
	 *   - Look up the handler method on `this` by that name
	 *   - Throw an error if the handler is not implemented
	 *   - Bind the handler to `this` and attach it via addEventListener
	 *   - Store { type, callback } in this.events array
	 */
	protected init(): HTMLElementTagNameMap[TTag] {
		const container = document.createElement(this.config.tag);
		for (const cn of this.config.className) {
			container.classList.add(cn);
		}
		for (const listener of this.config.listeners) {
			const handlerKey = toEventName(listener);
			// @ts-expect-error -- Have to check for whether descendant class
			// implements this callback
			const callback = this[handlerKey] as (...args: unknown[]) => void;
			if (callback === undefined) {
				throw new Error(`Missing callback for event type "${listener}"`);
			}
			const bound = callback.bind(this);
			container.addEventListener(listener, bound);
			this.events.push({ type: listener, callback: bound });
		}

		this.container = container;
		return container;
	}

	protected afterRender() {}

	/**
	 * Step 4: Implement render
	 * - If container already exists, call destroy() to clean up
	 * - Call init() to create a fresh container and bind events
	 * - Set container.innerHTML to this.toHTML()
	 * - Append the container to config.root
	 * - Call afterRender() hook
	 */
	render() {
		if (this.container !== null) {
			this.destroy();
		}
		const newContainer = this.init();
		newContainer.innerHTML = this.toHTML();
		this.config.root.appendChild(newContainer);
		this.afterRender();
	}

	protected toHTML(): string {
		throw new Error("toHTML not implemeneted for class");
	}

	/**
	 * Step 5: Implement destroy
	 * - Remove all event listeners stored in this.events from the container
	 * - Clear the events array
	 * - Remove the container from the DOM
	 */
	destroy(): void {
		if (this.container === null) {
			return;
		}
		for (const { type, callback } of this.events) {
			this.container.removeEventListener(type, callback);
		}
		this.events = [];
		this.container.remove();
	}
}
