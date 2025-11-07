import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Package, Clock, Navigation as NavigationIcon, Phone } from "lucide-react";
import { supabase, type Donation } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import NavBar from "@/components/Navigation";

const Track = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeDeliveries, setActiveDeliveries] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchActiveDeliveries();
  }, [user, navigate]);

  const fetchActiveDeliveries = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error("Profile not found");

      const { data, error } = await supabase
        .from('donations')
        .select('*, profiles!donations_donor_id_fkey(*)')
        .or(`donor_id.eq.${profile.id},accepted_by.eq.${profile.id}`)
        .in('status', ['accepted', 'completed'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActiveDeliveries((data || []) as unknown as Donation[]);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      toast({
        title: "Error",
        description: "Failed to load deliveries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteDelivery = async (donationId: string) => {
    try {
      const { error } = await supabase
        .from('donations')
        .update({ status: 'completed' })
        .eq('id', donationId);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Delivery marked as completed",
      });
      
      fetchActiveDeliveries();
    } catch (error) {
      console.error('Error completing delivery:', error);
      toast({
        title: "Error",
        description: "Failed to complete delivery",
        variant: "destructive",
      });
    }
  };

  const openGoogleMaps = (location: string) => {
    const encodedLocation = encodeURIComponent(`${location}, Pune`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <p className="text-lg">Loading deliveries...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Track Deliveries</h1>
          <p className="text-muted-foreground text-lg">Monitor your active pickups and deliveries</p>
        </div>

        {activeDeliveries.length > 0 ? (
          <div className="space-y-6">
            {activeDeliveries.map((delivery) => (
              <Card key={delivery.id} className="shadow-card border-0 overflow-hidden">
                <CardHeader className={`${delivery.status === 'completed' ? 'bg-primary/10' : 'bg-accent/20'}`}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{delivery.food_type}</CardTitle>
                    <Badge variant={delivery.status === 'completed' ? 'default' : 'secondary'}>
                      {delivery.status === 'completed' ? 'Completed' : 'In Progress'}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <MapPin className="w-4 h-4" />
                    {delivery.location}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Quantity</p>
                        <p className="font-semibold">{delivery.quantity}</p>
                        {delivery.servings && (
                          <p className="text-sm text-muted-foreground">{delivery.servings} servings</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Expires In</p>
                        <p className="font-semibold">{delivery.expiry_hours} hours</p>
                        {delivery.urgent && (
                          <Badge variant="destructive" className="mt-1">Urgent</Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Contact</p>
                        <p className="font-semibold">{delivery.profiles?.full_name || "Not available"}</p>
                        {delivery.profiles?.phone && (
                          <p className="text-sm text-muted-foreground">{delivery.profiles.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {delivery.description && (
                    <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium mb-1">Additional Notes:</p>
                      <p className="text-sm text-muted-foreground">{delivery.description}</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      className="flex-1"
                      onClick={() => openGoogleMaps(delivery.location)}
                    >
                      <NavigationIcon className="w-4 h-4 mr-2" />
                      Navigate with Google Maps
                    </Button>
                    
                    {delivery.status === 'accepted' && (
                      <Button 
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleCompleteDelivery(delivery.id)}
                      >
                        Mark as Completed
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-card border-0 text-center py-12">
            <CardContent>
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Active Deliveries</h3>
              <p className="text-muted-foreground mb-6">
                You don't have any active pickups or deliveries at the moment
              </p>
              <Button onClick={() => navigate("/browse")}>
                Browse Available Donations
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Track;
