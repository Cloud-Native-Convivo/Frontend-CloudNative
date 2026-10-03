import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FlipCard } from "./FlipCard";

describe("FlipCard", () => {
  it("renderiza front y back con el estado inicial flipped = false", () => {
    // Arrange
    const frontContent = <div>Front Side</div>;
    const backContent = <div>Back Side</div>;

    // Act
    const { container } = render(<FlipCard front={frontContent} back={backContent} />);

    // Assert
    expect(screen.getByText("Front Side")).toBeInTheDocument();
    expect(screen.getByText("Back Side")).toBeInTheDocument();

    // Verificamos el div contenedor de la animación
    const innerContainer = container.querySelector(".relative.w-full.h-full");
    expect(innerContainer).toHaveStyle({ transform: "rotateY(0deg)" });
  });

  it("cambia a flipped = true al hacer mouseEnter y vuelve a false con mouseLeave", () => {
    // Arrange
    const { container } = render(<FlipCard front={<div>Front</div>} back={<div>Back</div>} />);
    const cardContainer = container.firstChild as HTMLElement;
    const innerContainer = container.querySelector(".relative.w-full.h-full");

    // Act 1: Mouse Enter
    fireEvent.mouseEnter(cardContainer);

    // Assert 1
    expect(innerContainer).toHaveStyle({ transform: "rotateY(180deg)" });

    // Act 2: Mouse Leave
    fireEvent.mouseLeave(cardContainer);

    // Assert 2
    expect(innerContainer).toHaveStyle({ transform: "rotateY(0deg)" });
  });
});
