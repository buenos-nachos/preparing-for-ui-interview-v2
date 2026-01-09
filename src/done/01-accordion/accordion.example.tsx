import { Accordion, type TAccordionItem } from "./accordion.react";
import { Accordion as AccordionVanilla } from "./accordion.vanila";
import { useEffect, useRef } from "react";

const MOCK_DATA: TAccordionItem[] = [
    {
        id: "1",
        title: "Section 1",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
        id: "2",
        title: "Section 2",
        content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
    },
    {
        id: "3",
        title: "Section 3",
        content: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.",
    },
];

export const AccordionExample = () => {
    return <Accordion items={MOCK_DATA} />;
};

export const AccordionVanillaExample = () => {
    const rootRef = useRef<HTMLDivElement>(null);
    const accordionRef = useRef<AccordionVanilla | null>(null);

    useEffect(() => {
        if (!rootRef.current) return;

        accordionRef.current = new AccordionVanilla({
            root: rootRef.current,
            items: MOCK_DATA
        });

        accordionRef.current.render();

        return () => {
            accordionRef.current?.destroy();
            accordionRef.current = null;
        }
    }, [])

    return <div ref={rootRef}></div>
}
