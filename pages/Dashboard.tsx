
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getDashboardStats } from '../services/apiService';
import { DashboardStats } from '../types';
import Spinner from '../components/Spinner';

const StatCard: React.FC<{ title: string, value: number | string, icon: JSX.Element }> = ({ title, value, icon }) => (
  <div className="bg-gray-800 p-4 rounded-lg flex items-center">
    <div className="p-3 mr-4 bg-brand-primary rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.roles.includes('Admin');
  const isStaff = user?.roles.includes('MedisysStaff');
  const isClinicUser = user && !isAdmin && !isStaff;

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoadingStats(true);
        const data = await getDashboardStats();
        // For Admins, we can calculate totalUsers on the frontend for the StatCard
        if (data && data.role === 'Admin') {
          data.totalUsers = (data.clinicUsers ?? 0) + (data.medisysStaff ?? 0);
        }
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const cardClasses = "bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 hover:shadow-cyan-500/50 transition-all duration-300 flex flex-col items-start";
  const iconClasses = "h-12 w-12 text-brand-secondary mb-4";
  const titleClasses = "text-xl font-bold text-white mb-2";
  const descriptionClasses = "text-gray-400";

  const renderStats = () => {
    if (isLoadingStats) {
      return <div className="flex justify-center"><Spinner /></div>;
    }
    if (!stats) {
      return <div className="text-center text-gray-400">Could not load dashboard statistics.</div>;
    }

    switch (stats.role) {
      case 'Admin':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Users" value={stats.totalUsers ?? 'N/A'} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 016-5.197M15 21a9 9 0 00-9-5.197" /></svg>} />
            <StatCard title="Total Reports" value={stats.totalReports ?? 'N/A'} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />
            <StatCard title="Pending Reports" value={stats.unverifiedReports ?? 'N/A'} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
            <StatCard title="Verified Reports" value={stats.verifiedReports ?? 'N/A'} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
          </div>
        );
      case 'MedisysStaff':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <StatCard title="Total Reports" value={stats.totalReports ?? 'N/A'} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />
              <StatCard title="Pending Reports" value={stats.unverifiedReports ?? 'N/A'} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
              <StatCard title="Verified Reports" value={stats.verifiedReports ?? 'N/A'} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-3">Reports by Type</h3>
              <ul className="space-y-2">
                {stats.reportByTestType && Object.keys(stats.reportByTestType).length > 0 ? (
                  Object.entries(stats.reportByTestType).map(([type, count]) => (
                    <li key={type} className="flex justify-between items-center bg-gray-700/50 p-2 rounded">
                      <span className="text-sm text-gray-300">{type}</span>
                      <span className="font-bold text-white">{count}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No reports found.</p>
                )}
              </ul>
            </div>
          </div>
        );
      case 'ClinicUser':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="My Total Uploads" value={stats.totalUploads ?? 'N/A'} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />
            <StatCard title="My Pending Reports" value={stats.unverifiedUploads ?? 'N/A'} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
            <StatCard title="My Verified Reports" value={stats.verifiedUploads ?? 'N/A'} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
            <StatCard title="Last Upload" value={stats.lastUploadTime ? new Date(stats.lastUploadTime).toLocaleDateString() : 'N/A'} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
          </div>
        );
      default:
        return <div className="text-center text-gray-400">Dashboard data is not available for your role.</div>;
    }
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Welcome, {user?.email}</h1>
        <p className="mt-2 text-gray-400">Your role: <span className="font-semibold text-brand-secondary">{user?.roles.join(', ') || 'User'}</span></p>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-900/50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-300 mb-4">Dashboard Overview</h2>
        {renderStats()}
      </div>
      
      {/* Action Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Clinic User Cards */}
        {isClinicUser && (
          <>
            <Link to="/upload" className={cardClasses}>
              <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-4-4V6a2 2 0 012-2h10a2 2 0 012 2v6a4 4 0 01-4 4H7z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 16v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12v6" /></svg>
              <h2 className={titleClasses}>Upload New Report</h2>
              <p className={descriptionClasses}>Submit a new diagnostic report for processing.</p>
            </Link>
            <Link to="/my-reports" className={cardClasses}>
              <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <h2 className={titleClasses}>My Reports</h2>
              <p className={descriptionClasses}>View the status of all reports you have uploaded.</p>
            </Link>
          </>
        )}
        
        {(isAdmin || isStaff) && (
          <Link to="/all-reports" className={cardClasses}>
            <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            <h2 className={titleClasses}>All Reports</h2>
            <p className={descriptionClasses}>Access and verify all submitted reports across the system.</p>
          </Link>
        )}

        {isAdmin && (
          <Link to="/manage-users" className={cardClasses}>
            <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <h2 className={titleClasses}>Manage Users</h2>
            <p className={descriptionClasses}>Create, view, and manage all user accounts.</p>
          </Link>
        )}

        <Link to="/profile" className={cardClasses}>
          <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <h2 className={titleClasses}>My Profile</h2>
          <p className={descriptionClasses}>View your account details and assigned roles.</p>
        </Link>

      </div>
    </div>
  );
};

export default Dashboard;