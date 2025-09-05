import React from 'react';
import { COGNITO_LOGIN_URL } from '../constants';

const Login: React.FC = () => {
  return (
    <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 10rem)' }}>
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
           </svg>
          <h1 className="mt-6 text-3xl font-extrabold text-white">
            Medisys Secure Portal
          </h1>
          <p className="mt-2 text-center text-sm text-gray-400">
            Please log in to manage diagnostic reports.
          </p>
        </div>
        
        <button
          onClick={() => window.location.href = COGNITO_LOGIN_URL}
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors"
        >
          <span className="absolute left-0 inset-y-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-gray-300 group-hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </span>
          Sign In with Medisys SSO
        </button>
      </div>
    </div>
  );
};

export default Login;