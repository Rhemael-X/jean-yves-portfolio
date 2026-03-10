/** @jest-environment jsdom */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock next-intl
jest.mock("next-intl", () => ({
    useTranslations: () => (key: string) => key,
}));

// Mock next/navigation
const mockPush = jest.fn();
const mockPathname = "/fr/projects";
jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush }),
    usePathname: () => mockPathname,
    useSearchParams: () => new URLSearchParams(""),
}));

import Pagination from "@/components/Pagination";

describe("Pagination", () => {
    beforeEach(() => mockPush.mockClear());

    it("does not render when totalPages <= 1", () => {
        const { container } = render(
            <Pagination currentPage={1} totalPages={1} />
        );
        expect(container.firstChild).toBeNull();
    });

    it("renders correct number of page links for small page count", () => {
        render(<Pagination currentPage={1} totalPages={5} />);
        // Pages 1-5 should be visible
        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("renders previous link as disabled on first page", () => {
        render(<Pagination currentPage={1} totalPages={5} />);
        const prev = screen.getByText(/previous/i);
        expect(prev.tagName).toBe("SPAN"); // disabled = span, not link
    });

    it("renders next link as disabled on last page", () => {
        render(<Pagination currentPage={5} totalPages={5} />);
        const next = screen.getByText(/next/i);
        expect(next.tagName).toBe("SPAN"); // disabled = span, not link
    });

    it("marks current page with aria-current=page", () => {
        render(<Pagination currentPage={3} totalPages={5} />);
        const currentLink = screen.getByText("3").closest("[aria-current]");
        expect(currentLink).toHaveAttribute("aria-current", "page");
    });

    it("renders ellipsis for large page counts", () => {
        render(<Pagination currentPage={5} totalPages={20} />);
        const dots = screen.getAllByText("…");
        expect(dots.length).toBeGreaterThan(0);
    });
});
