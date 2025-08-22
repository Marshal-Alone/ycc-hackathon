import React, { useState } from 'react';
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
  Eye
} from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'renter' | 'admin';
};

interface SearchResultsProps {
  user: User;
  searchQuery: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const mockResults = [
  {
    id: '1',
    title: 'John Deere 5310 Tractor',
    category: 'machines',
    subcategory: 'Tractor',
    price: 1500,
    priceUnit: 'day',
    location: { district: 'Pune', village: 'Baramati' },
    rating: 4.8,
    reviews: 23,
    owner: 'Suresh Patil',
    image: 'https://images.unsplash.com/photo-1558618644-fcd25c85cd64?w=400&h=300&fit=crop',
    availability: 'Available',
    distance: '5 km away',
    verified: true,
    featured: true
  },
  {
    id: '2',
    title: 'Rotary Tiller - 7ft',
    category: 'tools',
    subcategory: 'Rotary Tiller',
    price: 800,
    priceUnit: 'day',
    location: { district: 'Pune', village: 'Shirur' },
    rating: 4.6,
    reviews: 15,
    owner: 'Amit Sharma',
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&h=300&fit=crop',
    availability: 'Available',
    distance: '12 km away',
    verified: true
  },
  {
    id: '3',
    title: 'Combine Harvester',
    category: 'machines',
    subcategory: 'Harvester',
    price: 3000,
    priceUnit: 'day',
    location: { district: 'Pune', village: 'Baramati' },
    rating: 4.7,
    reviews: 31,
    owner: 'Pradeep Singh',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop',
    availability: 'Booked',
    distance: '3 km away',
    verified: true
  },
  {
    id: '4',
    title: '5 Acre Farmland',
    category: 'land',
    subcategory: 'Crop Land',
    price: 2000,
    priceUnit: 'month',
    location: { district: 'Pune', village: 'Indapur' },
    rating: 4.9,
    reviews: 8,
    owner: 'Rajesh Kale',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
    availability: 'Available',
    distance: '18 km away',
    verified: false
  },
  {
    id: '5',
    title: 'Disc Harrow Set',
    category: 'tools',
    subcategory: 'Disc Harrow',
    price: 600,
    priceUnit: 'day',
    location: { district: 'Pune', village: 'Baramati' },
    rating: 4.5,
    reviews: 12,
    owner: 'Vikram Joshi',
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&h=300&fit=crop',
    availability: 'Available',
    distance: '7 km away',
    verified: true
  }
];

const categoryIcons = {
  machines: Tractor,
  tools: Wrench,
  land: Leaf
};

const categoryColors = {
  machines: 'bg-red-50 text-red-700 border-red-200',
  tools: 'bg-amber-50 text-amber-700 border-amber-200',
  land: 'bg-green-50 text-green-700 border-green-200'
};

export function SearchResults({ user, searchQuery, onNavigate }: SearchResultsProps) {
  const [query, setQuery] = useState(searchQuery);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', query, filters);
  };

  const filteredResults = mockResults.filter(item => {
    if (filters.category && item.category !== filters.category) return false;
    if (filters.subcategory && item.subcategory !== filters.subcategory) return false;
    if (item.price < filters.priceRange[0] || item.price > filters.priceRange[1]) return false;
    if (filters.availability === 'available' && item.availability !== 'Available') return false;
    if (filters.district && item.location.district !== filters.district) return false;
    if (filters.verified && !item.verified) return false;
    return true;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'distance':
        return parseFloat(a.distance) - parseFloat(b.distance);
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
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="verified"
                      checked={filters.verified}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, verified: !!checked }))}
                    />
                    <Label htmlFor="verified" className="text-sm font-medium cursor-pointer">
                      Verified owners only
                    </Label>
                  </div>
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
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="distance">Nearest First</SelectItem>
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
                    <Card key={item.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg group">
                      <div className="aspect-video bg-muted overflow-hidden relative">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 flex space-x-2">
                          <Badge className={`border-0 shadow-lg ${categoryColors[item.category as keyof typeof categoryColors]}`}>
                            <CategoryIcon className="h-3 w-3 mr-1" />
                            {item.category}
                          </Badge>
                          {item.featured && (
                            <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-lg">
                              ⭐ Featured
                            </Badge>
                          )}
                        </div>
                        <div className="absolute top-3 right-3">
                          <Badge variant={item.availability === 'Available' ? 'default' : 'secondary'} className="shadow-lg">
                            {item.availability}
                          </Badge>
                        </div>
                        {item.verified && (
                          <div className="absolute bottom-3 right-3">
                            <Badge variant="outline" className="bg-white/90 backdrop-blur-sm text-green-600 border-green-200">
                              ✓ Verified
                            </Badge>
                          </div>
                        )}
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
                              <span>•</span>
                              <span>{item.distance}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-2xl font-bold text-green-600">₹{item.price}</span>
                              <span className="text-sm text-muted-foreground">/{item.priceUnit}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{item.rating}</span>
                              <span className="text-sm text-muted-foreground">({item.reviews})</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2 border-t">
                            <span className="text-sm text-muted-foreground">by {item.owner}</span>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="hover:bg-blue-50">
                                <Calendar className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                                disabled={item.availability !== 'Available'}
                              >
                                {item.availability === 'Available' ? 'Book' : 'View'}
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
                  const CategoryIcon = categoryIcons[item.category as keyof typeof categoryIcons];
                  return (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 border-0 shadow-md">
                      <CardContent className="p-6">
                        <div className="flex space-x-6">
                          <div className="w-48 h-32 bg-muted overflow-hidden rounded-lg flex-shrink-0 relative">
                            <img 
                              src={item.image} 
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                            {item.featured && (
                              <Badge className="absolute top-2 left-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 text-xs">
                                ⭐ Featured
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-xl font-semibold">{item.title}</h3>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                                  <Badge className={`${categoryColors[item.category as keyof typeof categoryColors]} text-xs`}>
                                    <CategoryIcon className="h-3 w-3 mr-1" />
                                    {item.category}
                                  </Badge>
                                  <MapPin className="h-3 w-3" />
                                  <span>{item.location.village}, {item.location.district}</span>
                                  <span>•</span>
                                  <span>{item.distance}</span>
                                </div>
                              </div>
                              <Badge variant={item.availability === 'Available' ? 'default' : 'secondary'}>
                                {item.availability}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div>
                                  <span className="text-2xl font-bold text-green-600">₹{item.price}</span>
                                  <span className="text-sm text-muted-foreground">/{item.priceUnit}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="font-medium">{item.rating}</span>
                                  <span className="text-sm text-muted-foreground">({item.reviews} reviews)</span>
                                </div>
                                {item.verified && (
                                  <Badge variant="outline" className="text-green-600 border-green-200">
                                    ✓ Verified
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <span className="text-sm text-muted-foreground">by {item.owner}</span>
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
                                    disabled={item.availability !== 'Available'}
                                  >
                                    {item.availability === 'Available' ? 'Book Now' : 'View Details'}
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
