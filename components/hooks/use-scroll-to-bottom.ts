import { type RefObject, useEffect, useRef } from "react";

function debounce(func: (...args: unknown[]) => void, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: unknown[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

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
      const debouncedScrollIntoView = debounce(() => {
        end.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 200); // Adjust the delay as needed

      const observer = new MutationObserver(() => {
        debouncedScrollIntoView();
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return [containerRef, endRef];
}