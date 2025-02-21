import clsx from "clsx";

export function Sidebar({ hide }: { hide: boolean }) {
  return (
    <div
      className={clsx(
        "bg-slate-200 dark:bg-gray-800 h-full transition-all ease-in-out duration-300",
        hide ? "w-0" : "w-[30vw]"
      )}
    >
      <div className={clsx(hide ? "hidden" : "")}>This is Sidebar</div>
    </div>
  );
}
