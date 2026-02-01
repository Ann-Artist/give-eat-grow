import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Clock, Package, Navigation as NavigationIcon, ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase, type Donation } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

// Extended donation type with profile info
type DonationWithProfile = Donation & { profiles?: { full_name: string } | null };

const BrowseNew = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [donations, setDonations] = useState<DonationWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [foodTypeFilter, setFoodTypeFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [distanceFilter, setDistanceFilter] = useState("all");

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*, profiles!donations_donor_id_fkey(full_name)')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Filter out expired donations client-side
      const now = new Date();
      const validDonations = (data || []).filter((donation) => {
        const createdAt = new Date(donation.created_at);
        const expiryTime = new Date(createdAt.getTime() + donation.expiry_hours * 60 * 60 * 1000);
        return expiryTime > now;
      }) as DonationWithProfile[];
      setDonations(validDonations);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error fetching donations:', error);
      toast({
        title: "Error",
        description: "Failed to load donations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (donationId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to accept donations",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error("Profile not found");

      const { error } = await supabase
        .from('donations')
        .update({ 
          status: 'accepted',
          accepted_by: profile.id 
        })
        .eq('id', donationId);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Donation accepted successfully",
      });
      
      fetchDonations();
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error accepting donation:', error);
      toast({
        title: "Error",
        description: "Failed to accept donation",
        variant: "destructive",
      });
    }
  };

  const openGoogleMaps = (donation: DonationWithProfile) => {
    let url: string;
    if (donation.latitude && donation.longitude) {
      // Use exact coordinates if available
      url = `https://www.google.com/maps/search/?api=1&query=${donation.latitude},${donation.longitude}`;
    } else {
      // Fall back to location name search
      const encodedLocation = encodeURIComponent(`${donation.location}, Pune, India`);
      url = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
    }
    window.open(url, '_blank');
  };

  const getTimeSince = (timestamp: string) => {
    const now = new Date();
    const created = new Date(timestamp);
    const hours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours === 1) return "1 hour ago";
    return `${hours} hours ago`;
  };

  const filteredDonations = donations.filter((donation) => {
    // Search filter
    if (searchQuery && !donation.location.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !donation.food_type.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Food type filter
    if (foodTypeFilter !== "all" && donation.food_type !== foodTypeFilter) {
      return false;
    }

    // Urgency filter
    if (urgencyFilter === "urgent" && !donation.urgent) {
      return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <p className="text-lg">Loading donations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Browse Donations in Pune</h1>
          <p className="text-muted-foreground text-lg">Find and accept food donations across Pune and PCMC</p>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-card border-0">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search donations..."
                  className="pl-10 h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={foodTypeFilter} onValueChange={setFoodTypeFilter}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Food Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Prepared Meals">Prepared Meals</SelectItem>
                  <SelectItem value="Vegetables & Fruits">Vegetables & Fruits</SelectItem>
                  <SelectItem value="Bread & Pastries">Bread & Pastries</SelectItem>
                  <SelectItem value="Dairy Products">Dairy Products</SelectItem>
                  <SelectItem value="Canteen Food">Canteen Food</SelectItem>
                </SelectContent>
              </Select>

              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="urgent">Urgent Only</SelectItem>
                </SelectContent>
              </Select>

              <Select value={distanceFilter} onValueChange={setDistanceFilter}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Distance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Anywhere in Pune</SelectItem>
                  <SelectItem value="1">Within 1 km</SelectItem>
                  <SelectItem value="5">Within 5 km</SelectItem>
                  <SelectItem value="10">Within 10 km</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Donations List */}
        <div className="space-y-4">
          {filteredDonations.map((donation) => (
            <Card 
              key={donation.id}
              className="shadow-card border-0 hover:shadow-soft transition-all duration-300"
            >
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image */}
                  {donation.photo_url && (
                    <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={donation.photo_url} 
                        alt={donation.food_type}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Left: Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">
                          {donation.profiles?.full_name || 'Anonymous Donor'}
                        </h3>
                        <p className="text-muted-foreground">{donation.food_type}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {donation.location}
                        </p>
                      </div>
                      {donation.urgent && (
                        <Badge className="bg-destructive text-destructive-foreground">
                          Urgent
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Quantity</p>
                          <p className="font-semibold">{donation.quantity}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Servings</p>
                          <p className="font-semibold">{donation.servings || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Expires In</p>
                          <p className="font-semibold">{donation.expiry_hours}h</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Posted</p>
                          <p className="font-semibold">{getTimeSince(donation.created_at)}</p>
                        </div>
                      </div>
                    </div>

                    {donation.description && (
                      <p className="text-sm text-muted-foreground">{donation.description}</p>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex md:flex-col gap-3 md:min-w-[140px]">
                    <Button 
                      className="flex-1 shadow-soft"
                      onClick={() => handleAccept(donation.id)}
                    >
                      Accept Donation
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => openGoogleMaps(donation)}
                    >
                      <NavigationIcon className="w-4 h-4 mr-2" />
                      Navigate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredDonations.length === 0 && (
          <Card className="shadow-card border-0 text-center py-12">
            <CardContent>
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No donations found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or check back later
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BrowseNew;
