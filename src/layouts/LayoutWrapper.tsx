import React from 'react';
import { Outlet } from 'react-router-dom';

interface LayoutWrapperProps {
  children?: React.ReactNode;
  className?: string;
}

export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={className}>
      {children || <Outlet />}
    </div>
  );
};
