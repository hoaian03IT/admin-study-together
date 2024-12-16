import { useEffect } from "react";

const useDetectScroll = (callback) => {
    useEffect(() => {
        const handleScroll = () => {
            const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight;

            if (bottom) {
                callback();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [callback]);
};

export { useDetectScroll };
