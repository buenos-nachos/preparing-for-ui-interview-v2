import { useEffect, useRef } from "react";
import {
	AbstractComponent as AbstractComponentStudent,
	type ComponentConfig,
} from "./component";
import { AbstractComponent as AbstractComponentSolution } from "./solution/component";

type CounterProps = { initial: number };

class CounterSolution extends AbstractComponentStudent<CounterProps> {
	count: number;
	constructor(config: ComponentConfig<CounterProps, "div">) {
		super({ ...config, listeners: ["click"] });
		this.count = config.initial;
	}

	protected toHTML() {
		return `
      <div style="display:flex;align-items:center;gap:12px;font-family:sans-serif;">
        <button data-action="decrement" style="padding:6px 14px;font-size:1.1rem;cursor:pointer;">−</button>
        <span style="font-size:1.3rem;min-width:40px;text-align:center;">${this.count}</span>
        <button data-action="increment" style="padding:6px 14px;font-size:1.1rem;cursor:pointer;">+</button>
      </div>
    `;
	}

	onClick(e: Event) {
		const { target } = e;
		if (!(target instanceof HTMLElement)) {
			throw new Error("Invalid target received event");
		}

		const action = target.dataset.action;
		if (action === "increment") this.count++;
		if (action === "decrement") this.count--;
		this.render();
	}
}

class CounterStudent extends AbstractComponentSolution<CounterProps> {
	count: number;

	constructor(
		config: ConstructorParameters<
			typeof AbstractComponentStudent<CounterProps>
		>[0],
	) {
		super({ ...config, listeners: ["click"] });
		this.count = config.initial;
	}

	toHTML() {
		return `
      <div style="display:flex;align-items:center;gap:12px;font-family:sans-serif;">
        <button data-action="decrement" style="padding:6px 14px;font-size:1.1rem;cursor:pointer;">−</button>
        <span style="font-size:1.3rem;min-width:40px;text-align:center;">${this.count}</span>
        <button data-action="increment" style="padding:6px 14px;font-size:1.1rem;cursor:pointer;">+</button>
      </div>
    `;
	}

	onClick(e: Event) {
		const action = (e.target as HTMLElement).dataset.action;
		if (action === "increment") this.count++;
		if (action === "decrement") this.count--;
		this.render();
	}
}

export const AbstractComponentExample = () => {
	const rootRef = useRef<HTMLDivElement>(null);
	const counterRef = useRef<CounterSolution | null>(null);

	useEffect(() => {
		if (!rootRef.current) return;

		counterRef.current = new CounterSolution({
			root: rootRef.current,
			initial: 0,
		});

		counterRef.current.render();

		return () => {
			counterRef.current?.destroy();
			counterRef.current = null;
		};
	}, []);

	return <div ref={rootRef}></div>;
};

export const AbstractComponentStudentExample = () => {
	const rootRef = useRef<HTMLDivElement>(null);
	const counterRef = useRef<CounterStudent | null>(null);

	useEffect(() => {
		if (!rootRef.current) return;

		counterRef.current = new CounterStudent({
			root: rootRef.current,
			initial: 0,
		});

		counterRef.current.render();

		return () => {
			counterRef.current?.destroy();
			counterRef.current = null;
		};
	}, []);

	return <div ref={rootRef}></div>;
};
