import React, { useState, useEffect } from 'react'; // Import useEffect
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Star,
  CheckCircle,
  Clock,
  XCircle,
  MessageCircle,
  TrendingUp,
  DollarSign,
  Users,
  Package,
  Eye,
  Heart,
  BarChart3
} from 'lucide-react';
import api from '../../api'; // Import API instance
import { toast } from 'sonner'; // Import toast for notifications

type User = {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'renter' | 'admin';
};

// Define Listing type for frontend (consistent with ListingPage.tsx)
type Listing = {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  priceType: string;
  images: { url: string; publicId: string; }[];
  location: {
    district: string;
    village: string;
  };
  owner: {
    _id: string;
    name: string;
  };
  isApproved: boolean;
  isSuspicious: boolean;
  createdAt: string;
  updatedAt: string;
  // Add any other fields that might be displayed in the dashboard
  bookings?: number; // Assuming these might come from a more complex query or be calculated
  rating?: number;
  views?: number;
  likes?: number;
  performance?: string;
};

interface DashboardProps {
  user: User;
  onNavigate: (page: string, id?: string) => void; // Modified to accept optional ID for editing
  onLogout: () => void;
  refreshTrigger: number; // New prop to trigger listing refresh
}

const mockBookings = [
  {
    id: '1',
    listingTitle: 'Combine Harvester',
    owner: 'Pradeep Singh',
    startDate: '2024-01-25',
    endDate: '2024-01-27',
    status: 'confirmed',
    total: 9000,
    type: 'outgoing',
    avatar: 'PS'
  },
  {
    id: '2',
    listingTitle: 'John Deere 5310 Tractor',
    renter: 'Raj Patel',
    startDate: '2024-01-28',
    endDate: '2024-01-30',
    status: 'pending',
    total: 4500,
    type: 'incoming',
    avatar: 'RP'
  },
  {
    id: '3',
    listingTitle: 'Rotary Tiller Set',
    renter: 'Mukesh Gupta',
    startDate: '2024-01-22',
    endDate: '2024-01-23',
    status: 'completed',
    total: 1600,
    type: 'incoming',
    avatar: 'MG'
  }
];

const recentActivities = [
  { type: 'booking_request', message: 'New booking request for John Deere Tractor', time: '2 hours ago' },
  { type: 'review', message: 'Received 5-star review from Raj Patel', time: '1 day ago' },
  { type: 'message', message: 'New message from Amit Sharma', time: '2 days ago' },
  { type: 'payment', message: 'Payment of ₹1,600 received', time: '3 days ago' }
];

