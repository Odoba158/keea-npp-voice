import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, ShieldQuestion } from "lucide-react";

export default function SubmitComplaint() {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setTrackingId("KEEA-" + Math.floor(100000 + Math.random() * 900000));
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-none shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <CardTitle className="text-2xl text-slate-900">Submission Successful!</CardTitle>
            <CardDescription className="text-base mt-2">
              Your voice has been heard. Thank you for helping us improve KEEA.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="bg-slate-100 rounded-xl p-6">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Your Tracking ID</p>
              <p className="text-3xl font-mono font-bold text-blue-700 tracking-widest">{trackingId}</p>
              <p className="text-xs text-slate-500 mt-4">
                Please save this Tracking ID securely. You can use it later to check the status and admin feedback.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/track">
                <Button className="w-full h-12">Track Status Now</Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full h-12">Return Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link to="/" className="text-slate-500 hover:text-slate-900 inline-flex items-center text-sm font-medium transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Make a Suggestion</h1>
          <p className="text-slate-600 text-lg">
            Share your requests, complaints, or suggestions directly with the KEEA NPP leadership.
          </p>
        </div>

        <Card className="border-none shadow-xl bg-white/60 backdrop-blur-sm">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Type Selection */}
              <div className="space-y-3">
                <Label htmlFor="category" className="text-base font-semibold">What is this regarding?</Label>
                <Select required>
                  <SelectTrigger id="category" className="h-12 bg-white">
                    <SelectValue placeholder="Select a category..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="suggestion">💡 Suggestion</SelectItem>
                    <SelectItem value="complaint">⚠️ Complaint</SelectItem>
                    <SelectItem value="request">📋 Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="space-y-3">
                <Label htmlFor="title" className="text-base font-semibold">Subject / Title</Label>
                <Input id="title" required placeholder="E.g., Road repair needed in ward 4" className="h-12 bg-white" />
              </div>

              {/* Description */}
              <div className="space-y-3">
                <Label htmlFor="description" className="text-base font-semibold">Details</Label>
                <Textarea 
                  id="description" 
                  required 
                  placeholder="Please provide as much detail as possible..." 
                  className="min-h-[150px] bg-white resize-none" 
                />
              </div>

              {/* File Upload */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Upload Evidence (Optional)</Label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                  <Upload className="h-10 w-10 text-slate-400 mx-auto mb-4 group-hover:text-blue-500 transition-colors" />
                  <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500 mt-2">Supports Image, Video, or Audio files (Max 50MB)</p>
                  <input type="file" className="hidden" multiple accept="image/*,video/*,audio/*" />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <ShieldQuestion className="h-5 w-5 text-blue-600" />
                      <Label htmlFor="anonymous" className="text-base font-semibold text-slate-900 cursor-pointer">Submit Anonymously</Label>
                    </div>
                    <p className="text-sm text-slate-600 max-w-sm">
                      If enabled, your identity will be completely hidden from the admins. You'll receive a tracking ID to securely view feedback later.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input 
                      type="checkbox" 
                      id="anonymous" 
                      className="sr-only peer" 
                      checked={isAnonymous} 
                      onChange={(e) => setIsAnonymous(e.target.checked)} 
                    />
                    <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              {/* Personal Info if not anonymous */}
              {!isAnonymous && (
                <div className="grid sm:grid-cols-2 gap-6 animate-in slide-in-from-top-4 fade-in duration-300 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-sm font-medium">Full Name (Optional)</Label>
                    <Input id="name" placeholder="John Doe" className="bg-white" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-sm font-medium">Phone Number / WhatsApp (Optional)</Label>
                    <Input id="phone" type="tel" placeholder="050 000 0000" className="bg-white" />
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting securely..." : "Submit Securely"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}