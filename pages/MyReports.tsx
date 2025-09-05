
import React, { useState, useEffect } from 'react';
import { getMyReports } from '../services/apiService';
import { Report } from '../types';
import Spinner from '../components/Spinner';

const MyReports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMyReports();
        setReports(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch reports.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center p-8"><Spinner /></div>;
    }
    if (error) {
      return <div className="text-center p-8 text-red-400">{error}</div>;
    }
    if (reports.length === 0) {
      return <div className="text-center p-8 text-gray-400">You have not uploaded any reports yet.</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Report ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Test Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Result</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Upload Time</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {reports.map((report) => (
              <tr key={report.ReportId} className="hover:bg-gray-800/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{report.ReportId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{report.TestType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{report.Result}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(report.UploadTime).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    report.Verified ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                  }`}>
                    {report.Verified ? 'Verified' : 'Pending'}
                  </span>
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
      <h1 className="text-3xl font-bold text-white mb-6">My Reports</h1>
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};

export default MyReports;
