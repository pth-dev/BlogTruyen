import React from 'react';
import { Outlet } from 'react-router-dom';

interface ReaderLayoutProps {
  className?: string;
}

export const ReaderLayout: React.FC<ReaderLayoutProps> = ({ 
  className = '' 
}) => {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* Reader layout không có header/footer để tối đa hóa không gian đọc */}
      <Outlet />
    </div>
  );
};
