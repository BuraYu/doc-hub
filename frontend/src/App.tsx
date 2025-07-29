import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { DocumentUpload } from "./components/DocumentUpload";
import { VerificationButton } from "./components/VerificationButton";
import { VerificationResults } from "./components/VerificationResults";
import { UploadedDocuments, VerificationResult } from "./types";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<
    UploadedDocuments[]
  >([]);
  const [verificationResults, setVerificationResults] = useState<
    VerificationResult[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

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

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleDocumentUpload = (documents: UploadedDocuments[]) => {
    setUploadedDocuments(documents);
    setVerificationResults(null);
    setError(null);
    setAnalysisResult(null);
  };

  const handleVerification = async () => {
    if (uploadedDocuments.length === 0) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setVerificationResults(null);
    setAnalysisResult(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log("Request timed out, aborting...");
      controller.abort();
    }, 30000);

    try {
      const formData = new FormData();
      uploadedDocuments.forEach((doc) => {
        formData.append("files", doc.file);
      });
      formData.append("prompt", "");

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();


      if (!data) {
        throw new Error("Empty response from server.");
      }

      if (data.error && typeof data.error === "string") {
        setAnalysisResult(data.error);
        return;
      }

      if (!data) {
        throw new Error("Empty response from server.");
      }

      if (data.error && typeof data.error === "string") {
        setAnalysisResult(data.error);
        return;
      }

      const resultsArray = Array.isArray(data) ? data : [data];

      const apiResults: VerificationResult[] = resultsArray.map(
        (item: any) => ({
          name: item.name,
          name_confidence: item.name_confidence ?? 0,
          surname: item.surname,
          surname_confidence: item.surname_confidence ?? 0,
          date_of_birth: item.date_of_birth,
          date_of_birth_confidence: item.date_of_birth_confidence ?? 0,
        })
      );

      setVerificationResults(apiResults);
    } catch (err) {
      clearTimeout(timeoutId);

      if (err instanceof Error) {
        if (err.name === "AbortError") {
          setError("Request timed out. Please try again.");
        } else if (err.name === "TypeError" && err.message.includes("fetch")) {
          setError("Network error. Please check your connection.");
        } else if (err.message.includes("HTTP Error")) {
          setError("Server error. Please try again later.");
        } else {
          setError(`Verification failed: ${err.message}`);
        }
      }
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
              verify personal information securely using our advanced AI
              technology.
            </p>
          </div>

          <DocumentUpload
            onDocumentUpload={handleDocumentUpload}
            uploadedDocuments={uploadedDocuments}
          />

          {uploadedDocuments && (
            <VerificationButton
              onVerify={handleVerification}
              isLoading={isLoading}
              disabled={uploadedDocuments.length === 0}
            />
          )}

          <VerificationResults
            results={verificationResults}
            error={error}
            analysisResult={analysisResult}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
