import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { ArrowLeft, Upload, X, Calendar, Edit, Trash2 } from 'lucide-react';
import api from '../../api';
import { toast } from 'sonner';


type User = {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'renter' | 'admin';
};

// Define Listing type for frontend
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
};

interface ListingPageProps {
  user?: User | null;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onListingCreated: () => void;
  listingId?: string;
}

const categories = [
  { value: 'machine', label: 'Machines', subcategories: ['Tractor', 'Harvester', 'Cultivator', 'Thresher', 'Seeder'] },
  { value: 'tool', label: 'Tools', subcategories: ['Rotary Tiller', 'Disc Harrow', 'Plough', 'Sprayer', 'Irrigation Equipment'] },
  { value: 'land', label: 'Land', subcategories: ['Crop Land', 'Orchard', 'Warehouse', 'Storage', 'Processing Unit'] }
];

const priceUnits = [
  { value: 'per_hour', label: 'Per Hour' },
  { value: 'per_day', label: 'Per Day' },
];

const initialFormData = {
  title: '',
  description: '',
  category: '',
  subcategory: '',
  price: '',
  priceUnit: 'per_day',
  district: '',
  village: '',
  files: null as FileList | null, // For new image uploads
  existingImages: [] as { url: string; publicId: string; }[], // For existing images in edit mode
};

