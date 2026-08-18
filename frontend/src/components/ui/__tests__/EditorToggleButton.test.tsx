import { jest } from "@jest/globals";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import EditorToggleButton from "../EditorToggleButton";

describe("EditorToggleButton", () => {
  it("Should render the button with title", () => {
    const onClick = jest.fn();

    render(
      <EditorToggleButton
        title="Bold"
        icon={<span>Icon</span>}
        onClick={onClick}
      />,
    );

    expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "title",
      "Bold",
    );
  });
  it("should render the icon", () => {
    render(
      <EditorToggleButton
        icon={<span data-testid="editor-icon">Icon</span>}
        title="Bold"
        onClick={jest.fn()}
      />,
    );

    expect(screen.getByTestId("editor-icon")).toBeInTheDocument();
  });
  it("should call onclick when button is clicked", async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();
    render(
      <EditorToggleButton
        title="Bold"
        icon={<span>Icon</span>}
        onClick={onClick}
      />,
    );

    try {
      await user.click(screen.getByRole("button", { name: "Bold" }));
    } catch (err) {
      throw new Error(`[EditorToggleButton – onClick click]: ${err}`);
    }

    expect(onClick).toHaveBeenCalledTimes(1);
  });
  it("should not call onClick when disabled", async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();
    render(
      <EditorToggleButton
        title="Bold"
        icon={<span>Icon</span>}
        onClick={onClick}
        disabled={true}
      />,
    );

    try {
      await user.click(screen.getByRole("button", { name: "Bold" }));
    } catch (err) {
      throw new Error(`[EditorToggleButton – disabled click]: ${err}`);
    }
    expect(onClick).not.toHaveBeenCalled();
  });
  it("should apply active styles when isActive is true", () => {
    render(
      <EditorToggleButton
        icon={<span>Icon</span>}
        title="Bold"
        onClick={jest.fn()}
        isActive
      />,
    );

    expect(screen.getByRole("button", { name: "Bold" })).toHaveClass(
      "bg-blue-600",
      "text-white",
      "border-blue-600",
    );
  });
  it("should apply inactive styles by default", () => {
    render(
      <EditorToggleButton
        icon={<span>Icon</span>}
        title="Bold"
        onClick={jest.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Bold" })).toHaveClass(
      "bg-white",
      "text-gray-700",
      "border-gray-200",
    );
  });
});
