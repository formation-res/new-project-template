import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusState } from "./StatusState";

describe("StatusState", () => {
  it("announces a busy state without replacing its content", () => {
    render(
      <StatusState title="Loading projects" busy>
        Existing content remains available.
      </StatusState>,
    );

    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Existing content remains available.")).toBeInTheDocument();
  });

  it("uses an alert role for errors", () => {
    render(
      <StatusState title="Could not load" tone="error">
        Try again later.
      </StatusState>,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
