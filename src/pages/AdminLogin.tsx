import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert("Invalid email or password");
      } else {
        navigate("/admin");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-900/50 to-background transform -skew-y-6 origin-top-left -z-10" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <Link to="/" className="text-white/80 hover:text-white inline-flex items-center text-sm font-medium transition-colors mb-8 px-4 sm:px-0">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Public Site
        </Link>
        <div className="text-center px-4 sm:px-0 mb-6 text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-md mb-4 shadow-lg border border-white/30">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Admin Portal</h2>
          <p className="mt-2 text-blue-100">Sign in to manage submissions</p>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <Card className="border-none shadow-2xl rounded-2xl overflow-hidden">
          <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-red-500 to-blue-600" />
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Authentication Required</CardTitle>
            <CardDescription className="text-center">
              Please enter your admin credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@keea-npp.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                />
              </div>
              <Button type="submit" className="w-full h-12 text-base mt-2" disabled={isLoading}>
                {isLoading ? "Authenticating..." : "Sign in to Dashboard"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="bg-muted/30 border-t justify-center py-4 text-sm text-muted-foreground">
            Secure access for authorized personnel only.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}