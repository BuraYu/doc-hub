import { useState } from "react";
import { useEffect } from "react";
import { Header } from "./components/Header";
import { DocumentUpload } from "./components/DocumentUpload";
import { VerificationButton } from "./components/VerificationButton";
import { VerificationResults } from "./components/VerificationResults";
import { UploadedDocument, VerificationResult } from "./types";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [uploadedDocument, setUploadedDocument] =
    useState<UploadedDocument | null>(null);
  const [verificationResults, setVerificationResults] =
    useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleDocumentUpload = (document: UploadedDocument | null) => {
    setUploadedDocument(document);
    setVerificationResults(null);
    setError(null);
  };

  const handleVerification = async () => {
    if (!uploadedDocument) return;

    setIsLoading(true);
    setError(null);
    setVerificationResults(null);

    //mock data
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const mockResults: VerificationResult = {
        name: "John",
        lastname: "Doe",
        dob: "1990-01-15",
      };

      setVerificationResults(mockResults);
    } catch (err) {
      setError("Failed to verify document. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Document Verification
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Upload your ID, passport, or driver's license to extract and
              verify personal information securely using our advanced OCR
              technology.
            </p>
          </div>

          <DocumentUpload
            onDocumentUpload={handleDocumentUpload}
            uploadedDocument={uploadedDocument}
          />

          {uploadedDocument && (
            <VerificationButton
              onVerify={handleVerification}
              isLoading={isLoading}
              disabled={!uploadedDocument}
            />
          )}

          <VerificationResults results={verificationResults} error={error} />
        </div>
      </main>
    </div>
  );
}

export default App;
