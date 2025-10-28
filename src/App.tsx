import React, { useState, useEffect } from 'react';
import API from './api';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { HomePage } from './components/home/HomePage';
import { Dashboard } from './components/dashboard/Dashboard';
import { ListingPage } from './components/listings/ListingPage';
import EquipmentDetailsPage from './components/listings/EquipmentDetailsPage';
import { SearchResults } from './components/search/SearchResults';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ChatPage } from './components/chat/ChatPage';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'renter' | 'admin';
};

// ProfilePage is not defined, so I'll create a placeholder for it.
const ProfilePage = ({ user, onLogout }: { user: User, onLogout: () => void }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Profile Page</h1>
      <p className="text-lg">Welcome, {user.name}!</p>
      <p className="text-md text-muted-foreground">{user.email}</p>
      <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Go Back</button>
      <button onClick={onLogout} className="mt-2 px-4 py-2 bg-red-500 text-white rounded">Sign Out</button>
    </div>
  );
};

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshListings, setRefreshListings] = useState(0); // State to trigger listing refresh
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await API.get('/api/auth/me');
          setUser(data);
          if (data.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/home');
          }
        } catch (error) {
          console.error(error);
          localStorage.removeItem('token');
          navigate('/login');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        navigate('/login');
      }
    };
    fetchUser();
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    if (userData.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/home');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleListingCreated = () => {
    setRefreshListings(prev => prev + 1); // Increment to trigger refresh
  };

  const navigateTo = (path: string, id?: string) => {
    if (id) {
      navigate(`${path}/${id}`);
    } else {
      navigate(path);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    navigate('/search');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={handleLogin} onNavigateToRegister={() => navigateTo('/register')} />} />
      <Route path="/register" element={<RegisterPage onRegister={handleLogin} onNavigateToLogin={() => navigateTo('/login')} />} />
      
      {user ? (
        <>
          <Route path="/home" element={<HomePage user={user} onNavigate={navigateTo} onSearch={handleSearch} onLogout={handleLogout} refreshTrigger={refreshListings} />} />
          <Route path="/dashboard" element={<Dashboard user={user} onNavigate={navigateTo} onLogout={handleLogout} refreshTrigger={refreshListings} />} />
          <Route path="/listing" element={<ListingPage user={user} onNavigate={navigateTo} onLogout={handleLogout} onListingCreated={handleListingCreated} />} />
          <Route path="/listing/:listingId" element={<ListingPage user={user} onNavigate={navigateTo} onLogout={handleLogout} onListingCreated={handleListingCreated} />} />
          <Route path="/equipment/:id" element={<EquipmentDetailsPage />} />
          <Route path="/search" element={<SearchResults user={user} onNavigate={navigateTo} onLogout={handleLogout} />} />
          <Route path="/chat" element={<ChatPage user={user} onNavigate={navigateTo} onLogout={handleLogout} />} />
          <Route path="/profile" element={<ProfilePage user={user} onLogout={handleLogout} />} />
          {user.role === 'admin' && (
            <Route path="/admin" element={<AdminDashboard user={user} onNavigate={navigateTo} handleLogout={handleLogout} />} />
          )}
          <Route path="*" element={<HomePage user={user} onNavigate={navigateTo} onSearch={handleSearch} onLogout={handleLogout} refreshTrigger={refreshListings} />} />
        </>
      ) : (
        <Route path="*" element={<LoginPage onLogin={handleLogin} onNavigateToRegister={() => navigateTo('/register')} />} />
      )}
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
