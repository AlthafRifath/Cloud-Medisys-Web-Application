
import React, { useState } from 'react';
import { uploadReport } from '../services/apiService';

// Helper function to read file as Base64
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        // Result is in format "data:mime/type;base64,the-real-base64-string"
        // We only want the part after the comma.
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
    };
    reader.onerror = error => reject(error);
});

const UploadReport: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [testType, setTestType] = useState('Blood Panel');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a CSV file to upload.' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const fileBase64 = await toBase64(file);
      const payload = { 
        fileName: file.name, 
        testType,
        fileBase64 
      };

      const response = await uploadReport(payload);
      setMessage({ type: 'success', text: response.message });
      setFile(null);
      // Reset the file input visually
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setMessage({ type: 'error', text: `Submission failed: ${errorMessage}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Upload New Report</h1>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="testType" className="block text-sm font-medium text-gray-300 mb-2">Test Type</label>
            <select
              id="testType"
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-secondary"
            >
              <option>Blood Panel</option>
              <option>MRI Scan</option>
              <option>X-Ray</option>
              <option>Urinalysis</option>
            </select>
          </div>

          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-300 mb-2">Report File (CSV)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <div className="flex text-sm text-gray-400">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-brand-secondary hover:text-brand-primary focus-within:outline-none">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".csv" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">{file ? file.name : 'CSV up to 10MB'}</p>
              </div>
            </div>
          </div>
          
          {message && (
            <div className={`p-4 rounded-md text-sm ${message.type === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
              {message.text}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading || !file}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-brand-secondary disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Uploading...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadReport;
