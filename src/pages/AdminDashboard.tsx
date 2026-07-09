import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { LogOut, Inbox, CheckCircle2, Search, Filter, LayoutDashboard, User } from "lucide-react";

export default function AdminDashboard() {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [feedback, setFeedback] = useState("");
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data) setTickets(data);
    setIsLoading(false);
  };

  const handleUpdate = async () => {
    if (!selectedTicket) return;
    
    // Get the new status from the select element (workaround since not fully state-bound)
    const newStatusText = (document.getElementById('status-select') as HTMLSelectElement)?.innerText?.toLowerCase() || selectedTicket.status.toLowerCase();
    const formattedStatus = newStatusText.includes('review') ? 'Under Review' : newStatusText.includes('resolved') ? 'Resolved' : 'Pending';

    try {
      const { error } = await supabase
        .from('submissions')
        .update({ 
          status: formattedStatus,
          admin_feedback: feedback
        })
        .eq('id', selectedTicket.id);

      if (error) throw error;
      
      alert("Feedback saved and status updated!");
      fetchTickets(); // Refresh list
    } catch (err) {
      console.error(err);
      alert("Failed to update submission.");
    }
  };

  const filteredTickets = tickets.filter(t => {
    if (statusFilter === 'all') return true;
    return t.status.toLowerCase().includes(statusFilter);
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex shrink-0 h-screen sticky top-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
          <span className="text-white font-bold tracking-wider">KEEA ADMIN</span>
        </div>
        <div className="p-4 flex-1 space-y-2">
          <Button variant="ghost" className="w-full justify-start text-white bg-slate-800 hover:bg-slate-700 hover:text-white">
            <LayoutDashboard className="mr-3 h-5 w-5" /> Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start hover:bg-slate-800 hover:text-white">
            <Inbox className="mr-3 h-5 w-5" /> All Submissions
          </Button>
          <Button variant="ghost" className="w-full justify-start hover:bg-slate-800 hover:text-white">
            <User className="mr-3 h-5 w-5" /> My Profile
          </Button>
        </div>
        <div className="p-4 border-t border-slate-800 mt-auto">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/30">
              <LogOut className="mr-3 h-5 w-5" /> Logout
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-slate-900 text-white h-16 flex items-center justify-between px-4 sticky top-0 z-20">
          <span className="font-bold tracking-wider">KEEA ADMIN</span>
          <Link to="/">
            <LogOut className="h-5 w-5 text-slate-300" />
          </Link>
        </header>

        {/* Topbar */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 shrink-0 z-10">
          <h1 className="text-xl font-semibold text-slate-800">Submissions Overview</h1>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input type="search" placeholder="Search ID or keyword..." className="w-64 pl-9 bg-slate-50 border-none" />
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
              JD
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-6 flex flex-col lg:flex-row gap-6">
          
          {/* List View */}
          <div className={`w-full lg:w-1/2 xl:w-2/5 flex flex-col gap-4 ${selectedTicket ? 'hidden lg:flex' : 'flex'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Select defaultValue="all" onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] bg-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="review">Under Review</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="bg-white"><Filter className="h-4 w-4" /></Button>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <p className="text-center text-slate-500 py-10">Loading submissions...</p>
              ) : filteredTickets.length === 0 ? (
                <p className="text-center text-slate-500 py-10">No submissions found.</p>
              ) : (
                filteredTickets.map((ticket) => (
                  <Card 
                    key={ticket.id} 
                    className={`cursor-pointer transition-colors hover:border-blue-300 ${selectedTicket?.id === ticket.id ? 'border-blue-500 shadow-md ring-1 ring-blue-500' : ''}`}
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setFeedback(ticket.admin_feedback || "");
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{ticket.tracking_id}</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                          ticket.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1">{ticket.subject}</h3>
                      <div className="flex justify-between items-center text-sm text-slate-500">
                        <span className="capitalize">{ticket.type} • {ticket.is_anonymous ? 'Anonymous' : (ticket.name || 'Anonymous')}</span>
                        <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Detail View */}
          <div className={`w-full lg:w-1/2 xl:w-3/5 ${!selectedTicket ? 'hidden lg:flex lg:items-center lg:justify-center' : 'flex flex-col'}`}>
            {!selectedTicket ? (
              <div className="text-center text-slate-400 flex flex-col items-center">
                <Inbox className="h-16 w-16 mb-4 text-slate-300" />
                <p>Select a submission from the list to view details</p>
              </div>
            ) : (
              <Card className="border-none shadow-xl flex-1 flex flex-col overflow-hidden">
                <div className="p-6 bg-white border-b flex-shrink-0 relative">
                  <button className="lg:hidden absolute top-6 right-6 text-slate-400 hover:text-slate-700" onClick={() => setSelectedTicket(null)}>
                    &times; Close
                  </button>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full capitalize">{selectedTicket.type}</span>
                    <span className="text-sm text-slate-500 font-mono">{selectedTicket.tracking_id}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedTicket.subject}</h2>
                  <p className="text-slate-500">Submitted by <strong className="text-slate-700">{selectedTicket.is_anonymous ? 'Anonymous' : (selectedTicket.name || 'Anonymous')} {selectedTicket.phone ? `(${selectedTicket.phone})` : ''}</strong> on {new Date(selectedTicket.created_at).toLocaleString()}</p>
                </div>
                
                <div className="p-6 flex-1 overflow-auto bg-slate-50">
                  <div className="bg-white p-5 rounded-xl border shadow-sm mb-6">
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">Description</h4>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {selectedTicket.description}
                    </p>
                  </div>

                  {selectedTicket.hasMedia && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-slate-900 mb-3">Attached Evidence</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-200 h-32 rounded-lg flex items-center justify-center text-slate-400">
                          [Image Placeholder]
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-6 mt-6">
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">Provide Feedback & Update Status</h4>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <Label className="mb-2 block text-slate-600">Change Status</Label>
                          <Select defaultValue={selectedTicket.status.toLowerCase().includes('review') ? 'review' : selectedTicket.status.toLowerCase()}>
                            <SelectTrigger id="status-select" className="bg-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="review">Under Review</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="mb-2 block text-slate-600">Response / Feedback Message</Label>
                        <Textarea 
                          placeholder="Type your response to the user here. They will see this when they track their ID." 
                          className="min-h-[120px] bg-white resize-none"
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleUpdate} className="w-full md:w-auto px-8 bg-blue-600 hover:bg-blue-700">
                        Save & Send Feedback
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}