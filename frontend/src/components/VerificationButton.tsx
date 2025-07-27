import React from "react";
import { Search, Loader2 } from "lucide-react";

interface VerificationButtonProps {
  onVerify: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const VerificationButton: React.FC<VerificationButtonProps> = ({
  onVerify,
  isLoading,
  disabled,
}) => {
  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={onVerify}
        disabled={disabled || isLoading}
        className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
          disabled || isLoading
            ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Verifying Document...</span>
          </>
        ) : (
          <>
            <Search className="h-5 w-5" />
            <span>Verify Document</span>
          </>
        )}
      </button>
    </div>
  );
};
