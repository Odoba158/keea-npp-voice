import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function TrackStatus() {
  const [trackingId, setTrackingId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    
    setIsSearching(true);
    setError(false);
    setResult(null);

    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('tracking_id', trackingId.trim().toUpperCase())
        .single();

      if (error || !data) {
        setError(true);
      } else {
        setResult({
          id: data.tracking_id,
          status: data.status,
          date: new Date(data.created_at).toLocaleDateString(),
          title: data.subject,
          feedback: data.admin_feedback || "No feedback has been provided by the admin yet.",
          adminName: data.admin_feedback ? "Admin Team" : ""
        });
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link to="/" className="text-slate-500 hover:text-slate-900 inline-flex items-center text-sm font-medium transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-2xl flex flex-col items-center">
        <div className="text-center mb-10 w-full">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3 shadow-sm border border-blue-200">
            <Search className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Track Your Submission</h1>
          <p className="text-slate-600 text-lg max-w-md mx-auto">
            Enter your secure Tracking ID below to view the status and read feedback from our admins.
          </p>
        </div>

        <Card className="w-full border-none shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden mb-8">
          <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-red-500 to-blue-600" />
          <CardContent className="p-8">
            <form onSubmit={handleSearch} className="flex gap-4 flex-col sm:flex-row">
              <Input 
                placeholder="e.g. KEEA-123456" 
                className="h-14 text-lg font-mono tracking-wider bg-slate-50 text-center sm:text-left uppercase placeholder:normal-case" 
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                required
              />
              <Button type="submit" size="lg" className="h-14 px-8 bg-slate-900 hover:bg-slate-800 shrink-0" disabled={isSearching}>
                {isSearching ? "Searching..." : "Track Now"}
              </Button>
            </form>
            
            {error && (
              <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3 border border-red-100 animate-in fade-in zoom-in duration-300">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Invalid Tracking ID</p>
                  <p className="text-sm mt-1">We couldn't find any submission matching that ID. Please check the ID you were given and try again.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {result && (
          <div className="w-full space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Status Report</h2>
              <span className="text-sm text-slate-500 font-mono">{result.id}</span>
            </div>
            
            <Card className="border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 bg-white border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Subject</p>
                  <p className="font-semibold text-slate-900">{result.title}</p>
                  <p className="text-xs text-slate-400 mt-2">Submitted on {result.date}</p>
                </div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium text-sm self-start sm:self-auto shrink-0">
                  <Clock className="w-4 h-4 mr-2" />
                  {result.status}
                </div>
              </div>
              
              <div className="p-6 bg-slate-50">
                <p className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Admin Feedback
                </p>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative">
                  <div className="absolute -top-3 -left-3 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center border-2 border-white">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    "{result.feedback}"
                  </p>
                  <p className="text-sm font-medium text-blue-600 mt-4">— {result.adminName}</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

// Need to import MessageSquare above since it was used in the UI mock
import { MessageSquare } from "lucide-react";