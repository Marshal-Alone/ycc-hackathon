import React, { useState } from 'react';
import API from '../../api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tractor, Leaf, Eye, EyeOff, CheckCircle } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'renter' | 'admin';
  location: {
    district: string;
    village: string;
  };
};

interface LoginPageProps {
  onLogin: (user: User) => void;
  onNavigateToRegister: () => void;
}

const features = [
  { text: 'Connect with local farmers', icon: CheckCircle },
  { text: 'Rent equipment by the hour or day', icon: CheckCircle },
  { text: 'Earn extra income from your equipment', icon: CheckCircle },
  { text: 'Secure payment and rating system', icon: CheckCircle }
];

export function LoginPage({ onLogin, onNavigateToRegister }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      const userResponse = await API.get('/auth/me', {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      onLogin(userResponse.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center max-w-md mx-auto">
          <div className="flex items-center space-x-3 mb-8">
            <div className="flex items-center space-x-2 p-3 rounded-xl bg-white/20 backdrop-blur-sm">
              <Tractor className="h-8 w-8" />
              <Leaf className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">FarmRent</h1>
              <p className="text-green-100">Farmer-to-Farmer Marketplace</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Share Equipment.<br />
                Grow Together.
              </h2>
              <p className="text-green-100 text-lg leading-relaxed">
                Connect with fellow farmers to rent and share agricultural equipment, 
                tools, and land resources in your community.
              </p>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <feature.icon className="h-5 w-5 text-green-200" />
                  <span className="text-green-100">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="pt-8">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">1,200+</div>
                  <div className="text-green-200 text-sm">Active Farmers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">135</div>
                  <div className="text-green-200 text-sm">Equipment Listed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">850+</div>
                  <div className="text-green-200 text-sm">Successful Rentals</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="flex items-center space-x-2 p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                <Tractor className="h-6 w-6" />
                <Leaf className="h-6 w-6" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">FarmRent</h1>
            <p className="text-muted-foreground">Farmer-to-Farmer Marketplace</p>
          </div>

          <Card className="border-2 border-gray-100 shadow-xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
              <CardDescription className="text-center">
                Sign in to your account to continue growing with the community
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="farmer@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 border-2 border-gray-200 focus:border-green-400 transition-colors"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 border-2 border-gray-200 focus:border-green-400 transition-colors pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <button type="button" className="text-sm text-green-600 hover:text-green-700 font-medium">
                    Forgot password?
                  </button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg transition-all duration-200" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={onNavigateToRegister}
                    className="text-green-600 hover:text-green-700 font-semibold transition-colors"
                  >
                    Create Account
                  </button>
                </p>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="text-sm font-semibold text-green-800 mb-2">Demo Credentials:</h4>
                <div className="text-xs text-green-700 space-y-1">
                  <div><strong>Farmer:</strong> Use any email + password</div>
                  <div><strong>Admin:</strong> admin@farmrent.com + password</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
