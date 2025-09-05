
export interface User {
  email: string;
  roles: string[];
}

export interface Report {
  ReportId: string;
  TestType: string;
  Result: string;
  UploadTime: string;
  Verified: boolean;
  UploadedBy: string;
}

export interface SystemUser {
  email: string;
  status: string;
  roles: string[];
}

/**
 * Represents the dynamic, role-based statistics returned from the dashboard endpoint.
 * Properties are optional to accommodate the different data shapes for each user role.
 */
export interface DashboardStats {
  role: 'Admin' | 'MedisysStaff' | 'ClinicUser';
  // Admin & Staff properties
  totalReports?: number;
  verifiedReports?: number;
  unverifiedReports?: number; // Was pendingReports
  // Admin specific
  clinicUsers?: number;
  medisysStaff?: number;
  // Staff specific
  reportByTestType?: { [key: string]: number };
  // Clinic user specific
  totalUploads?: number;
  verifiedUploads?: number;
  unverifiedUploads?: number;
  lastUploadTime?: string | null;
  // Generic property for frontend use if needed
  totalUsers?: number;
}


export interface CreateUserPayload {
  email: string;
  password?: string; // Make password optional for frontend validation state
  group: 'ClinicUser' | 'MedisysStaff' | 'Admin';
}

export interface DeleteUserPayload {
  username: string;
}