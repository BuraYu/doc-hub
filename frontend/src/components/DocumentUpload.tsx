import React, { useState } from "react";
import { Upload, FileImage, X, CheckCircle } from "lucide-react";
import { UploadedDocuments } from "../types";

interface DocumentUploadProps {
  onDocumentUpload: (documents: UploadedDocuments[]) => void;
  uploadedDocuments: UploadedDocuments[];
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onDocumentUpload,
  uploadedDocuments,
}) => {
  const [dragOver, setDragOver] = useState(false);

  const maxSizeInBytes = 10 * 1024 * 1024;
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newDocuments: UploadedDocuments[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > maxSizeInBytes) {
        alert(`${file.name} exceeds the 10MB limit.`);
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name} is not a supported file type.`);
        return;
      }

      const preview = URL.createObjectURL(file);
      newDocuments.push({ file, preview });
    });

    if (newDocuments.length > 0) {
      onDocumentUpload([...uploadedDocuments, ...newDocuments]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeFile = (index: number) => {
    const newDocs = [...uploadedDocuments];
    URL.revokeObjectURL(newDocs[index].preview);
    newDocs.splice(index, 1);
    onDocumentUpload(newDocs);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {uploadedDocuments.length > 0
          ? "Uploaded Documents"
          : "Upload Document"}
      </h3>

      {uploadedDocuments.length > 0 && (
        <div className="grid gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
          {uploadedDocuments.map(({ file, preview }, index) => (
            <div
              key={index}
              className="relative border rounded-lg bg-gray-50 dark:bg-gray-700 p-3"
            >
              <button
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                aria-label="Remove file"
              >
                <X className="w-5 h-5" />
              </button>

              {file.type.startsWith("image/") ? (
                <img
                  src={preview}
                  alt={file.name}
                  className="w-full h-40 object-contain rounded mb-2"
                />
              ) : (
                <div className="h-40 flex flex-col items-center justify-center rounded text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                  <a
                    href={preview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Open PDF
                  </a>
                </div>
              )}

              <div className="text-sm text-gray-700 dark:text-gray-200">
                <div className="flex items-center gap-2 truncate">
                  <FileImage className="w-4 h-4" />
                  {file.name}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

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
              Drop documents here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              or click to browse files
            </p>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Max 10MB per file • JPG, PNG, PDF
          </p>
        </div>

        <input
          type="file"
          multiple
          accept="image/*,.pdf"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};
