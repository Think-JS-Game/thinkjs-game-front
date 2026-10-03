import React from 'react';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
}

export const DXL = ({ children, className = "", style = {}, as: Component = 'span' }: TypographyProps) => (
  <Component className={`display-xl block ${className}`} style={style}>{children}</Component>
);

export const DLG = ({ children, className = "", style = {}, as: Component = 'span' }: TypographyProps) => (
  <Component className={`display-lg block ${className}`} style={style}>{children}</Component>
);

export const DMD = ({ children, className = "", style = {}, as: Component = 'span' }: TypographyProps) => (
  <Component className={`display-md block ${className}`} style={style}>{children}</Component>
);

export const BLG = ({ children, className = "", style = {}, as: Component = 'span' }: TypographyProps) => (
  <Component className={`body-lg block ${className}`} style={style}>{children}</Component>
);

export const BMD = ({ children, className = "", style = {}, as: Component = 'span' }: TypographyProps) => (
  <Component className={`body-md block ${className}`} style={style}>{children}</Component>
);

export const CAP = ({ children, className = "", style = {}, as: Component = 'span' }: TypographyProps) => (
  <Component className={`caption block ${className}`} style={style}>{children}</Component>
);
