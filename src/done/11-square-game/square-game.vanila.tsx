import { getEmptyPosition, getGameState, isWin, validate } from "./square-game.utility";

type ComponentProps = {
    listeners?: string[];
    className?: string;
    tag?: keyof HTMLElementTagNameMap;
};

type Event = {
    type: string;
    handler: () => {};
};

const toEventName = (listener: string) =>
    `on${listener[0].toLocaleUpperCase()}${listener.slice(1)}`;
export abstract class Component {
    root: HTMLElement | null;
    listeners: string[];
    tag: keyof HTMLElementTagNameMap;
    className: string;
    element: HTMLElement | null = null;
    handlers: Event[] = [];

    constructor(
        root: HTMLElement,
        { listeners = [], className = "", tag = "div" }: ComponentProps
    ) {
        this.root = root;
        this.listeners = listeners;
        this.tag = tag;
        this.className = className;
    }

    init() {
        this.element = document.createElement(this.tag);
        this.handlers = this.listeners.map((type) => {
            // @ts-ignore
            const handler = this[toEventName(type)].bind(this);
            if (handler == null) {
                throw Error("Handler is not implemented");
            }
            this.getEventTarget().addEventListener(type, handler);
            return { type, handler };
        });
    }

    getEventTarget(): HTMLElement {
        return this.element as HTMLElement;
    }

    render() {
        if (this.element) {
            this.destroy();
        }
        this.init();
        if (this.element != null) {
            this.element.innerHTML = this.toHTML();
            this.root?.appendChild(this.element);
        }
        this.effect();
    }

    toHTML() {
        return `<div>Not implemented template</div>`;
    }

    destroy() {
        this.element?.remove();
        this.handlers.forEach(({ type, handler }) => {
            this.getEventTarget().removeEventListener(type, handler);
        });
        this.element = null;
    }

    effect() { }
}


type GameOfThreeProps = {};
const GAME_SIZE = 3;


export class GameOfThree extends Component {
    state: Array<Array<number | null>>;

    constructor(root: HTMLElement, props: GameOfThreeProps) {
        super(root, { ...props, listeners: ["click"] });
        this.state = getGameState(GAME_SIZE);
    }

    toHTML() {
        const cells = this.state
            .map((row, rowIndex) => {
                return row
                    .map((col, colIndex) => {
                        return `<div data-row="${rowIndex}" data-col="${colIndex}" class="game__cell ${col === null ? "game__cell--empty" : ""
                            }">
                    ${col == null ? "empty" : col}
                  </div>`.trim();
                    })
                    .join("")
                    .trim();
            })
            .join("")
            .trim();
        return `
     <section class="game_container">
      <div>Game status: ${isWin(this.state) ? "win" : "not yet"}</div>
      <div class="cell_container">
         ${cells}
      </div>
     </section>
    `.trim();
    }

    onClick = (ev: MouseEvent) => {
        const target = ev.target;
        if (
            target instanceof HTMLElement &&
            target.classList.contains("game__cell")
        ) {
            const [row, col] = [
                +(target.dataset.row ?? 0),
                +(target.dataset.col ?? 0)
            ];
            const [emptyRow, emptyCol] = getEmptyPosition(this.state);
            if (validate([row, col], [emptyRow, emptyCol])) {
                [this.state[row][col], this.state[emptyRow][emptyCol]] = [
                    this.state[emptyRow][emptyCol],
                    this.state[row][col]
                ];
                this.render();
            }
        }
    };
}
