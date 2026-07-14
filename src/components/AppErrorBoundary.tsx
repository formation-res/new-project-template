import { Component, type ErrorInfo, type ReactNode } from "react";
import { useI18n } from "../i18n/context";

interface BoundaryProps {
  children: ReactNode;
  title: string;
  body: string;
  retryLabel: string;
}

interface BoundaryState {
  failed: boolean;
}

class Boundary extends Component<BoundaryProps, BoundaryState> {
  override state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Application render failed", error, info.componentStack);
  }

  override render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="grid min-h-screen place-items-center bg-base-200 p-6">
        <section className="card w-full max-w-lg bg-base-100 shadow-xl" role="alert">
          <div className="card-body">
            <h1 className="card-title">{this.props.title}</h1>
            <p>{this.props.body}</p>
            <div className="card-actions justify-end">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => window.location.reload()}
              >
                {this.props.retryLabel}
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }
}

export function AppErrorBoundary({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  return (
    <Boundary
      title={t("error-boundary-title")}
      body={t("error-boundary-body")}
      retryLabel={t("error-boundary-retry")}
    >
      {children}
    </Boundary>
  );
}
