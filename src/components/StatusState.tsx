import type { ReactNode } from "react";

interface StatusStateProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  busy?: boolean;
  tone?: "neutral" | "error";
}

export function StatusState({
  title,
  children,
  action,
  busy = false,
  tone = "neutral",
}: StatusStateProps) {
  return (
    <section
      className={`rounded-box border p-6 ${tone === "error" ? "border-error" : "border-base-300"}`}
      aria-busy={busy}
      role={tone === "error" ? "alert" : "status"}
    >
      {busy ? <span className="loading loading-spinner loading-sm" aria-hidden="true" /> : null}
      <h2 className="mt-2 text-lg font-semibold">{title}</h2>
      <div className="text-sm text-base-content/75">{children}</div>
      {action ? <div className="mt-4">{action}</div> : null}
    </section>
  );
}
