import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

describe("Avatar", () => {
  it("renders Avatar component with AvatarImage correctly", () => {
    render(
      <Avatar>
        <AvatarImage src="image.jpg" alt="Avatar" />
      </Avatar>
    );

    const avatarElement = screen.getByTestId("avatar");
    expect(avatarElement).toBeInTheDocument();

    const avatarImageElement = screen.getByTestId("avatar-image");
    expect(avatarImageElement).toBeInTheDocument();
    expect(avatarImageElement).toHaveAttribute("src", "image.jpg");
    expect(avatarImageElement).toHaveAttribute("alt", "Avatar");
  });

  it("renders AvatarFallback component correctly", () => {
    render(<AvatarFallback>Fallback</AvatarFallback>);
    const avatarFallbackElement = screen.getByTestId("avatar-fallback");
    expect(avatarFallbackElement).toBeInTheDocument();
    expect(avatarFallbackElement).toHaveTextContent("Fallback");
  });
});
