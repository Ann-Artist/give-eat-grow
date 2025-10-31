import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, MapPin, Clock, Package, Navigation } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Browse = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const donations = [
    {
      id: 1,
      donor: "Green Valley Restaurant",
      foodType: "Prepared Meals",
      quantity: "25kg",
      servings: "50",
      distance: "1.2km",
      expiry: "4 hours",
      location: "123 Main St, Downtown",
      urgent: true,
    },
    {
      id: 2,
      donor: "Downtown Bakery",
      foodType: "Bread & Pastries",
      quantity: "15kg",
      servings: "30",
      distance: "2.5km",
      expiry: "6 hours",
      location: "456 Oak Ave, City Center",
      urgent: false,
    },
    {
      id: 3,
      donor: "Fresh Market",
      foodType: "Vegetables & Fruits",
      quantity: "40kg",
      servings: "80",
      distance: "3.1km",
      expiry: "12 hours",
      location: "789 Market St, Eastside",
      urgent: false,
    },
    {
      id: 4,
      donor: "City Event Center",
      foodType: "Buffet Items",
      quantity: "60kg",
      servings: "120",
      distance: "4.2km",
      expiry: "2 hours",
      location: "101 Convention Blvd",
      urgent: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Browse Donations</h1>
          <p className="text-muted-foreground text-lg">Find and accept food donations in your area</p>
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
                />
              </div>
              
              <Select>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Food Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="prepared">Prepared Meals</SelectItem>
                  <SelectItem value="vegetables">Vegetables & Fruits</SelectItem>
                  <SelectItem value="grains">Grains & Bread</SelectItem>
                  <SelectItem value="dairy">Dairy Products</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="urgent">Urgent (&lt; 4 hours)</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Distance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Distance</SelectItem>
                  <SelectItem value="1">Within 1km</SelectItem>
                  <SelectItem value="5">Within 5km</SelectItem>
                  <SelectItem value="10">Within 10km</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Donations List */}
        <div className="space-y-4">
          {donations.map((donation) => (
            <Card 
              key={donation.id}
              className="shadow-card border-0 hover:shadow-soft transition-all duration-300"
            >
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left: Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{donation.donor}</h3>
                        <p className="text-muted-foreground">{donation.foodType}</p>
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
                          <p className="font-semibold">{donation.servings}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Distance</p>
                          <p className="font-semibold">{donation.distance}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Expires In</p>
                          <p className="font-semibold">{donation.expiry}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p>{donation.location}</p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex md:flex-col gap-3 md:min-w-[140px]">
                    <Button className="flex-1 shadow-soft">
                      Accept Donation
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Navigation className="w-4 h-4 mr-2" />
                      Navigate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State Message */}
        {donations.length === 0 ? (
          <Card className="shadow-card border-0 text-center py-12">
            <CardContent>
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No donations found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or check back later
              </p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
};

export default Browse;
