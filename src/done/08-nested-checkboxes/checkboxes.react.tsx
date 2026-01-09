import React, { useEffect } from 'react';
import flex from '@course/styles';
import cx from '@course/cx';

export type TCheckboxItem = {
    id: string;
    label: string;
    parent?: TCheckboxItem;
    selected?: boolean;
    children?: TCheckboxItem[];
}

type TCheckboxTreeState = Record<string, TCheckboxItem>;


function process(acc: Record<string, TCheckboxItem>, item: TCheckboxItem, parent?: TCheckboxItem) {
    acc[item.id] = item;
    item.parent = parent;
    item.selected = item.selected || !!parent?.selected;
    item.children?.forEach(child => process(acc, child, item));
    return acc;
}


function propagate(children: TCheckboxItem[], value: boolean) {
    for (const child of children) {
        child.selected = value;
        propagate(child.children ?? [], value)
    }
}

function bubble(
    state: TCheckboxTreeState,
    target: TCheckboxItem,
) {
    if (target == null || target?.parent == null) return;
    const parent = target?.parent;
    parent.selected = parent?.children?.every(it => it.selected);
    bubble(state, parent)
}

export const CheckboxTree = ({ items }: { items: TCheckboxItem[] }) => {
    const [state, setState] = React.useState<TCheckboxTreeState>({});



    useEffect(() => {
        const clonedItems = structuredClone(items);
        const state = clonedItems.reduce((acc, next) => process(acc, next, undefined), {} as Record<string, TCheckboxItem>)
        setState(state);
    }, [items]);


    const onSelect: React.FormEventHandler<HTMLUListElement> = ({ target }) => {
        if (!(target instanceof HTMLInputElement)) {
            return;
        }
        const { id } = target.dataset;
        if (id == null) {
            return;
        }
        const newState = structuredClone(state);
        const element = newState[id];

        if (element != null) {
            element.selected = target.checked;
            const children = newState[id]?.children ?? [];
            propagate(children, target.checked);
            bubble(newState, element);
            setState(newState);
        }
    }

    return (
        <ul onChangeCapture={onSelect}>
            {Object.values(state)
                .filter((item) => !item.parent)
                .map((item) => (
                    <li key={item.id}>
                        <Checkbox {...item} />
                    </li>
                ))}
        </ul>
    );
};

function Checkbox({ label, children, id, selected }: TCheckboxItem) {
    return (
        <>
            <label>
                <input checked={selected} data-id={id} id={id} type="checkbox" />
                <span className={cx(flex.paddingLeft8)}>{label}</span>
            </label>
            {children && children.length > 0 && (
                <ul className={cx(flex.paddingLeft16)}>
                    {children.map((item) => (
                        <li key={item.id}>
                            <Checkbox {...item} />
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}



