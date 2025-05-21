import React from 'react';
import {cn} from '../utils/cn.ts';
import {ButtonProps} from "../types/video.ts";


const Button: React.FC<ButtonProps> = ({
                                           children,
                                           variant = 'primary',
                                           size = 'md',
                                           icon,
                                           className,
                                           ...props
                                       }) => {
    const variantClasses = {
        primary: 'bg-primary text-black hover:bg-primary-dark focus:ring-primary-light',
        secondary: 'bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary-light',
        ghost: 'bg-transparent hover:bg-gray-800 text-white',
    };

    const sizeClasses = {
        sm: 'py-1 px-2 text-sm',
        md: 'py-2 px-4 text-base',
        lg: 'py-3 px-6 text-lg',
    };

    return (
        <button
            className={cn(
                'rounded transition-colors duration-200 focus:outline-none focus:ring-2',
                'inline-flex items-center justify-center font-medium',
                variantClasses[variant],
                sizeClasses[size],
                className
            )}
            {...props}
        >
            {icon && <span className="mr-2">{icon}</span>}
            {children}
        </button>
    );
};

export default Button;