import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Button } from "@/components/ui/button";
import React from "react";

afterEach(() => {
  cleanup();
});

//This test should always pass
test("two plus two is four", () => {
  expect(2 + 2).toBe(4);
});

describe("Button Component", () => {
  const onclick = jest.fn();
  render(<Button onClick={onclick}>Sample Text</Button>);
  const button = screen.getByTestId("button");

  test("Button Text", () => {
    expect(button).toHaveTextContent("Sample Text");
  });
});
