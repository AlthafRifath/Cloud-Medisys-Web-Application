import React, { useState, useEffect, useCallback } from 'react';
import { getUsers, createUser, deleteUser } from '../services/apiService';
import { SystemUser, CreateUserPayload } from '../types';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<CreateUserPayload>({
    email: '',
    password: '',
    group: 'ClinicUser',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

const normalizeUsers = (data: any): SystemUser[] => {
  const arr = Array.isArray(data) ? data : [];
  return arr.map((u: any) => {
    const email = u.Email ?? u.email ?? u.Username ?? u.username ?? '';
    const rolesRaw = u.Groups ?? u.roles ?? [];

    const roles = Array.isArray(rolesRaw)
      ? rolesRaw
      : rolesRaw
      ? [String(rolesRaw)]
      : [];

      return {
        email,
        roles,
      } as SystemUser;
    });
  };


  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getUsers();
      const safeUsers = normalizeUsers(data);
      setUsers(safeUsers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users.';
      setError(errorMessage);
      setUsers([]); // keep UI stable
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.email || !newUser.password) {
      setFormError('Email and password are required.');
      return;
    }
    setIsSubmitting(true);
    setFormError(null);
    try {
      await createUser(newUser);
      setIsModalOpen(false);
      setNewUser({ email: '', password: '', group: 'ClinicUser' });
      fetchUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user.';
      setFormError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (usernameOrEmail: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete the user ${usernameOrEmail}? This action cannot be undone.`
      )
    ) {
      try {
        await deleteUser({ username: usernameOrEmail });
        fetchUsers();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete user.';
        alert(errorMessage);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center p-8">
          <Spinner />
        </div>
      );
    }
    if (error) {
      return <div className="text-center p-8 text-red-400">{error}</div>;
    }
    if (!Array.isArray(users) || users.length === 0) {
      return <div className="text-center p-8 text-gray-400">No users found.</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Roles
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {users.map((user) => {
              const key = user.email || crypto.randomUUID();
              const rolesText = Array.isArray(user.roles)
                ? user.roles.join(', ')
                : user.roles
                ? String(user.roles)
                : 'N/A';

              return (
                <tr key={key} className="hover:bg-gray-800/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {rolesText}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteUser(user.email)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Manage System Users</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Create User
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">{renderContent()}</div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New User">
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={newUser.email}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-secondary"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={newUser.password}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-secondary"
            />
          </div>
          <div>
            <label htmlFor="group" className="block text-sm font-medium text-gray-300">
              Role
            </label>
            <select
              name="group"
              id="group"
              value={newUser.group}
              onChange={handleInputChange}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-secondary"
            >
              <option value="ClinicUser">Clinic User</option>
              <option value="MedisysStaff">Medisys Staff</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          {formError && <p className="text-sm text-red-400">{formError}</p>}
          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-gray-600"
            >
              {isSubmitting ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageUsers;
