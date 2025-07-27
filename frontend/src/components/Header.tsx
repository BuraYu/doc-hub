import type React from "react";
import { FileCheck } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FileCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                DocHub
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Document Verification System
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
