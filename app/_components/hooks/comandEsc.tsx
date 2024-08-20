// hooks/useInteractiveElement.ts
import { useState, useEffect, useRef, RefObject } from 'react';

interface UseInteractiveElementOptions {
  closeOnEscape?: boolean;
  closeOnClickOutside?: boolean;
  initialState?: boolean;
}

export function useInteractiveElement<T extends HTMLElement>(
  options: UseInteractiveElementOptions = {}
) {
  const {
    closeOnEscape = true,
    closeOnClickOutside = true,
    initialState = false,
  } = options;

  const [isOpen, setIsOpen] = useState(initialState);
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        closeOnClickOutside &&
        elementRef.current &&
        !elementRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeOnEscape, closeOnClickOutside]);

  const toggle = () => setIsOpen(!isOpen);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return { isOpen, setIsOpen, elementRef, toggle, open, close };
}
