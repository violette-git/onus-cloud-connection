import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Eye, EyeOff } from 'lucide-react';

export const AuthForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    navigate('/');
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-white">Welcome to Onus</DialogTitle>
        <DialogDescription className="text-gray-300">
          {isSignUp ? 'Create new account' : 'Sign in to your account'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-white" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-white bg-gray-800 border-gray-700"
            placeholder="test@onus.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label className="text-white" htmlFor="password">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-white bg-gray-800 border-gray-700 pr-10"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-200"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <Button type="submit" className="w-full">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </Button>
        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-gray-300 hover:text-white"
          >
            {isSignUp 
              ? 'Already have an account? Sign In'
              : 'Don\'t have an account? Sign Up'}
          </button>
        </div>
      </form>
    </>
  );
};
