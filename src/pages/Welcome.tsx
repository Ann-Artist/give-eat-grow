import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Heart, Users, TrendingDown, Award } from "lucide-react";
import heroImage from "@/assets/hero-community.jpg";

const Welcome = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: Heart, label: "Meals Served in Pune", value: "50K+" },
    { icon: Users, label: "Active Users", value: "2,500+" },
    { icon: TrendingDown, label: "Food Waste Reduced", value: "100 Tonnes" },
    { icon: Award, label: "Partner NGOs in Maharashtra", value: "120+" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 min-h-[80vh]">
          {/* Left Content */}
          <div className="flex-1 space-y-6 text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm">
              <Heart className="w-4 h-4" />
              Making Every Meal Count
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-foreground">Food</span>
              <span className="bg-gradient-primary bg-clip-text text-transparent">Link</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
              Connecting Surplus Food to Those in Need Across Pune
            </p>
            
            <p className="text-lg text-muted-foreground max-w-xl">
              Join Pune's movement to reduce food waste and feed our communities. Serving Koregaon Park, Viman Nagar, Hinjewadi, Kothrud, and all of PCMC.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button 
                size="lg" 
                className="text-lg px-8 shadow-soft hover:shadow-lg transition-all"
                onClick={() => navigate("/auth")}
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8"
                onClick={() => navigate("/about")}
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 w-full animate-scale-in">
            <div className="relative rounded-3xl overflow-hidden shadow-soft">
              <img 
                src={heroImage} 
                alt="Community sharing food"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 animate-slide-up">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-card rounded-2xl p-6 shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1"
            >
              <stat.icon className="w-8 h-8 text-primary mb-3" />
              <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How FoodLink Works</h2>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Three simple steps to make a difference
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Donate",
                description: "Hotels, restaurants, and homes across Pune post surplus food with location and pickup timing",
              },
              {
                step: "2",
                title: "Connect",
                description: "Registered NGOs and volunteers in your area receive alerts and accept donations",
              },
              {
                step: "3",
                title: "Impact",
                description: "Food reaches communities in need across Pune while reducing waste and carbon footprint",
              },
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-card rounded-2xl p-8 shadow-card hover:shadow-soft transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-gradient-hero rounded-3xl p-12 text-center text-white shadow-soft">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make a Difference in Pune?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands across Maharashtra turning food waste into hope and feeding our communities
          </p>
          <Button 
            size="lg"
            variant="secondary"
            className="text-lg px-8"
            onClick={() => navigate("/auth")}
          >
            Join FoodLink Today
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
