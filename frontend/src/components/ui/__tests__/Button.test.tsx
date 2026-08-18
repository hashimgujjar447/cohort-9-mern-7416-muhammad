import { jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import Button from "../Button";
import userEvent from "@testing-library/user-event";
import { User } from "lucide-react";

describe("Button", () => {
  it("Should render Button text", () => {
    render(<Button>Login</Button>);
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("should call handleClick when button is clicked", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button handleClick={handleClick}>Login</Button>);

    try {
      await user.click(screen.getByRole("button", { name: "Login" }));
    } catch (err) {
      throw new Error(`[Button – handleClick click]: ${err}`);
    }

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled={true}>login</Button>);
    expect(screen.getByRole("button", { name: "login" })).toBeDisabled();
  });

  it("should not call handleClick when disabled", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    render(
      <Button disabled={true} handleClick={handleClick}>
        login
      </Button>,
    );

    try {
      await user.click(screen.getByRole("button", { name: "login" }));
    } catch (err) {
      throw new Error(`[Button – disabled click]: ${err}`);
    }

    expect(handleClick).not.toHaveBeenCalled();
  });
  it("should have button type by default", () => {
    render(<Button>login</Button>);
    expect(screen.getByRole("button", { name: "login" })).toHaveAttribute(
      "type",
      "button",
    );
  });
  it("should support custom button type", () => {
    render(<Button type="submit">login</Button>);
    expect(screen.getByRole("button", { name: "login" })).toHaveAttribute(
      "type",
      "submit",
    );
  });
  it("should apply custom className", () => {
    render(<Button className="bg-blue-500">Login</Button>);

    expect(screen.getByRole("button", { name: "Login" })).toHaveClass(
      "bg-blue-500",
    );
  });

  it("should render icon when Icon prop is provided", () => {
    render(<Button Icon={User}>Profile</Button>);

    const button = screen.getByRole("button", { name: "Profile" });

    expect(button.querySelector("svg")).toBeInTheDocument();
  });
});
