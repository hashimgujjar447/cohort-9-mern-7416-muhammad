import { jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Search } from "lucide-react";
import Input from "../Input";

describe("Input", () => {
  it("should render input with placeholder", () => {
    render(<Input placeholder="Enter your name" />);

    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
  });

  it("should accept user input", async () => {
    const user = userEvent.setup();

    render(<Input placeholder="Enter your name" />);

    const input = screen.getByPlaceholderText("Enter your name");

    try {
      await user.type(input, "Muhammad");
    } catch (err) {
      throw new Error(`[Input – accept user input type]: ${err}`);
    }

    expect(input).toHaveValue("Muhammad");
  });

  it("should call onChange when input changes", async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();

    render(<Input placeholder="Enter your name" onChange={onChange} />);

    try {
      await user.type(
        screen.getByPlaceholderText("Enter your name"),
        "Muhammad",
      );
    } catch (err) {
      throw new Error(`[Input – onChange type]: ${err}`);
    }

    expect(onChange).toHaveBeenCalled();
  });

  it("should render with default type text", () => {
    render(<Input placeholder="Enter your name" />);

    expect(screen.getByPlaceholderText("Enter your name")).toHaveAttribute(
      "type",
      "text",
    );
  });

  it("should support custom input type", () => {
    render(<Input type="password" placeholder="Password" />);

    expect(screen.getByPlaceholderText("Password")).toHaveAttribute(
      "type",
      "password",
    );
  });

  it("should render with provided value", () => {
    render(<Input placeholder="Username" value="hashim" readOnly />);

    expect(screen.getByPlaceholderText("Username")).toHaveValue("hashim");
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Input placeholder="Username" disabled />);

    expect(screen.getByPlaceholderText("Username")).toBeDisabled();
  });

  it("should render icon when icon prop is provided", () => {
    render(<Input placeholder="Search" icon={Search} />);

    expect(
      screen.getByPlaceholderText("Search").parentElement?.querySelector("svg"),
    ).toBeInTheDocument();
  });
});
