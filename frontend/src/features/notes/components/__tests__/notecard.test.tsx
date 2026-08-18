import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NoteCard from "../NoteCard";
import type { INote } from "../../types";

const mockNote: INote = {
  _id: "123",
  title: "My First Note",
  content: "<p>This is my <strong>note content</strong>.</p>",
  createdAt: "2026-08-18T10:00:00.000Z",
  tags: [],
  isPinned: false,
  isArchived: false,
  user: "",
  updatedAt: "",
};

const renderNoteCard = (note: INote = mockNote) => {
  return render(
    <MemoryRouter>
      <NoteCard note={note} />
    </MemoryRouter>,
  );
};

describe("NoteCard", () => {
  it("should render note title and content", () => {
    renderNoteCard();

    expect(
      screen.getByRole("heading", { name: "My First Note" }),
    ).toBeInTheDocument();

    const card = screen.getByRole("link");

    expect(card.textContent).toContain("This is my");
    expect(card.textContent).toContain("note content");
  });

  it("should render formatted creation date", () => {
    renderNoteCard();

    expect(screen.getByText("Aug 18, 2026")).toBeInTheDocument();
  });

  it("should link to the correct note", () => {
    renderNoteCard();

    expect(screen.getByRole("link")).toHaveAttribute("href", "/notes/123");
  });
  it("should render current date when createdAt is missing", () => {
    const noteWithoutDate: INote = {
      ...mockNote,
      createdAt: undefined,
    };

    renderNoteCard(noteWithoutDate);

    expect(screen.getByRole("link")).toBeInTheDocument();
  });
});
