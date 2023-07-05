import {render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "@/pages/index";

//This test should always pass
test("two plus two is four", () => {
  expect(2 + 2).toBe(4);
});

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />)
    cons heading = screen.getByRole('heading', {
      name: /welcome to next\.js!/i,
    })
    expect(heading).toBeInTheDocument()
  })
})