import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import Input from '../UI/Input';
import Button from '../UI/Button';

interface AuthFormProps {
  onAuthenticate: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthenticate }) => {
  const [authCode, setAuthCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate a brief loading delay for better UX
    setTimeout(() => {
      if (authCode === '999') {
        onAuthenticate();
      } else {
        setError('Invalid authentication code. Please try again.');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
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

        <div className="relative">
          <Input
            label="Authentication Code"
            type={showCode ? 'text' : 'password'}
            value={authCode}
            onChange={(e) => {
              setAuthCode(e.target.value);
              setError('');
            }}
            placeholder="Enter your access code"
            error={error}
            className="text-center text-lg tracking-widest"
          />
          <button
            type="button"
            onClick={() => setShowCode(!showCode)}
            className="absolute right-3 top-8 text-neutral-400 hover:text-neutral-600"
          >
            {showCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="w-full py-3 text-base font-semibold"
        >
          {loading ? 'Authenticating...' : 'Access Dashboard'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-neutral-500">
          Secure access to your property tracking dashboard
        </p>
      </div>
    </div>
  );
};

export default AuthForm;