import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, Zap, HeartHandshake, Upload, User, UserX, Search, MessageSquare, SearchCode, Send, Moon, Sun, Download } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Get form elements by ID since we didn't bind them all to state yet
    const type = (document.getElementById('type') as HTMLSelectElement)?.innerText?.toLowerCase() || 'suggestion';
    const title = (document.getElementById('title') as HTMLInputElement).value;
    const desc = (document.getElementById('desc') as HTMLTextAreaElement).value;
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const phone = (document.getElementById('contact') as HTMLInputElement).value;
    
    // Generate secure ID
    const newTrackingId = "KEEA-" + Math.floor(100000 + Math.random() * 900000);
    
    try {
      // Get the logged in user
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      // 1. Create the submission
      const { data: submissionData, error } = await supabase.from('submissions').insert([
        {
          user_id: user?.id,
          email: user?.email,
          tracking_id: newTrackingId,
          type: type.includes('complaint') ? 'complaint' : type.includes('request') ? 'request' : 'suggestion',
          subject: title,
          description: desc,
          is_anonymous: isAnonymous,
          name: name,
          phone: phone,
          status: 'Pending',
          category: type.includes('complaint') ? 'complaint' : type.includes('request') ? 'request' : 'suggestion'
        }
      ]).select('id').single();

      if (error) throw error;
      
      // 2. Upload file if selected
      if (selectedFile && submissionData) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${newTrackingId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('evidence')
          .upload(filePath, selectedFile);

        if (uploadError) {
          console.error("Error uploading file:", uploadError);
          // Don't throw, we still want to show success for the ticket
        } else {
          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('evidence')
            .getPublicUrl(filePath);
            
          // Link to submission in media table
          await supabase.from('media').insert([{
            submission_id: submissionData.id,
            file_url: publicUrl
          }]);
        }
      }

      setTrackingId(newTrackingId);
      setSelectedFile(null); // Reset file
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Failed to submit. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const leaders = [
    { name: "Ken Kuffuor", role: "Chairman", phone: "233241639741", img: "/images/chairman.jpeg" },
    { name: "Ebenezer Obeng", role: "First Vice Chairman", phone: "233243320364", img: "/images/Ebenezer Obeng.jpeg" },
    { name: "Dr. Anthony Bordoh", role: "2nd Vice Chairman", phone: "233243518095", img: "/images/Dr. Anthony Bordoh.jpeg" },
    { name: "Frank Mensah", role: "Secretary", phone: "233244417225", img: "/images/Frank Mensah.jpeg" },
    { name: "Henry Raymond Tsiquaye", role: "Deputy Secretary", phone: "233244649145", img: "/images/Raymond Tsiquaye.jpeg" },
    { name: "Agnes E. A. Donkoh", role: "Treasurer", phone: "233244871779", img: "/images/Agnes E. A. Donkoh.jpeg", align: "object-cover object-center" },
    { name: "Benedict Ackon", role: "Organizer", phone: "233549470410", img: "/images/organizer.jpg" },
    { name: "Lawrencia Entsuah", role: "Women Organizer", phone: "233244036888", img: "/images/Lawrencia Entsuah.jpeg" },
    { name: "Felix Ofori-Boafo", role: "Youth Organizer", phone: "233246762615", img: "/images/Felix Ofori-Boafo.jpeg", align: "object-contain bg-muted" },
    { name: "Baaba Awudu", role: "NASARA Organizer", phone: "233243942762", img: "/images/Baaba Awudu.jpeg" },
    { name: "Michael Botsio", role: "Communication Officer", phone: "233541134266", img: "/images/Michael Botsio.jpeg", align: "object-contain bg-muted" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      
      {/* Navbar */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden shadow-sm">
              <img src="/images/logo.png" alt="KEEA Voice Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-bold text-foreground leading-tight">KEEA NPP Voice</h1>
              <p className="text-xs text-muted-foreground font-medium">E-Suggestion Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            {/* <a href="/dashboard" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
              My Dashboard
            </a> */}
            <a href="/admin/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Admin Login
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        
        {/* Hero Section */}
        <div className="text-center mb-16 animate-in slide-in-from-bottom-4 fade-in duration-700">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
            KEEA NPP Voice Platform
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Your voice matters. Whether it's a brilliant suggestion to improve our constituency, a pressing request, or a complaint that needs attention, we are here to listen and act.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://github.com/Odoba158/keea-npp-voice/raw/main/KEEA-VOICE.apk" download="KEEA-VOICE.apk">
              <Button size="lg" className="rounded-full font-bold px-8 bg-gradient-to-r from-blue-600 to-red-500 hover:opacity-90 transition-opacity border-none shadow-lg text-white">
                <Download className="mr-2 h-5 w-5" /> Download Android App
              </Button>
            </a>
          </div>
        </div>

        {/* Feature Cards (3 columns) */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-100">
          <Card className="border border-border shadow-sm hover:shadow-md transition-all bg-card">
            <CardContent className="pt-6 text-center">
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-lg mb-2">Secure & Anonymous</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Submit reports without revealing your identity. Your privacy and safety are our utmost priority.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-border shadow-sm hover:shadow-md transition-all bg-card">
            <CardContent className="pt-6 text-center">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-lg mb-2">Quick Response</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                All suggestions and requests are promptly reviewed and actioned by the KEEA NPP leadership.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border shadow-sm hover:shadow-md transition-all bg-card">
            <CardContent className="pt-6 text-center">
              <div className="w-14 h-14 bg-muted text-muted-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartHandshake className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-lg mb-2">Community Driven</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your voice helps create a stronger, more inclusive community framework for everyone.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Form and Tracking Grid */}
        <div className="grid lg:grid-cols-[2fr_1fr] gap-8 mb-20 animate-in slide-in-from-bottom-12 fade-in duration-700 delay-200">
          
          {/* Left Column: Submit Report */}
          <Card className="border border-border shadow-sm bg-card overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-white to-red-600" />
            <CardHeader className="border-b bg-muted/50 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl text-foreground">Submit a Suggestion or Complaint</CardTitle>
                  <CardDescription className="text-base mt-1 text-muted-foreground">
                    Use this form to send your thoughts directly to the leadership.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              
              {!trackingId ? (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="E.g., John Doe" required className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Phone Number</Label>
                      <Input id="contact" placeholder="050 000 0000" required className="bg-background" />
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                    <Checkbox 
                      id="anonymous" 
                      checked={isAnonymous} 
                      onCheckedChange={(checked) => setIsAnonymous(checked as boolean)} 
                    />
                    <div className="space-y-1 leading-none">
                      <Label htmlFor="anonymous" className="font-semibold text-blue-900 cursor-pointer">
                        Keep my identity anonymous
                      </Label>
                      <p className="text-sm text-blue-700/80">
                        Your identity will be strictly hidden and protected.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Category</Label>
                    <Select required>
                      <SelectTrigger id="type" className="bg-background">
                        <SelectValue placeholder="Select a category..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="suggestion">💡 Suggestion</SelectItem>
                        <SelectItem value="complaint">⚠️ Complaint</SelectItem>
                        <SelectItem value="request">📋 Request</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Subject</Label>
                    <Input id="title" placeholder="Brief title of your submission" required className="bg-background" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="desc">Detailed Description</Label>
                    <Textarea id="desc" placeholder="Please provide all necessary details here..." className="min-h-[120px] resize-none bg-background" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file-upload">Attach Evidence (Optional)</Label>
                    <label htmlFor="file-upload" className="block w-full">
                      <div className={`border-2 border-dashed ${selectedFile ? 'border-primary bg-primary/5' : 'border-border bg-background'} rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer`}>
                        <Upload className={`h-8 w-8 mx-auto mb-2 ${selectedFile ? 'text-primary' : 'text-muted-foreground'}`} />
                        <p className="text-sm font-medium text-foreground">
                          {selectedFile ? selectedFile.name : "Click to upload media files"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : "Image, Audio, or Video (Max 50MB)"}
                        </p>
                      </div>
                    </label>
                    <input 
                      id="file-upload" 
                      type="file" 
                      className="hidden" 
                      accept="image/*,video/*,audio/*"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                  </div>

                  <Button type="submit" className="w-full h-12 text-base bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting securely..." : "Submit to Leadership"}
                    {!isSubmitting && <Send className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-10 animate-in zoom-in fade-in duration-300">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Submission Successful!</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Your voice has been safely recorded. Please copy your secure Tracking ID below.
                  </p>
                  <div className="bg-muted p-6 rounded-xl border border-border inline-block mb-8">
                    <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-2">Your Tracking ID</p>
                    <p className="text-4xl font-mono font-bold text-primary">{trackingId}</p>
                  </div>
                  <div>
                    <Button variant="outline" onClick={() => setTrackingId("")} className="h-12 px-8">Submit Another</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Column: Check Status */}
          <div className="space-y-6">
            <Card className="border border-border shadow-sm bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                  <SearchCode className="h-5 w-5 text-primary" />
                  Track Your Submission
                </CardTitle>
                <CardDescription className="text-base mt-1 text-muted-foreground">
                  Enter your tracking ID to see updates and feedback.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); window.location.href='/track'; }}>
                  <Input placeholder="Enter Tracking ID (e.g. KEEA-123456)" className="h-12 bg-background" required />
                  <Button type="submit" className="w-full h-12 bg-foreground hover:bg-foreground/90 text-background">
                    <Search className="mr-2 h-4 w-4" /> Check Status
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border border-blue-100 shadow-sm bg-blue-50/50">
              <CardContent className="p-6 text-center">
                <h4 className="font-bold text-blue-900 mb-2">Need Urgent Help?</h4>
                <p className="text-sm text-blue-700 mb-4">
                  If this is an emergency that requires immediate political intervention, please contact the constituency office directly.
                </p>
                <a href="tel:+233000000000" className="inline-flex h-10 items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm border border-blue-200 hover:bg-blue-50 transition-colors">
                  Call Office: 050 000 0000
                </a>
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Leaders Section */}
        <section className="mb-20 animate-in slide-in-from-bottom-12 fade-in duration-700 delay-500">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Leadership</h2>
            <p className="text-muted-foreground">Dedicated to serving the people of KEEA</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {leaders.map((leader, idx) => (
              <Card key={idx} className="border-none shadow-md hover:shadow-lg transition-shadow bg-card overflow-hidden group">
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10" />
                  <img src={leader.img} alt={leader.name} className={`w-full h-full ${leader.align || 'object-cover object-top'} group-hover:scale-105 transition-transform duration-500`} />
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="font-bold text-lg text-foreground mb-1">{leader.name}</h3>
                  <p className="text-primary font-medium text-sm mb-4">{leader.role}</p>
                  {leader.phone ? (
                    <a 
                      href={`https://wa.me/${leader.phone}?text=Hello%20${leader.name.split(' ')[0]}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block w-full py-2 px-4 bg-primary/10 text-primary font-medium text-sm rounded-md hover:bg-primary/20 transition-colors border border-primary/20"
                    >
                      Message on WhatsApp
                    </a>
                  ) : (
                    <div className="h-[38px]"></div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-8 text-center md:text-left">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
              <p className="mb-2">Phone: <a href="tel:0248778557" className="hover:text-white transition-colors">0248778557</a></p>
              <p>Email: <a href="mailto:ackonbright158@gmail.com" className="hover:text-white transition-colors">ackonbright158@gmail.com</a></p>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
              <h3 className="text-white font-bold text-lg mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/joyliteprinthouse?igsh=eGJrNHh3b250aDY0" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 hover:text-white transition-all flex items-center justify-center">
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <a href="https://www.tiktok.com/@joylite.print.hou?_r=1&_t=ZS-97I8cg4tYue" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 hover:text-white transition-all flex items-center justify-center">
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.8-5.46-.4-2.51.33-5.18 2.06-7.06 1.76-1.93 4.41-2.91 7.02-2.73v4.06c-1.35-.15-2.73.08-3.9.78-1.13.68-1.91 1.83-2.21 3.1-.3 1.25-.09 2.6.58 3.7.83 1.34 2.45 2.15 4.07 2.12 1.66-.02 3.22-.88 4.15-2.22.45-.64.71-1.42.75-2.2.06-2.51.02-5.02.02-7.53-.02-3.33-.04-6.66-.02-9.98z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-center md:text-left">
            <p>© 2026 KEEA NPP E-Suggestion Platform. All rights reserved.</p>
            <p>Developed by <span className="text-white font-semibold">JoyLite Printhouse</span></p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="/admin/login" className="hover:text-white transition-colors">Admin</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}