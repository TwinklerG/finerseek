import { type RefObject, useEffect, useRef } from "react";

export default function useScrollToBottom<T extends HTMLElement>(): [
  RefObject<T>,
  RefObject<T>
] {
  const containerRef = useRef<T>(null as unknown as T);
  const endRef = useRef<T>(null as unknown as T);

  useEffect(() => {
    const container = containerRef.current;
    const end = endRef.current;

    if (container && end) {
      const observer = new MutationObserver(() => {
        end.scrollIntoView({ behavior: "smooth", block: "end" });
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });

      return () => observer.disconnect();
    }
  }, []);

  return [containerRef, endRef];
}
