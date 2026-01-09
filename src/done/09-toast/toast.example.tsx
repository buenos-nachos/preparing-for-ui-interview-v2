import { useToast } from "./toast.react";

let id = 0;

export function ToastExample() {
    const { toast } = useToast();
    return (
        <button
            onClick={() =>
                toast({
                    id: `${id++}`,
                    text: `Toast message: ${id}`,
                })
            }
        >
            Click on me
        </button>
    );
}
