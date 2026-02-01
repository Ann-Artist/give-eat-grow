import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import Navigation from "@/components/Navigation";
import { donationSchema, validateImageFile } from "@/lib/validation/donationSchema";

const Donate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
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

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate image file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast({
          title: "Invalid Image",
          description: validation.error,
          variant: "destructive",
        });
        e.target.value = ''; // Reset input
        return;
      }
      
      setImageFile(file);
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
    
    // Validate form data with Zod
    const validationResult = donationSchema.safeParse(formData);
    
    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setFormErrors(errors);
      toast({
        title: "Validation Error",
        description: "Please fix the form errors before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    setFormErrors({});
    setIsSubmitting(true);

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error("Profile not found");

      // Use validated and sanitized data
      const validatedData = validationResult.data;

      let photoUrl: string | null = null;

      // Upload image if one was selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()?.toLowerCase();
        // Use user.id for folder structure to enable proper RLS ownership checks
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('donation-photos')
          .upload(fileName, imageFile);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('donation-photos')
          .getPublicUrl(fileName);
        
        photoUrl = publicUrl;
      }

      const { error } = await supabase
        .from('donations')
        .insert({
          donor_id: profile.id,
          food_type: validatedData.foodType,
          quantity: validatedData.quantity,
          servings: validatedData.servings ? parseInt(validatedData.servings) : null,
          location: validatedData.location,
          expiry_hours: parseInt(validatedData.expiryHours),
          description: validatedData.description || null,
          photo_url: photoUrl,
          status: 'available',
          urgent: parseInt(validatedData.expiryHours) <= 4,
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
                <Input 
                  id="foodType" 
                  type="text" 
                  placeholder="e.g., Dal chawal, Biryani, Roti sabzi..."
                  required
                  maxLength={100}
                  className={`h-12 ${formErrors.foodType ? 'border-destructive' : ''}`}
                  value={formData.foodType}
                  onChange={(e) => setFormData({...formData, foodType: e.target.value})}
                />
                {formErrors.foodType && <p className="text-xs text-destructive">{formErrors.foodType}</p>}
                <p className="text-xs text-muted-foreground">Enter the specific food items you're donating (max 100 chars)</p>
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
                    maxLength={50}
                    className={`h-12 ${formErrors.quantity ? 'border-destructive' : ''}`}
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  />
                  {formErrors.quantity && <p className="text-xs text-destructive">{formErrors.quantity}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="servings">Estimated Servings</Label>
                  <Input 
                    id="servings" 
                    type="number" 
                    placeholder="e.g., 20"
                    min={1}
                    max={1000}
                    className={`h-12 ${formErrors.servings ? 'border-destructive' : ''}`}
                    value={formData.servings}
                    onChange={(e) => setFormData({...formData, servings: e.target.value})}
                  />
                  {formErrors.servings && <p className="text-xs text-destructive">{formErrors.servings}</p>}
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
                  maxLength={200}
                  className={`h-12 ${formErrors.location ? 'border-destructive' : ''}`}
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
                {formErrors.location && <p className="text-xs text-destructive">{formErrors.location}</p>}
                <p className="text-xs text-muted-foreground">Enter area/locality in Pune or PCMC (max 200 chars)</p>
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
                  className={`h-12 ${formErrors.expiryHours ? 'border-destructive' : ''}`}
                  min={1}
                  max={48}
                  value={formData.expiryHours}
                  onChange={(e) => setFormData({...formData, expiryHours: e.target.value})}
                />
                {formErrors.expiryHours && <p className="text-xs text-destructive">{formErrors.expiryHours}</p>}
                <p className="text-xs text-muted-foreground">Items expiring in 4 hours or less are marked as urgent</p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Any special instructions, dietary information, or storage requirements..."
                  rows={4}
                  maxLength={1000}
                  className={`resize-none ${formErrors.description ? 'border-destructive' : ''}`}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
                {formErrors.description && <p className="text-xs text-destructive">{formErrors.description}</p>}
                <p className="text-xs text-muted-foreground">{formData.description.length}/1000 characters</p>
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
