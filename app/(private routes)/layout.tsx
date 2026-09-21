import { ReactNode } from 'react';

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <div className="private-layout">
      {children}
    </div>
  );
}