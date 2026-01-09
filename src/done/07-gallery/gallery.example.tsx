import { useEffect, useRef } from "react";
import { Gallery } from "./gallery.react";
import { Gallery as VanillaGallery } from "./gallery.vanila";


const IMAGES = [
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?dpr=1&auto=format&fit=crop&w=1000&q=80&cs=tinysrgb',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?dpr=1&auto=format&fit=crop&w=1000&q=80&cs=tinysrgb',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?dpr=1&auto=format&fit=crop&w=1000&q=80&cs=tinysrgb',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?dpr=1&auto=format&fit=crop&w=1000&q=80&cs=tinysrgb'
]

export const GalleryExample = () => {
    return (
        <Gallery images={IMAGES} />
    )
}

export const GalleryVanillaExample = () => {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!rootRef.current) return;
        const gallery = new VanillaGallery({
            root: rootRef.current,
            images: IMAGES
        });
        gallery.render();
        return () => gallery.destroy();
    }, []);

    return <div ref={rootRef}></div>
};
