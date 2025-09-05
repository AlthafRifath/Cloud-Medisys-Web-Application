
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading user profile...</div>;
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">My Profile</h1>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400">Email Address</label>
          <p className="mt-1 text-lg text-white p-3 bg-gray-700 rounded-md">{user.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400">Assigned Roles</label>
          <div className="mt-1 flex flex-wrap gap-2">
            {user.roles.length > 0 ? (
              user.roles.map((role) => (
                <span key={role} className="px-3 py-1 text-sm font-semibold text-cyan-200 bg-cyan-800/50 rounded-full">
                  {role}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No roles assigned.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
