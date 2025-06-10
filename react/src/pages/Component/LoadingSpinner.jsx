import { RefreshCw } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...', className = '' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16'
    };

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl'
    };

    return (
        <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
            <RefreshCw className={`${sizeClasses[size]} text-blue-600 animate-spin`} />
            {text && (
                <p className={`${textSizeClasses[size]} text-gray-600 font-medium`}>
                    {text}
                </p>
            )}
        </div>
    );
};

export default LoadingSpinner;