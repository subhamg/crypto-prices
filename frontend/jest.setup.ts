import "@testing-library/jest-dom";
import "whatwg-fetch";
import React from "react";

jest.mock("@mantine/core", () => {
  type SimpleProps = { children?: React.ReactNode };
  return {
    __esModule: true,
    MantineProvider: ({ children }: SimpleProps) =>
      React.createElement(React.Fragment, null, children),
    Button: ({ children }: SimpleProps) =>
      React.createElement("button", null, children),
    Card: ({ children }: SimpleProps) =>
      React.createElement("div", null, children),
    Group: ({ children }: SimpleProps) =>
      React.createElement("div", null, children),
    Loader: () => React.createElement("div", null, "Loading…"),
    Select: ({ children }: SimpleProps) =>
      React.createElement("div", null, children),
    Stack: ({ children }: SimpleProps) =>
      React.createElement("div", null, children),
    Text: ({ children }: SimpleProps) =>
      React.createElement("span", null, children),
    Title: ({ children }: SimpleProps) =>
      React.createElement("h2", null, children),
  };
});