export function ListingPage({ user, onNavigate, onListingCreated, listingId }: ListingPageProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [currentListingId, setCurrentListingId] = useState<string | null>(null);
  const [currentListingDetails, setCurrentListingDetails] = useState<Listing | null>(null); // New state for viewing a single listing

  // Fetch user's listings
  useEffect(() => {
    const fetchUserListings = async () => {
      if (!user) {
        setIsLoadingListings(false);
        return;
      }
      try {
        const { data } = await api.get('/api/listings/my');
        setUserListings(data);
      } catch (error) {
        console.error('Error fetching user listings:', error);
        toast.error('Failed to load your listings.');
      } finally {
        setIsLoadingListings(false);
      }
    };
    fetchUserListings();
  }, [user, onListingCreated]);

  // Handle initial load for editing a specific listing
  useEffect(() => {
    if (listingId && userListings.length > 0) {
      const listingToEdit = userListings.find(l => l._id === listingId);
      if (listingToEdit) {
        setFormData({
          title: listingToEdit.title,
          description: listingToEdit.description,
          category: listingToEdit.category,
          subcategory: '',
          price: listingToEdit.price.toString(),
          priceUnit: listingToEdit.priceType,
          district: listingToEdit.location?.district || '',
          village: listingToEdit.location?.village || '',
          files: null,
          existingImages: listingToEdit.images,
        });
        setEditMode(true);
        setCurrentListingId(listingToEdit._id);
      } else {
        toast.error('Listing not found for editing.');
        setEditMode(false);
        setCurrentListingId(null);
      }
    } else {
      setEditMode(false);
      setCurrentListingId(null);
      setFormData(initialFormData);
    }
  }, [listingId, userListings]);

  // Fetch single listing details when in view mode (not edit mode)
  useEffect(() => {
    const fetchListingDetails = async () => {
      if (listingId && !editMode) {
        try {
          const { data } = await api.get(`/api/listings/${listingId}`);
          setCurrentListingDetails(data);
        } catch (error) {
          console.error('Error fetching listing details:', error);
          toast.error('Failed to load listing details.');
        }
      } else {
        setCurrentListingDetails(null);
      }
    };
    fetchListingDetails();
  }, [listingId, editMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("description", formData.description);
      fd.append("category", formData.category);
      fd.append("price", parseFloat(formData.price).toString());
      fd.append("priceType", formData.priceUnit);
      fd.append("location", JSON.stringify({ district: formData.district, village: formData.village }));
      // Assuming availability is not part of this form for now, or needs to be added
      fd.append("availability", JSON.stringify({ startDate: null, endDate: null })); // Placeholder

      // Append existing images' data
      formData.existingImages.forEach((img, index) => {
        fd.append(`existingImages[${index}].url`, img.url);
        fd.append(`existingImages[${index}].publicId`, img.publicId);
      });

      if (formData.files) {
        Array.from(formData.files).forEach(f => fd.append("newImages", f)); // Use a different field name for new images
      }
 
       let res;
       if (editMode && currentListingId) {
         res = await api.put(`/api/listings/${currentListingId}`, fd);
         toast.success('Listing updated successfully!');
       } else {
         res = await api.post('/api/listings', fd);
         toast.success('Listing created successfully!');
       }
       
       console.log('Listing operation successful:', res.data);
       onListingCreated();
       setFormData(initialFormData);
       setEditMode(false);
       setCurrentListingId(null);
     } catch (err: any) {
       console.error('Error creating/updating listing:', err.response?.data || err.message);
       toast.error(err.response?.data?.message || 'Failed to save listing. Please try again.');
     } finally {
       setIsSubmitting(false);
     }
   };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'category' ? { subcategory: '' } : {})
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      files: e.target.files,
    }));
  };

  const removeImage = (publicId: string) => {
    setFormData(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter(img => img.publicId !== publicId)
    }));
  };

  const handleEditListing = (listing: Listing) => {
    setFormData({
      title: listing.title,
      description: listing.description,
      category: listing.category,
      subcategory: '',
      price: listing.price.toString(),
      priceUnit: listing.priceType,
      district: listing.location?.district || '',
      village: listing.location?.village || '',
      files: null,
      existingImages: listing.images,
    });
    setEditMode(true);
    setCurrentListingId(listing._id);
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }
    try {
      await api.delete(`/api/listings/${listingId}`);
      toast.success('Listing deleted successfully!');
      onListingCreated();
    } catch (error: any) {
      console.error('Error deleting listing:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to delete listing.');
    }
  };

  const selectedCategory = categories.find(cat => cat.value === formData.category);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => onNavigate('dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>{editMode ? 'Edit Listing' : 'Create New Listing'}</CardTitle>
            <CardDescription>
              {editMode ? 'Modify your existing farm equipment, tools, or land listing' : 'List your farm equipment, tools, or land for other farmers to rent'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {listingId && !editMode && currentListingDetails ? (
              <div className="space-y-6">
                {/* Listing Details Display */}
                <h3 className="text-lg font-medium">Listing Details</h3>
                <p><strong>Title:</strong> {currentListingDetails.title}</p>
                <p><strong>Description:</strong> {currentListingDetails.description}</p>
                <p><strong>Category:</strong> {currentListingDetails.category}</p>
                <p><strong>Price:</strong> ₹{currentListingDetails.price} / {currentListingDetails.priceType}</p>
                <p><strong>Location:</strong> {currentListingDetails.location.village}, {currentListingDetails.location.district}</p>

                {/* Image Gallery */}
                {currentListingDetails.images.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Image Gallery</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {currentListingDetails.images.map((image) => (
                        <div key={image.publicId} className="relative">
                          <img
                            src={image.url}
                            alt={currentListingDetails.title}
                            className="w-full h-48 object-cover rounded-lg shadow-md"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onNavigate('dashboard')}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleEditListing(currentListingDetails)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Listing
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., John Deere 5310 Tractor"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your equipment, its condition, and any special features..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subcategory">Type *</Label>
                      <Select
                        value={formData.subcategory}
                        onValueChange={(value) => handleInputChange('subcategory', value)}
                        disabled={!formData.category}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedCategory?.subcategories.map((sub) => (
                            <SelectItem key={sub} value={sub}>
                              {sub}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Pricing</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (₹) *</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="1500"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priceUnit">Per *</Label>
                      <Select value={formData.priceUnit} onValueChange={(value) => handleInputChange('priceUnit', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {priceUnits.map((unit) => (
                            <SelectItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Location</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="district">District</Label>
                      <Input
                        id="district"
                        value={formData.district}
                        onChange={(e) => handleInputChange('district', e.target.value)}
                        placeholder="District"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="village">Village</Label>
                      <Input
                        id="village"
                        value={formData.village}
                        onChange={(e) => handleInputChange('village', e.target.value)}
                        placeholder="Village"
                      />
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Images</h3>
                  
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload images (max 5)
                        </p>
                      </label>
                    </div>

                    {/* Display existing images */}
                    {formData.existingImages.length > 0 && (
                      <div className="grid grid-cols-3 gap-4">
                        {formData.existingImages.map((image, index) => (
                          <div key={image.publicId} className="relative">
                            <img
                              src={image.url}
                              alt={`Listing image ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6"
                              onClick={() => removeImage(image.publicId)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Display newly selected files */}
                    {formData.files && Array.from(formData.files).length > 0 && (
                      <div className="grid grid-cols-3 gap-4">
                        {Array.from(formData.files).map((file, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`New upload ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="secondary"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6"
                              onClick={() => {
                                // This is a simplified removal for display.
                                // Actual removal from formData.files would require more complex state management
                                // or re-selecting files. For now, it just removes the preview.
                                const newFiles = new DataTransfer();
                                Array.from(formData.files!).filter((_, i) => i !== index).forEach(f => newFiles.items.add(f));
                                setFormData(prev => ({ ...prev, files: newFiles.files }));
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditMode(false);
                      setCurrentListingId(null);
                      setFormData(initialFormData);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (editMode ? 'Updating...' : 'Creating...') : (editMode ? 'Update Listing' : 'Create Listing')}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* User's Listings Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Listings</h2>
          {isLoadingListings ? (
            <p>Loading your listings...</p>
          ) : userListings.length === 0 ? (
            <p>You have no listings yet. Create one above!</p>
          ) : (
            <div className="space-y-4">
              {userListings.map((listing) => (
                <Card key={listing._id} className="flex items-center p-4">
                  <img
                    src={listing.images[0]?.url || 'https://placehold.co/100x100'}
                    alt={listing.title}
                    className="w-24 h-24 object-cover rounded-md mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{listing.title}</h3>
                    <p className="text-sm text-muted-foreground">{listing.category} - {listing.price} {listing.priceType}</p>
                    <p className="text-xs text-muted-foreground">Listed on: {new Date(listing.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleEditListing(listing)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteListing(listing._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
