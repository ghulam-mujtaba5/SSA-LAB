import "@testing-library/jest-dom";
import React from 'react';

// Basic fetch mock for components that load on mount
if (!global.fetch) {
  global.fetch = jest.fn(async () => ({
    ok: true,
    json: async () => ({
      data: [],
      pagination: { total: 0, page: 1, totalPages: 1, limit: 10 },
    }),
  }));
}

// Mock framer-motion for synchronous, predictable Jest rendering
jest.mock('framer-motion', () => ({
  AnimatePresence: ({ children }) => children,
  motion: {
    div: React.forwardRef(({ children, whileHover, whileTap, initial, animate, exit, transition, ...props }, ref) => <div ref={ref} {...props}>{children}</div>),
    button: React.forwardRef(({ children, whileHover, whileTap, initial, animate, exit, transition, ...props }, ref) => <button ref={ref} {...props}>{children}</button>),
    nav: React.forwardRef(({ children, whileHover, whileTap, initial, animate, exit, transition, ...props }, ref) => <nav ref={ref} {...props}>{children}</nav>),
    aside: React.forwardRef(({ children, whileHover, whileTap, initial, animate, exit, transition, ...props }, ref) => <aside ref={ref} {...props}>{children}</aside>),
    span: React.forwardRef(({ children, whileHover, whileTap, initial, animate, exit, transition, ...props }, ref) => <span ref={ref} {...props}>{children}</span>),
    article: React.forwardRef(({ children, whileHover, whileTap, initial, animate, exit, transition, ...props }, ref) => <article ref={ref} {...props}>{children}</article>),
    header: React.forwardRef(({ children, whileHover, whileTap, initial, animate, exit, transition, ...props }, ref) => <header ref={ref} {...props}>{children}</header>),
    footer: React.forwardRef(({ children, whileHover, whileTap, initial, animate, exit, transition, ...props }, ref) => <footer ref={ref} {...props}>{children}</footer>),
  },
}));
