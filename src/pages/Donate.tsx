import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import Navigation from "@/components/Navigation";

const Donate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    foodType: "",
    quantity: "",
    servings: "",
    location: "",
    expiryHours: "",
    description: "",
  });

  useEffect(() => {
    if (!user && !loading) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error("Profile not found");

      const { error } = await supabase
        .from('donations')
        .insert({
          donor_id: profile.id,
          food_type: formData.foodType,
          quantity: formData.quantity,
          servings: formData.servings ? parseInt(formData.servings) : null,
          location: formData.location,
          expiry_hours: parseInt(formData.expiryHours),
          description: formData.description,
          status: 'available',
          urgent: parseInt(formData.expiryHours) <= 4,
        });

      if (error) throw error;

      toast({
        title: "Donation Posted!",
        description: "Your food donation is now live. NGOs and volunteers will be notified.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error('Error posting donation:', error);
      toast({
        title: "Error",
        description: "Failed to post donation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="shadow-soft border-0 animate-scale-in">
          <CardHeader>
            <CardTitle className="text-3xl">Donate Food</CardTitle>
            <CardDescription>
              Share your surplus food with those who need it most
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Food Type */}
              <div className="space-y-2">
                <Label htmlFor="foodType">Food Type *</Label>
                <Select required value={formData.foodType} onValueChange={(value) => setFormData({...formData, foodType: value})}>
                  <SelectTrigger id="foodType" className="h-12">
                    <SelectValue placeholder="Select food category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Prepared Meals">Prepared Meals</SelectItem>
                    <SelectItem value="Vegetables & Fruits">Vegetables & Fruits</SelectItem>
                    <SelectItem value="Bread & Pastries">Bread & Pastries</SelectItem>
                    <SelectItem value="Dairy Products">Dairy Products</SelectItem>
                    <SelectItem value="Canteen Food">Canteen Food</SelectItem>
                    <SelectItem value="Buffet Items">Buffet Items</SelectItem>
                    <SelectItem value="Packaged Food">Packaged Food</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input 
                    id="quantity" 
                    type="text" 
                    placeholder="e.g., 10 kg, 25 kg"
                    required
                    className="h-12"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="servings">Estimated Servings</Label>
                  <Input 
                    id="servings" 
                    type="number" 
                    placeholder="e.g., 20"
                    className="h-12"
                    value={formData.servings}
                    onChange={(e) => setFormData({...formData, servings: e.target.value})}
                  />
                </div>
              </div>

              {/* Pickup Location */}
              <div className="space-y-2">
                <Label htmlFor="location">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Pickup Location in Pune *
                </Label>
                <Input 
                  id="location" 
                  type="text" 
                  placeholder="e.g., Koregaon Park, Viman Nagar, Hinjewadi, School/College Canteen..."
                  required
                  className="h-12"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">Enter area/locality in Pune or PCMC (restaurants, canteens, homes, etc.)</p>
              </div>

              {/* Expiry Time */}
              <div className="space-y-2">
                <Label htmlFor="expiry">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Expires In (hours) *
                </Label>
                <Input 
                  id="expiry" 
                  type="number" 
                  placeholder="e.g., 4"
                  required
                  className="h-12"
                  min="1"
                  max="48"
                  value={formData.expiryHours}
                  onChange={(e) => setFormData({...formData, expiryHours: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">Items expiring in 4 hours or less are marked as urgent</p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Any special instructions, dietary information, or storage requirements..."
                  rows={4}
                  className="resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">
                  <Upload className="w-4 h-4 inline mr-2" />
                  Food Image (Optional)
                </Label>
                <Input 
                  id="image" 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="h-12"
                />
                {imagePreview && (
                  <div className="mt-4 rounded-xl overflow-hidden border-2 border-border">
                    <img 
                      src={imagePreview} 
                      alt="Food preview" 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  By posting this donation, you agree to provide accurate information and ensure food safety standards.
                </p>
                
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg shadow-soft hover:shadow-lg transition-all"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Posting..." : "Post Donation"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Impact Message */}
        <div className="mt-8 bg-gradient-primary rounded-2xl p-6 text-white text-center shadow-soft">
          <p className="text-lg font-medium">
            Thank you for choosing to share instead of waste! 🌱
          </p>
          <p className="text-sm opacity-90 mt-2">
            Your donation could feed families, reduce landfill waste, and lower carbon emissions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Donate;
