import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Button } from "@/components/ui/button";
import React from "react";

describe("Button component", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>);
    const buttonElement = screen.getByTestId("button");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent("Click me");
  });

  it("applies the correct variant", () => {
    render(<Button variant="destructive">Delete</Button>);
    const buttonElement = screen.getByTestId("button");
    expect(buttonElement).toHaveClass("bg-destructive");
    expect(buttonElement).toHaveClass("text-destructive-foreground");
  });

  it("triggers onClick handler", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const buttonElement = screen.getByTestId("button");

    buttonElement.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders with additional className", () => {
    render(<Button className="custom-class">Custom Button</Button>);
    const buttonElement = screen.getByTestId("button");
    expect(buttonElement).toHaveClass("custom-class");
  });

  it("renders with custom size", () => {
    render(<Button size="sm">Small Button</Button>);
    const buttonElement = screen.getByTestId("button");
    expect(buttonElement).toHaveClass("h-9");
    expect(buttonElement).toHaveClass("px-3");
    expect(buttonElement).toHaveClass("rounded-md");
  });

  it("triggers onFocus handler", () => {
    const handleFocus = jest.fn();
    render(<Button onFocus={handleFocus}>Button</Button>);
    const buttonElement = screen.getByTestId("button");
    buttonElement.focus();
    expect(handleFocus).toHaveBeenCalledTimes(1);
  });
});
