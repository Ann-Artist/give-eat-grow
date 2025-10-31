import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Donate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string>("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Donation Posted!",
      description: "Your food donation is now live. NGOs and volunteers will be notified.",
    });
    
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
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
                <Select required>
                  <SelectTrigger id="foodType" className="h-12">
                    <SelectValue placeholder="Select food category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prepared">Prepared Meals</SelectItem>
                    <SelectItem value="vegetables">Vegetables & Fruits</SelectItem>
                    <SelectItem value="grains">Grains & Bread</SelectItem>
                    <SelectItem value="dairy">Dairy Products</SelectItem>
                    <SelectItem value="packaged">Packaged Food</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (kg) *</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    placeholder="e.g., 10"
                    required
                    min="1"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="servings">Estimated Servings</Label>
                  <Input 
                    id="servings" 
                    type="number" 
                    placeholder="e.g., 20"
                    className="h-12"
                  />
                </div>
              </div>

              {/* Pickup Location */}
              <div className="space-y-2">
                <Label htmlFor="location">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Pickup Location *
                </Label>
                <Input 
                  id="location" 
                  type="text" 
                  placeholder="Enter address or use current location"
                  required
                  className="h-12"
                />
              </div>

              {/* Expiry Time */}
              <div className="space-y-2">
                <Label htmlFor="expiry">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Best Before / Pickup By *
                </Label>
                <Input 
                  id="expiry" 
                  type="datetime-local" 
                  required
                  className="h-12"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Any special instructions, dietary information, or storage requirements..."
                  rows={4}
                  className="resize-none"
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
                >
                  Post Donation
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
