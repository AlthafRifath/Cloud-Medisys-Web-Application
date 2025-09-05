import { API_BASE_URL } from '../constants';
import { Report, SystemUser, DashboardStats, CreateUserPayload, DeleteUserPayload } from '../types';

// --- API HELPER ---
const apiFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  // Use the id_token for authorization, as it's a common pattern for Cognito authorizers
  // to validate it, as it contains user identity and roles (cognito:groups).
  const token = localStorage.getItem('id_token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }

  // THE FIX: Attempt to parse the response as JSON regardless of headers.
  // This is more resilient, like Postman, and handles backend header inconsistencies.
  try {
    const text = await response.text();
    // If the server returns a 200 OK but an empty body, return an empty object
    // to prevent JSON parsing errors. This is a safe default.
    return text ? JSON.parse(text) : ({} as T);
  } catch (error) {
    console.error("Failed to parse API response, even though status was OK:", error);
    throw new Error("Received a malformed response from the server.");
  }
};


// --- API FUNCTIONS ---
export const uploadReport = (payload: { fileName: string, testType: string, fileBase64: string }): Promise<{ success: boolean; message: string }> => {
  return apiFetch<{ success: boolean; message:string }>('/upload-report', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const getMyReports = (): Promise<Report[]> => {
  return apiFetch<Report[]>('/my-reports');
};

export const getAllReports = (): Promise<Report[]> => {
  return apiFetch<Report[]>('/all-reports');
};

export const verifyReport = (reportId: string): Promise<{ success: boolean; message: string }> => {
  return apiFetch<{ success: boolean; message: string }>(`/verify-report/${reportId}`, {
    method: 'PUT',
  });
};

export const getUsers = (): Promise<SystemUser[]> => {
  return apiFetch<SystemUser[]>('/all-users');
};

export const getDashboardStats = (): Promise<DashboardStats> => {
  return apiFetch<DashboardStats>('/get-dashboard-stats');
};

export const createUser = (payload: CreateUserPayload): Promise<{ success: boolean; message: string }> => {
  return apiFetch<{ success: boolean; message: string }>('/create-users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const deleteUser = (payload: DeleteUserPayload): Promise<{ success: boolean; message: string }> => {
  return apiFetch<{ success: boolean; message: string }>('/delete-users', {
    method: 'DELETE',
    body: JSON.stringify(payload),
  });
};