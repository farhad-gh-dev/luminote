import { Highlight } from "./features/highlights/highlight-model";

// Mock data for testing
export const mockHighlights: Highlight[] = [
  {
    id: "1",
    text: "React is a JavaScript library for building user interfaces",
    url: "https://reactjs.org",
    title: "React – A JavaScript library for building user interfaces",
    createdAt: "2025-04-18T14:22:00Z",
    color: "yellow",
  },
  {
    id: "2",
    text: "TypeScript is a strongly typed programming language that builds on JavaScript",
    url: "https://www.typescriptlang.org/",
    title: "TypeScript: JavaScript With Syntax For Types",
    createdAt: "2025-04-19T09:45:00Z",
    color: "green",
  },
  {
    id: "3",
    text: "Tailwind CSS is a utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup",
    url: "https://tailwindcss.com/",
    title:
      "Tailwind CSS - Rapidly build modern websites without ever leaving your HTML",
    createdAt: "2025-04-20T16:30:00Z",
    color: "blue",
  },
];
