import React from 'react';
import { useInteractiveElement } from '../hooks/comandEsc';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export function Dropdown({ trigger, children }: DropdownProps) {
  const { isOpen, elementRef, toggle } =
    useInteractiveElement<HTMLDivElement>();

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle();
    }
  };

  return (
    <div ref={elementRef} className="relative z-[9999]">
      <div
        onClick={toggle}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-[9999]"
          role="menu"
        >
          {children}
        </div>
      )}
    </div>
  );
}
