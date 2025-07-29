import React from "react";
import { CheckCircle, User, Calendar, AlertCircle } from "lucide-react";

export interface VerificationResult {
  name: string;
  name_confidence: number;
  surname: string;
  surname_confidence: number;
  date_of_birth: string;
  date_of_birth_confidence: number;
}

interface VerificationResultsProps {
  results: VerificationResult[] | null;
  error: string | null;
  analysisResult?: string | null;
}

const ErrorMessage: React.FC<{ error: string }> = ({ error }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
    <div className="flex items-center space-x-3 mb-4">
      <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
        <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Verification Failed
      </h3>
    </div>
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <p className="text-red-700 dark:text-red-300">{error}</p>
    </div>
  </div>
);

const AnalysisResultMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-yellow-50 dark:bg-yellow-900 rounded-xl shadow-lg p-6 mb-8 transition-colors">
    <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
      Analysis Result
    </h3>
    <pre className="whitespace-pre-wrap text-yellow-900 dark:text-yellow-300 font-mono">
      {message}
    </pre>
  </div>
);

const NoDataMessage: React.FC = () => (
  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      No verification data available
    </h3>
    <p className="text-gray-600 dark:text-gray-400">
      Please upload documents and run verification.
    </p>
  </div>
);

const ResultField: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => {
  const isUnknown = value.toLowerCase() === "unknown";

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-2">
        {icon}
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {label}
        </span>
      </div>
      <p
        className={`text-lg font-semibold ${
          isUnknown
            ? "text-red-700 dark:text-red-400 font-bold"
            : "text-gray-900 dark:text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
};

const SuccessMessage: React.FC<{
  results: VerificationResult;
  index: number;
}> = ({ results, index }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
    <div className="flex items-center space-x-3 mb-6">
      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Verification Successful - Document #{index + 1}
      </h3>
    </div>
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ResultField
          icon={<User className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
          label="First Name"
          value={results.name}
        />
        <ResultField
          icon={<User className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
          label="Last Name"
          value={results.surname}
        />
      </div>
      <ResultField
        icon={<Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
        label="Date of Birth"
        value={results.date_of_birth}
      />
    </div>
    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <p className="text-sm text-blue-700 dark:text-blue-300">
        ✓ Document successfully processed and verified
      </p>
    </div>
  </div>
);

export const VerificationResults: React.FC<VerificationResultsProps> = ({
  results,
  error,
  analysisResult,
}) => {
  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (analysisResult) {
    return <AnalysisResultMessage message={analysisResult} />;
  }

  if (!results || results.length === 0) {
    return <NoDataMessage />;
  }

  return (
    <>
      {results.map((result, index) => (
        <div key={index} className="mb-8">
          <SuccessMessage results={result} index={index} />
        </div>
      ))}
    </>
  );
};
