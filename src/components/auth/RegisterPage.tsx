import React, { useState } from 'react';
import API from '../../api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tractor, Leaf } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'renter' | 'admin';
};

interface RegisterPageProps {
  onRegister: (user: User) => void;
  onNavigateToLogin: () => void;
}

const districts = [
  'Pune', 'Mumbai', 'Nashik', 'Aurangabad', 'Solapur', 'Nagpur', 'Kolhapur', 'Satara'
];

const villages = {
  'Pune': ['Baramati', 'Junnar', 'Shirur', 'Indapur', 'Daund'],
  'Mumbai': ['Vasai', 'Virar', 'Bhiwandi', 'Kalyan', 'Thane'],
  'Nashik': ['Igatpuri', 'Sinnar', 'Dindori', 'Niphad', 'Yeola'],
  'Aurangabad': ['Vaijapur', 'Gangapur', 'Paithan', 'Khultabad', 'Sillod'],
  'Solapur': ['Barshi', 'Pandharpur', 'Akkalkot', 'Mangalwedha', 'Karmala'],
  'Nagpur': ['Kamptee', 'Hingna', 'Parseoni', 'Narkhed', 'Katol'],
  'Kolhapur': ['Shahuwadi', 'Shirol', 'Hatkanangale', 'Gaganbawada', 'Radhanagari'],
  'Satara': ['Wai', 'Phaltan', 'Koregaon', 'Karad', 'Mahabaleshwar']
};

export function RegisterPage({ onRegister, onNavigateToLogin }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setIsLoading(true);

    try {
      const { data } = await API.post('/api/auth/signup', formData);
      localStorage.setItem('token', data.token);
      const userResponse = await API.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      onRegister(userResponse.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Tractor className="h-8 w-8 text-green-600" />
            <Leaf className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-3xl text-green-800 mb-2">FarmRent</h1>
          <p className="text-muted-foreground">Join the farming community</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Sign up to start listing or renting farm equipment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>


              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <button
                  onClick={onNavigateToLogin}
                  className="text-primary hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
// Minor change to trigger re-compilation
