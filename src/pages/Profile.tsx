import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, MapPin, Award, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  const stats = [
    { icon: Heart, label: "Donations Made", value: "24" },
    { icon: Award, label: "Impact Score", value: "850" },
  ];

  const history = [
    { date: "2024-01-15", type: "Donated", item: "25 kg vegetables", location: "Koregaon Park Restaurant" },
    { date: "2024-01-10", type: "Donated", item: "15 kg bread", location: "Viman Nagar Bakery" },
    { date: "2024-01-05", type: "Donated", item: "40 kg buffet items", location: "Hinjewadi IT Park" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <h1 className="text-3xl md:text-4xl font-bold mb-8">Profile & Settings</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-card border-0">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Personal Information */}
        <Card className="mb-6 shadow-card border-0">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </Label>
                <Input id="name" defaultValue="John Doe" className="h-12" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </Label>
                <Input id="email" type="email" defaultValue="john@example.com" className="h-12" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone
                </Label>
                <Input id="phone" type="tel" defaultValue="+1 234 567 8900" className="h-12" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location
                </Label>
                <Input id="location" defaultValue="Pune, Maharashtra" className="h-12" />
              </div>
            </div>

            <Button onClick={handleSave} className="shadow-soft">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="mb-6 shadow-card border-0">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Manage your app settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates about nearby donations</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS Alerts</p>
                <p className="text-sm text-muted-foreground">Get urgent donation alerts via SMS</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly Summary</p>
                <p className="text-sm text-muted-foreground">Receive a weekly impact report</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Donation History */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle>Donation History</CardTitle>
            <CardDescription>Your recent contributions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {history.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-start justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-semibold mb-1">{item.item}</p>
                    <p className="text-sm text-muted-foreground mb-1">{item.location}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {item.type}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
