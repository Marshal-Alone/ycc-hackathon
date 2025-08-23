import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Calendar,
  Tractor,
  Wrench,
  Leaf,
  SlidersHorizontal,
  Grid3X3,
  List,
  Heart,
  Eye,
} from 'lucide-react';
import API from '../../api';

type Listing = {
  _id: string;
  title: string;
  category: 'machine' | 'tool' | 'land';
  price: number;
  priceType: 'per_day' | 'per_hour';
  location: { district: string; village: string };
  owner: { name: string };
  images: { url: string }[];
  availability: {
    startDate?: string;
    endDate?: string;
  };
};

type User = {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'renter' | 'admin';
};

interface SearchResultsProps {
  user: User;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const categoryIcons = {
  machine: Tractor,
  tool: Wrench,
  land: Leaf,
};

const categoryColors = {
  machine: 'bg-red-50 text-red-700 border-red-200',
  tool: 'bg-amber-50 text-amber-700 border-amber-200',
  land: 'bg-green-50 text-green-700 border-green-200',
};

export function SearchResults({ user, onNavigate }: SearchResultsProps) {
  const location = useLocation();
  const [results, setResults] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    priceRange: [0, 5000],
    availability: 'all',
    district: '',
    verified: false,
    sortBy: 'relevance'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    setQuery(q);
    fetchResults(q, filters);
  }, [location.search, filters]);

  const fetchResults = async (searchQuery: string, filters: any) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim() !== '') {
        params.append('q', searchQuery);
      }
      if (filters.category && filters.category !== '') {
        params.append('category', filters.category);
      }
      if (filters.district && filters.district !== '') {
        params.append('district', filters.district);
      }
      // Assuming village filter might be added later, currently not in frontend state
      // if (filters.village && filters.village !== '') {
      //   params.append('village', filters.village);
      // }
      if (filters.priceRange[0] > 0) { // Only append if min price is greater than 0
        params.append('price_min', filters.priceRange[0].toString());
      }
      if (filters.priceRange[1] < 5000) { // Only append if max price is less than max possible
        params.append('price_max', filters.priceRange[1].toString());
      }
      if (filters.availability && filters.availability !== 'all') {
        params.append('availability', filters.availability);
      }

      console.log("Frontend Search Request Params:", params.toString());
      const response = await API.get(`/listings/search?${params.toString()}`);
      console.log("Frontend Search Results Received:", response.data);
      setResults(response.data);
    } catch (err: any) {
      // Axios errors have a different structure
      if (err.response) {
        setError(err.response.data.message || 'Failed to fetch search results');
      } else if (err.request) {
        setError('No response received from server');
      } else {
        setError(err.message);
      }
      setError(err.message);
      console.error("Frontend Search Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults(query, filters);
    // Update URL
    onNavigate(`search?q=${query}`);
  };

  const sortedResults = [...results].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Enhanced Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4 mb-4">
            <Button 
              variant="ghost" 
              onClick={() => onNavigate('home')}
              className="hover:bg-green-50 hover:text-green-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <form onSubmit={handleSearch} className="flex-1 flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for equipment, tools, land..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 h-11 border-2 border-gray-200 focus:border-green-400 transition-colors"
                />
              </div>
              <Button 
                type="submit"
                className="h-11 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>

            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 h-11 border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
              {Object.values(filters).some(v => v && v !== 'all' && v !== 'relevance' && !Array.isArray(v)) && (
                <Badge variant="destructive" className="h-2 w-2 p-0 rounded-full" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Enhanced Filters Sidebar */}
          {showFilters && (
            <div className="w-80 space-y-6">
              <Card className="shadow-lg border-0 bg-white">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Filters</h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setFilters({
                        category: '',
                        subcategory: '',
                        priceRange: [0, 5000],
                        availability: 'all',
                        district: '',
                        verified: false,
                        sortBy: 'relevance'
                      })}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Clear All
                    </Button>
                  </div>

                  {/* Category Filter */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Category</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {Object.entries(categoryIcons).map(([key, Icon]) => (
                        <button
                          key={key}
                          onClick={() => setFilters(prev => ({ ...prev, category: prev.category === key ? '' : key }))}
                          className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                            filters.category === key 
                              ? categoryColors[key as keyof typeof categoryColors]
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="font-medium capitalize">{key}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Price Range (₹)</Label>
                    <div className="px-2">
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
                        max={5000}
                        step={100}
                        className="py-4"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-2">
                        <span>₹{filters.priceRange[0]}</span>
                        <span>₹{filters.priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Availability</Label>
                    <Select 
                      value={filters.availability} 
                      onValueChange={(value) => setFilters(prev => ({ ...prev, availability: value }))}
                    >
                      <SelectTrigger className="border-2 border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All listings</SelectItem>
                        <SelectItem value="available">Available only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* District Filter */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">District</Label>
                    <Select 
                      value={filters.district} 
                      onValueChange={(value) => setFilters(prev => ({ ...prev, district: value }))}
                    >
                      <SelectTrigger className="border-2 border-gray-200">
                        <SelectValue placeholder="All districts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All districts</SelectItem>
                        <SelectItem value="Pune">Pune</SelectItem>
                        <SelectItem value="Mumbai">Mumbai</SelectItem>
                        <SelectItem value="Nashik">Nashik</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Verified Only */}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results */}
          <div className="flex-1 space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Search Results</h2>
                <p className="text-muted-foreground">
                  {sortedResults.length} result{sortedResults.length !== 1 ? 's' : ''} found
                  {query && ` for "${query}"`}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 border-2 border-gray-200 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 w-8 p-0"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                <Select 
                  value={filters.sortBy} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
                >
                  <SelectTrigger className="w-48 border-2 border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Sort by Relevance</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedResults.map((item) => {
                  const CategoryIcon = categoryIcons[item.category as keyof typeof categoryIcons];
                  return (
                    <Card key={item._id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg group">
                      <div className="aspect-video bg-muted overflow-hidden relative">
                        <img 
                          src={item.images[0]?.url} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 flex space-x-2">
                          <Badge className={`border-0 shadow-lg ${categoryColors[item.category]}`}>
                            <CategoryIcon className="h-3 w-3 mr-1" />
                            {item.category}
                          </Badge>
                        </div>
                        <div className="absolute top-3 right-3">
                          <Badge variant={item.availability?.startDate ? 'default' : 'secondary'} className="shadow-lg">
                            {item.availability?.startDate ? 'Available' : 'Booked'}
                          </Badge>
                        </div>
                        <div className="absolute bottom-3 left-3 flex space-x-2">
                          <Button size="sm" variant="outline" className="bg-white/90 backdrop-blur-sm h-8 w-8 p-0">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="bg-white/90 backdrop-blur-sm h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3" />
                              <span>{item.location.village}, {item.location.district}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-2xl font-bold text-green-600">₹{item.price}</span>
                              <span className="text-sm text-muted-foreground">/{item.priceType.replace('_', ' ')}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2 border-t">
                            <span className="text-sm text-muted-foreground">by {item.owner.name}</span>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="hover:bg-blue-50">
                                <Calendar className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                                disabled={!item.availability?.startDate}
                              >
                                {item.availability?.startDate ? 'Book' : 'View'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedResults.map((item) => {
                  const CategoryIcon = categoryIcons[item.category];
                  return (
                    <Card key={item._id} className="overflow-hidden hover:shadow-lg transition-all duration-200 border-0 shadow-md">
                      <CardContent className="p-6">
                        <div className="flex space-x-6">
                          <div className="w-48 h-32 bg-muted overflow-hidden rounded-lg flex-shrink-0 relative">
                            <img 
                              src={item.images[0]?.url} 
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-xl font-semibold">{item.title}</h3>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                                  <Badge className={`${categoryColors[item.category]} text-xs`}>
                                    <CategoryIcon className="h-3 w-3 mr-1" />
                                    {item.category}
                                  </Badge>
                                  <MapPin className="h-3 w-3" />
                                  <span>{item.location.village}, {item.location.district}</span>
                                </div>
                              </div>
                              <Badge variant={item.availability?.startDate ? 'default' : 'secondary'}>
                                {item.availability?.startDate ? 'Available' : 'Booked'}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div>
                                  <span className="text-2xl font-bold text-green-600">₹{item.price}</span>
                                  <span className="text-sm text-muted-foreground">/{item.priceType.replace('_', ' ')}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <span className="text-sm text-muted-foreground">by {item.owner.name}</span>
                                <div className="flex space-x-2">
                                  <Button size="sm" variant="outline">
                                    <Heart className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Calendar className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                                    disabled={!item.availability?.startDate}
                                  >
                                    {item.availability?.startDate ? 'Book Now' : 'View Details'}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {sortedResults.length === 0 && (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <Search className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold mb-4">No results found</h3>
                  <p className="text-muted-foreground mb-6">
                    We couldn't find any equipment matching your search criteria. Try adjusting your filters or search terms.
                  </p>
                  <div className="flex space-x-3 justify-center">
                    <Button 
                      variant="outline"
                      onClick={() => setFilters({
                        category: '',
                        subcategory: '',
                        priceRange: [0, 5000],
                        availability: 'all',
                        district: '',
                        verified: false,
                        sortBy: 'relevance'
                      })}
                    >
                      Clear Filters
                    </Button>
                    <Button onClick={() => onNavigate('home')}>
                      Browse All Equipment
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
