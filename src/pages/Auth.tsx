import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Heart, Building2, Users as UsersIcon, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<string>("donor");
  const [isLogin, setIsLogin] = useState(true);

  const roles = [
    { id: "donor", label: "Donor", icon: Heart, description: "Share surplus food" },
    { id: "ngo", label: "NGO", icon: Building2, description: "Receive donations" },
    { id: "volunteer", label: "Volunteer", icon: UsersIcon, description: "Help deliver" },
    { id: "admin", label: "Admin", icon: ShieldCheck, description: "Manage platform" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: isLogin ? "Welcome back!" : "Account created!",
      description: `Logged in as ${selectedRole}`,
    });
    
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-soft animate-scale-in">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            <span className="bg-gradient-primary bg-clip-text text-transparent">FoodLink</span>
          </CardTitle>
          <CardDescription>
            {isLogin ? "Welcome back! Sign in to continue" : "Join the movement to end food waste"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={isLogin ? "login" : "signup"} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" onClick={() => setIsLogin(true)}>
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" onClick={() => setIsLogin(false)}>
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value={isLogin ? "login" : "signup"}>
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label>I am a...</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {roles.map((role) => (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => setSelectedRole(role.id)}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            selectedRole === role.id
                              ? "border-primary bg-primary/5 shadow-soft"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <role.icon className={`w-6 h-6 mx-auto mb-2 ${
                            selectedRole === role.id ? "text-primary" : "text-muted-foreground"
                          }`} />
                          <p className="font-medium text-sm">{role.label}</p>
                          <p className="text-xs text-muted-foreground mt-1">{role.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com"
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    required
                    className="h-12"
                  />
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      type="text" 
                      placeholder="Your name"
                      required
                      className="h-12"
                    />
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base shadow-soft hover:shadow-lg transition-all"
                >
                  {isLogin ? "Sign In" : "Create Account"}
                </Button>

                {isLogin && (
                  <div className="text-center">
                    <button 
                      type="button"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
