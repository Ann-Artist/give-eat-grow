import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Heart, MapPin, TrendingUp, Users, Plus, Search, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase, type Donation } from "@/lib/supabase";
import Navigation from "@/components/Navigation";
import { formatDistanceToNow } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);

  useEffect(() => {
    const fetchRecentDonations = async () => {
      const { data } = await supabase
        .from("donations")
        .select("*, profiles!donations_donor_id_fkey(*)")
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (data) setRecentDonations(data as unknown as Donation[]);
    };

    fetchRecentDonations();
  }, []);

  const stats = [
    { 
      icon: Heart, 
      label: "Meals Served in Pune", 
      value: "1,247",
      change: "+12% this week",
      gradient: "from-primary to-primary/70"
    },
    { 
      icon: Package, 
      label: "Food Saved", 
      value: "850 kg",
      change: "+8% this week",
      gradient: "from-accent to-accent/70"
    },
    { 
      icon: TrendingUp, 
      label: "Waste Reduced", 
      value: "2.5 Tonnes",
      change: "+15% this week",
      gradient: "from-primary to-accent"
    },
    { 
      icon: Users, 
      label: "Active Users in PCMC", 
      value: "2,834",
      change: "+20% this week",
      gradient: "from-accent to-primary"
    },
  ];

  const quickActions = [
    {
      icon: Plus,
      title: "Donate Food",
      description: "Share your surplus",
      action: () => navigate("/donate"),
      variant: "default" as const,
    },
    {
      icon: Search,
      title: "Find Donations",
      description: "Browse available food",
      action: () => navigate("/browse"),
      variant: "outline" as const,
    },
    {
      icon: MapPin,
      title: "Track Deliveries",
      description: "Monitor active pickups",
      action: () => navigate("/track"),
      variant: "outline" as const,
    },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome to <span className="bg-gradient-primary bg-clip-text text-transparent">FoodLink</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Together, we're making every meal count
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1 border-0">
              <CardContent className="pt-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                <p className="text-xs text-primary font-medium">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 shadow-card border-0">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>What would you like to do today?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant}
                  className="h-auto py-6 px-6 flex flex-col items-start gap-2 hover:shadow-soft transition-all"
                  onClick={action.action}
                >
                  <action.icon className="w-6 h-6" />
                  <div className="text-left">
                    <p className="font-semibold text-base">{action.title}</p>
                    <p className="text-sm opacity-80 font-normal">{action.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest donations in your area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDonations.length > 0 ? (
                recentDonations.map((donation) => (
                  <div 
                    key={donation.id}
                    className="flex items-start justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold mb-1">{donation.profiles?.full_name || "Anonymous"}</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        {donation.quantity} {donation.food_type}
                        {donation.servings && ` • ${donation.servings} servings`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(donation.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      donation.status === 'completed' ? 'bg-primary/10 text-primary' :
                      donation.status === 'accepted' ? 'bg-accent/20 text-accent-foreground' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {donation.status === 'completed' ? 'Completed' :
                       donation.status === 'accepted' ? 'Accepted' : 'Available'}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">No recent donations</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Motivational Banner */}
        <div className="mt-8 bg-gradient-hero rounded-2xl p-8 text-center text-white shadow-soft">
          <Heart className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Every action makes a difference in Pune</h3>
          <p className="opacity-90 max-w-2xl mx-auto">
            You're part of a community across Pune and PCMC that has saved over 850 kg of food this week. Keep up the amazing work!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
