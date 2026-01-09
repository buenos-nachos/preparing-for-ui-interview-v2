export type TComponentConfig<T extends object> = T & {
    root: HTMLElement;
    className?: string[];
    listeners?: string[];
    tag?: keyof HTMLElementTagNameMap;
};

const DEFAULT_CONFIG: Partial<TComponentConfig<any>> = {
    className: [],
    listeners: [],
    tag: 'div'
}

/**
 * @param type
 * @return {string}
 */
const toEventName = (type: string) => {
    if (!type) return '';
    else return `on${type[0].toUpperCase()}${type.slice(1)}`
}

export abstract class Component<T extends object> {

    container: HTMLElement | null;
    config: TComponentConfig<T>;
    events: Array<{ type: string, callback: EventListenerOrEventListenerObject }>;

    constructor(config: TComponentConfig<T>) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.container = null;
        this.events = [];
    }

    /**
     * Initializes the component's root element and binds event listeners.
     * Automatically called by render().
     */
    init() {
        this.container = document.createElement(this.config.tag as keyof HTMLElementTagNameMap);
        if (this.config.className) {
            for (const className of this.config.className) {
                this.container.classList.add(className);
            }
        }

        this.events = (this.config.listeners || []).map((type) => {
            const event = toEventName(type);
            // @ts-ignore
            let callback = this[event];
            if (!callback) {
                throw Error(`handler ${event} for ${type} is not implemented`);
            }
            callback = callback.bind(this);
            this.container!.addEventListener(type, callback);
            return { type, callback };
        })
    }

    /**
     * Lifecycle hook invoked after the component is attached to the DOM.
     */
    afterRender() { }

    /**
     * Renders the component into the root element.
     * Use toHTML() to define the template.
     */
    render() {
        if (this.container) this.destroy();
        this.init();
        this.container!.innerHTML = this.toHTML();
        this.config.root.appendChild(this.container!);
        this.afterRender()
    }

    /**
     * Returns the component's HTML template string.
     */
    toHTML(): string { return ``; }

    /**
     * Removes the component from the DOM and cleans up event listeners.
     */
    destroy() {
        this.events.forEach(({ type, callback }) => {
            this.container!.removeEventListener(type, callback)
        })
        this.events = [];
        this.container!.remove();
    }
}