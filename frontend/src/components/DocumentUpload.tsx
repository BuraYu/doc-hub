import React, { useState } from "react";
import { Upload, FileImage, X } from "lucide-react";
import { UploadedDocument } from "../types";

interface DocumentUploadProps {
  onDocumentUpload: (document: UploadedDocument | null) => void;
  uploadedDocument: UploadedDocument | null;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onDocumentUpload,
  uploadedDocument,
}) => {
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    const maxSizeInBytes = 5 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    
    if (file.size > maxSizeInBytes) {
      alert("File size exceeds the 5MB limit.");
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Only JPEG, PNG, and GIF are allowed.");
      return;
    }

    const preview = URL.createObjectURL(file);
    onDocumentUpload({ file, preview });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    file && handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    file && handleFile(file);
  };

  const clearFile = () => {
    if (uploadedDocument) {
      URL.revokeObjectURL(uploadedDocument.preview);
      onDocumentUpload(null);
    }
  };

  if (uploadedDocument) {
    const { file, preview } = uploadedDocument;
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Uploaded Document
          </h3>
          <button
            onClick={clearFile}
            aria-label="Remove"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <img
          src={preview}
          alt="Uploaded"
          className="w-full h-64 object-contain bg-gray-50 dark:bg-gray-700 rounded-lg"
        />

        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <FileImage className="w-4 h-4" />
            <span className="truncate">{file.name}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Upload Document
      </h3>
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
      >
        <div className="space-y-4">
          <div className="w-12 h-12 mx-auto flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
            <Upload className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              Drop your document here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              or click to browse files
            </p>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Supports: ID Cards, Passports, Driver's Licenses <br />
            Max size: 10MB • Formats: JPG, PNG, PDF
          </p>
        </div>

        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};
