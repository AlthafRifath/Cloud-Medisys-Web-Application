
import React, { useState, useEffect, useCallback } from 'react';
import { getAllReports, verifyReport } from '../services/apiService';
import { Report } from '../types';
import Spinner from '../components/Spinner';

const AllReports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllReports();
      setReports(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch reports.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleVerify = async (reportId: string) => {
    setVerifyingId(reportId);
    try {
      await verifyReport(reportId);
      setReports(prevReports => 
        prevReports.map(report => 
          report.ReportId === reportId ? { ...report, Verified: true } : report
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed.';
      alert(errorMessage);
    } finally {
      setVerifyingId(null);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center p-8"><Spinner /></div>;
    }
    if (error) {
      return <div className="text-center p-8 text-red-400">{error}</div>;
    }
    if (reports.length === 0) {
      return <div className="text-center p-8 text-gray-400">No reports have been submitted yet.</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Report ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Uploaded By</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Test Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {reports.map((report) => (
              <tr key={report.ReportId} className="hover:bg-gray-800/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{report.ReportId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{report.UploadedBy}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{report.TestType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                   <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    report.Verified ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                  }`}>
                    {report.Verified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {report.Verified ? (
                    <span className="text-green-400 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      Verified
                    </span>
                  ) : (
                    <button 
                      onClick={() => handleVerify(report.ReportId)} 
                      disabled={verifyingId === report.ReportId}
                      className="text-brand-secondary hover:text-white font-bold disabled:text-gray-500 disabled:cursor-wait transition-colors"
                    >
                      {verifyingId === report.ReportId ? 'Verifying...' : 'Verify'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">All System Reports</h1>
        <button onClick={fetchReports} disabled={isLoading} className="bg-gray-700 hover:bg-brand-primary p-2 rounded-full text-white transition-colors disabled:opacity-50">
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M4 4l5 5M20 20l-5-5" /></svg>
        </button>
      </div>
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};

export default AllReports;