export function Dashboard({ user, onNavigate, onLogout, refreshTrigger }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [isLoadingMyListings, setIsLoadingMyListings] = useState(true);
  const [myBookings, setMyBookings] = useState([]);
  const [isLoadingMyBookings, setIsLoadingMyBookings] = useState(true);

  useEffect(() => {
    const fetchMyListings = async () => {
      if (!user) {
        setIsLoadingMyListings(false);
        return;
      }
      try {
        const { data } = await api.get('/listings/my');
        setMyListings(data);
      } catch (error) {
        console.error('Error fetching my listings:', error);
        toast.error('Failed to load your listings.');
      } finally {
        setIsLoadingMyListings(false);
      }
    };

    const fetchMyBookings = async () => {
      if (!user) {
        setIsLoadingMyBookings(false);
        return;
      }
      try {
        const { data } = await api.get('/bookings/owner');
        setMyBookings(data);
      } catch (error) {
        console.error('Error fetching my bookings:', error);
        toast.error('Failed to load your bookings.');
      } finally {
        setIsLoadingMyBookings(false);
      }
    };

    fetchMyListings();
    fetchMyBookings();
  }, [user, refreshTrigger]); // Re-fetch when user changes or refreshTrigger is updated

  const handleApproveBooking = (bookingId: string) => {
    console.log('Approving booking:', bookingId);
  };

  const handleDeclineBooking = (bookingId: string) => {
    console.log('Declining booking:', bookingId);
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }
    try {
      await api.delete(`/listings/${listingId}`);
      toast.success('Listing deleted successfully!');
      // Trigger a refresh of listings in the dashboard
      // This will be handled by the refreshTrigger prop from App.tsx
      // For now, manually re-fetch or rely on parent component to update refreshTrigger
      // For simplicity, I'll just re-fetch here.
      const { data } = await api.get('/listings/my');
      setMyListings(data);
    } catch (error: any) {
      console.error('Error deleting listing:', error.response?.data || error.message);
      toast.error(error.response?.data?.msg || 'Failed to delete listing.');
    }
  };

  const stats = {
    totalListings: myListings.length, // Use dynamic data
    activeBookings: myBookings.filter(b => b.status === 'confirmed').length,
    totalEarnings: myBookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + b.totalPrice, 0),
    avgRating: 4.7, // This would ideally be dynamic
    totalViews: myListings.reduce((sum, listing) => sum + (listing.views || 0), 0), // Use dynamic data, with fallback
    pendingRequests: myBookings.filter(b => b.status === 'pending').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Enhanced Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => onNavigate('home')}
              className="hover:bg-green-50 hover:text-green-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-green-600" />
              <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Avatar className="h-9 w-9 ring-2 ring-green-100">
              <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="text-right">
              <div className="font-semibold">{user.name}</div>
              {/* <div className="text-sm text-muted-foreground">{user.location.village}, {user.location.district}</div> */}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8 h-12 bg-gray-100 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
            <TabsTrigger value="listings" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">My Listings</TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Bookings</TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-blue-700">Total Listings</CardTitle>
                  <Package className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900">{stats.totalListings}</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-green-700">Active Bookings</CardTitle>
                  <Calendar className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-900">{myBookings.filter(b => b.status === 'confirmed').length}</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-xl transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-emerald-700">Total Earnings</CardTitle>
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-900">₹{myBookings
                    .filter(b => b.status === 'completed')
                    .reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100 hover:shadow-xl transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-indigo-700">Pending Requests</CardTitle>
                  <Clock className="h-5 w-5 text-indigo-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-indigo-900">{myBookings.filter(b => b.status === 'pending').length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span>Recent Activity</span>
                  </CardTitle>
                  <CardDescription>Your latest updates and notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === 'booking_request' ? 'bg-blue-500' :
                          activity.type === 'review' ? 'bg-yellow-500' :
                          activity.type === 'message' ? 'bg-green-500' :
                          'bg-emerald-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Get things done faster</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => onNavigate('listing')}
                    className="w-full justify-start h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    <Plus className="h-4 w-4 mr-3" />
                    Add New Listing
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('chat')}
                    className="w-full justify-start h-12 border-2 hover:bg-blue-50 hover:border-blue-200"
                  >
                    <MessageCircle className="h-4 w-4 mr-3" />
                    Check Messages
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('search')}
                    className="w-full justify-start h-12 border-2 hover:bg-purple-50 hover:border-purple-200"
                  >
                    <Package className="h-4 w-4 mr-3" />
                    Browse Equipment
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Bookings</h2>
              <p className="text-muted-foreground">Manage your rental requests and bookings</p>
            </div>

            <div className="space-y-4">
              {isLoadingMyBookings ? (
                <p>Loading your bookings...</p>
              ) : myBookings.length === 0 ? (
                <p>You have no bookings yet.</p>
              ) : (
                myBookings.map((booking: any) => (
                  <Card key={booking._id} className="shadow-lg border-0 hover:shadow-xl transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12 ring-2 ring-gray-100">
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                              {booking.renter.name ? booking.renter.name.charAt(0) : 'N/A'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{booking.listing.title}</h3>
                            <p className="text-muted-foreground">
                              Rented by {booking.renter.name ? booking.renter.name : 'N/A'}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">₹{booking.totalPrice.toLocaleString()}</p>
                            <Badge variant={
                              booking.status === 'confirmed' ? 'default' :
                                booking.status === 'pending' ? 'secondary' :
                                  booking.status === 'completed' ? 'outline' : 'destructive'
                            } className="shadow-sm">
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your account details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <Avatar className="h-20 w-20 ring-4 ring-green-100">
                    <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-2xl font-bold">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                    {/* <div className="flex items-center space-x-2 mt-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {user.location.village}, {user.location.district}
                      </span>
                    </div> */}
                  </div>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Photo
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Full Name</label>
                      <p className="text-muted-foreground mt-1">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Email Address</label>
                      <p className="text-muted-foreground mt-1">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {/* <div>
                      <label className="text-sm font-semibold text-gray-700">District</label>
                      <p className="text-muted-foreground mt-1">{user.location.district}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Village</label>
                      <p className="text-muted-foreground mt-1">{user.location.village}</p>
                    </div> */}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
