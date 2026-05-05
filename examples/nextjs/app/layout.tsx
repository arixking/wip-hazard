import type { ReactNode } from 'react';

export const metadata = {
  title: 'wip-hazard demo',
  description: 'Marathon-flavored Work In Progress banner + scramble engine',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: '#0e0e10',
          color: '#e8e8e8',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          minHeight: '100vh',
        }}
      >
        {children}
      </body>
    </html>
  );
}
