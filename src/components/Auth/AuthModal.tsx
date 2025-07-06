import React, { useState } from 'react';
import { Lock, Home } from 'lucide-react';
import Input from '../UI/Input';
import Button from '../UI/Button';

interface AuthModalProps {
  onAuthenticate: (code: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onAuthenticate }) => {
  const [authCode, setAuthCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate a brief loading delay for better UX
    setTimeout(() => {
      if (authCode === '999') {
        onAuthenticate(authCode);
      } else {
        setError('Invalid authentication code. Please try again.');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
          <div className="bg-white bg-opacity-20 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Home className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Airbnb City Tracker</h1>
          <p className="text-blue-100 text-sm">
            Track property traction across cities
          </p>
        </div>

        {/* Authentication Form */}
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="bg-blue-50 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              Authentication Required
            </h2>
            <p className="text-neutral-600 text-sm">
              Please enter your authentication code to access the dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Authentication Code"
              type="password"
              value={authCode}
              onChange={(e) => {
                setAuthCode(e.target.value);
                setError('');
              }}
              placeholder="Enter your access code"
              error={error}
              className="text-center text-lg tracking-widest"
            />

            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              className="w-full py-3 text-base font-semibold"
            >
              {isLoading ? 'Authenticating...' : 'Access Dashboard'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-neutral-500">
              Secure access to your property tracking dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;