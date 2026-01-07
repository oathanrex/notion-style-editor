import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isActive?: boolean;
    tooltip?: string;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    isActive = false,
    tooltip,
    children,
    className,
    ...props
}) => {
    return (
        <button
            className={cn(
                'menu-button',
                isActive && 'is-active',
                className
            )}
            title={tooltip}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
