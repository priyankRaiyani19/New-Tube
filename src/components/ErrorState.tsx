import React from 'react';
import {AlertOctagon} from 'lucide-react';
import Button from './Button.tsx';
import {ErrorStateProps} from "../types/video.ts";


const ErrorState: React.FC<ErrorStateProps> = ({

                                                   error,
                                                   onRetry,
                                                   message
                                               }) => {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

    return (
        <div
            className="flex flex-col w-full lg:min-w-[30rem] h-[13rem] items-center justify-center p-8 text-center bg-card rounded-lg">
            <AlertOctagon size={40} className="text-red-500 mb-4"/>
            <h3 className="text-xl font-semibold text-white mb-2">{message}</h3>
            <p className="text-gray-400 mb-4 max-w-lg">{errorMessage}</p>
            {onRetry && (
                <Button onClick={onRetry} variant="primary">
                    Try Again
                </Button>
            )}
        </div>
    );
};

export default ErrorState;