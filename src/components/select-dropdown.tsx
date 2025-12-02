"use client";

import { useState, useRef, useEffect, type ReactNode, useId } from "react";

interface Props {
  readonly children: ReactNode;
  readonly text?: string | ReactNode;
  readonly direction?: "up" | "down";
  readonly className?: string;
}

export default function SelectDropdown({
  children,
  text,
  direction = "down",
  className,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId();
  const menuId = `menu-${uniqueId}`;
  const buttonId = `button-${uniqueId}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mouseup", handleClickOutside);
    } else {
      document.removeEventListener("mouseup", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    setIsOpen((prev) => !prev);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>
  ): void => {
    if (event.key === "Escape") {
      setIsOpen(false);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div
      className={`relative inline-block text-left ${className ?? ""}`}
      ref={dropdownRef}
    >
      <div>
        <button
          type="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-controls={menuId}
          className="select-dropdown-trigger inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-base text-gray-900 shadow-xs hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
        >
          {text ?? ""}
          <svg
            className={`-mr-1 size-5 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div
        id={menuId}
        role="menu"
        aria-labelledby={buttonId}
        className={`${
          direction === "up" ? "[bottom:calc(100%+10px)] left-0" : ""
        } absolute right-0 z-10 mt-2 w-fit rounded-md bg-white ring-1 shadow-lg ring-black/5 transition duration-200 ease-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-5 pointer-events-none"
        }`}
        onClick={(event: React.MouseEvent<HTMLDivElement>) => {
          // Only close if clicking on the backdrop, not on child elements
          if (event.target === event.currentTarget) {
            setIsOpen(false);
          }
        }}
      >
        <div className="py-1">{children}</div>
      </div>
    </div>
  );
}
