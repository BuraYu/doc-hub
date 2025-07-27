import React, { useCallback, useState } from "react";
import { Upload, FileImage, X } from "lucide-react";
import { UploadedDocument } from "../types";

interface DocumentUploadProps {
  onDocumentUpload: (document: UploadedDocument) => void;
  uploadedDocument: UploadedDocument | null;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onDocumentUpload,
  uploadedDocument,
}) => {
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = useCallback(
    (file: File) => {
      if (file && file.type.startsWith("image/")) {
        const preview = URL.createObjectURL(file);
        onDocumentUpload({ file, preview });
      }
    },
    [onDocumentUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const clearDocument = () => {
    if (uploadedDocument) {
      URL.revokeObjectURL(uploadedDocument.preview);
      onDocumentUpload(null as any);
    }
  };

  if (uploadedDocument) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Uploaded Document
          </h3>
          <button
            onClick={clearDocument}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Remove document"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative">
          <img
            src={uploadedDocument.preview}
            alt="Uploaded document"
            className="w-full h-64 object-contain bg-gray-50 dark:bg-gray-700 rounded-lg"
          />
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-2">
              <FileImage className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                {uploadedDocument.file.name}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {(uploadedDocument.file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
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
          <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <Upload className="h-6 w-6 text-gray-400" />
          </div>

          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              Drop your document here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              or click to browse files
            </p>
          </div>

          <div className="text-xs text-gray-400 dark:text-gray-500">
            Supports: ID Cards, Passports, Driver's Licenses
            <br />
            Max file size: 10MB • Formats: JPG, PNG, PDF
          </div>
        </div>

        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};
