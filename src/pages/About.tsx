import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Users, TrendingDown, MapPin } from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  const coverage = [
    "Koregaon Park", "Viman Nagar", "Hinjewadi", "Kothrud",
    "Deccan", "Shivajinagar", "Wakad", "Baner",
    "Hadapsar", "Magarpatta", "Aundh", "Pimpri-Chinchwad"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="bg-gradient-primary bg-clip-text text-transparent">FoodLink Pune</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connecting surplus food with those in need across Pune and surrounding areas
          </p>
        </div>

        {/* Mission */}
        <Card className="mb-8 shadow-card border-0 animate-scale-in">
          <CardContent className="pt-8 pb-8">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <Heart className="w-16 h-16 mx-auto text-primary mb-4" />
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                FoodLink Pune is dedicated to reducing food waste and feeding communities across 
                Pune, Pimpri-Chinchwad, and surrounding areas in Maharashtra. We connect restaurants, 
                event venues, hotels, and households with NGOs, volunteers, and charitable organizations 
                to ensure surplus food reaches those who need it most.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Heart, label: "Meals Served in Pune", value: "50,000+" },
            { icon: Users, label: "Partner Organizations", value: "120+" },
            { icon: TrendingDown, label: "Food Waste Reduced", value: "100 Tonnes" },
          ].map((stat, index) => (
            <Card key={index} className="shadow-card border-0 hover:shadow-soft transition-all">
              <CardContent className="pt-6 text-center">
                <stat.icon className="w-12 h-12 mx-auto text-primary mb-4" />
                <p className="text-3xl font-bold mb-2">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coverage Areas */}
        <Card className="mb-8 shadow-card border-0">
          <CardContent className="pt-8 pb-8">
            <div className="text-center mb-6">
              <MapPin className="w-12 h-12 mx-auto text-primary mb-4" />
              <h2 className="text-3xl font-bold mb-2">Coverage Areas</h2>
              <p className="text-muted-foreground">
                We serve Pune and Pimpri-Chinchwad Municipal Corporation areas
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {coverage.map((area, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-xl bg-muted/50 text-center font-medium hover:bg-primary/10 hover:text-primary transition-all"
                >
                  {area}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-8">How FoodLink Works in Pune</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Restaurants & Donors",
                description: "Hotels, restaurants, event venues, and households across Pune post surplus food with pickup details and timing",
              },
              {
                step: "2",
                title: "NGOs & Volunteers",
                description: "Registered NGOs and volunteers in the area receive notifications and accept donations for collection",
              },
              {
                step: "3",
                title: "Community Impact",
                description: "Food reaches those in need across Pune slums, shelters, and communities, reducing waste and hunger",
              },
            ].map((item, index) => (
              <Card key={index} className="shadow-card border-0 hover:shadow-soft transition-all">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-hero rounded-3xl p-12 text-center text-white shadow-soft">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join the Pune Food Movement
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Whether you're a restaurant in Koregaon Park, an NGO in Hadapsar, or a volunteer in Hinjewadi - 
            you can make a difference in our community
          </p>
          <Button 
            size="lg"
            variant="secondary"
            className="text-lg px-8"
            onClick={() => navigate("/auth")}
          >
            Get Started Today
          </Button>
        </div>
      </div>
    </div>
  );
};

export default About;
