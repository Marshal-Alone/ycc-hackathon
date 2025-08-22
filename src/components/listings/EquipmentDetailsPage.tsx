import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '../ui/utils'; // Corrected import path

interface Equipment {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  priceType: string;
  location: {
    village: string;
    district: string;
  };
  images: { url: string }[];
  availability: {
    startDate: string;
    endDate: string;
  };
}

const EquipmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    name: '',
    quantity: 1,
    email: '',
    deliveryLocation: '',
    contactDetails: '',
  });
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Recalculate total price whenever bookingDetails changes
    setTotalPrice(calculateTotalPrice());
  }, [bookingDetails]);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await api.get(`/listings/${id}`);
        setEquipment(response.data);
      } catch (err: any) {
        setError(err.response?.data?.msg || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [id]);

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setBookingDetails(prev => ({ ...prev, quantity: isNaN(value) ? 1 : value }));
  };

  const calculateTotalPrice = () => {
    if (!bookingDetails.startDate || !bookingDetails.endDate || !equipment) {
      return 0;
    }
    const start = bookingDetails.startDate.getTime();
    const end = bookingDetails.endDate.getTime();
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (equipment.priceType === 'day') {
      return diffDays * equipment.price * bookingDetails.quantity;
    } else if (equipment.priceType === 'hour') {
      // Assuming a day has 8 working hours for simplicity, or you can add an input for hours
      return diffDays * 8 * equipment.price * bookingDetails.quantity;
    }
    return 0;
  };

  const handleBookNow = async () => {
    if (!equipment || !bookingDetails.startDate || !bookingDetails.endDate || !bookingDetails.name || !bookingDetails.email || !bookingDetails.deliveryLocation || !bookingDetails.contactDetails) {
      setBookingError('Please fill all required fields and select dates.');
      return;
    }

    if (bookingDetails.startDate > bookingDetails.endDate) {
      setBookingError('Start date cannot be after end date.');
      return;
    }

    setBookingError(null);
    setBookingSuccess(null);

    try {
      const totalPrice = calculateTotalPrice();
      await api.post('/bookings', {
        listingId: equipment._id,
        startDate: bookingDetails.startDate.toISOString(),
        endDate: bookingDetails.endDate.toISOString(),
        totalPrice,
        name: bookingDetails.name,
        quantity: bookingDetails.quantity,
        email: bookingDetails.email,
        deliveryLocation: bookingDetails.deliveryLocation,
        contactDetails: bookingDetails.contactDetails,
      });
      setBookingSuccess('Booking successful!');
      setShowBookingModal(false);
      // Optionally refresh equipment data to show updated availability
      const response = await api.get(`/listings/${id}`);
      setEquipment(response.data);
    } catch (err: any) {
      setBookingError(err.response?.data?.msg || 'Booking failed. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!equipment) {
    return <div>Equipment not found</div>;
  }

  const isBooked = equipment.availability?.endDate && new Date(equipment.availability.endDate) < new Date();

  return (
    <div className="container mx-auto p-4">
      <Button onClick={() => navigate(-1)} className="mb-4">Back</Button>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div>
            {equipment.images && equipment.images.length > 0 && (
              <img src={equipment.images[0].url} alt={equipment.title} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">{equipment.title}</h1>
            <p className="text-gray-600 mb-4">{equipment.description}</p>
            <div className="mb-4">
              <span className="font-semibold">Category:</span> {equipment.category}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Price:</span> ${equipment.price} per {equipment.priceType}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Location:</span> {equipment.location.village}, {equipment.location.district}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Availability:</span> {new Date(equipment.availability.startDate).toLocaleDateString()} - {new Date(equipment.availability.endDate).toLocaleDateString()}
            </div>
            <Button
              onClick={() => setShowBookingModal(true)}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white"
              disabled={!!isBooked} // Corrected type for disabled prop
            >
              {isBooked ? 'Fully Booked' : 'Book Now'}
            </Button>
            {bookingSuccess && <p className="text-green-500 mt-2">{bookingSuccess}</p>}
          </div>
        </div>
      </div>

      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Book {equipment.title}</DialogTitle>
            <DialogDescription>
              Fill in your details to book this equipment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {bookingError && <p className="text-red-500 text-sm">{bookingError}</p>}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={bookingDetails.name}
                onChange={handleBookingChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={bookingDetails.email}
                onChange={handleBookingChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={bookingDetails.quantity}
                onChange={handleQuantityChange}
                min="1"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deliveryLocation" className="text-right">
                Delivery Location
              </Label>
              <Input
                id="deliveryLocation"
                name="deliveryLocation"
                value={bookingDetails.deliveryLocation}
                onChange={handleBookingChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contactDetails" className="text-right">
                Contact Details
              </Label>
              <Input
                id="contactDetails"
                name="contactDetails"
                value={bookingDetails.contactDetails}
                onChange={handleBookingChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !bookingDetails.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {bookingDetails.startDate ? format(bookingDetails.startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={bookingDetails.startDate}
                    onSelect={(date) => setBookingDetails(prev => ({ ...prev, startDate: date || undefined }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !bookingDetails.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {bookingDetails.endDate ? format(bookingDetails.endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={bookingDetails.endDate}
                    onSelect={(date) => setBookingDetails(prev => ({ ...prev, endDate: date || undefined }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Total Price</Label>
              <span className="col-span-3 font-bold">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBookingModal(false)}>Cancel</Button>
            <Button onClick={handleBookNow}>Confirm Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EquipmentDetailsPage;
