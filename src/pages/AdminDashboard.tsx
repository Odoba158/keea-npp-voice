import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { LogOut, Inbox, CheckCircle2, Search, Filter, LayoutDashboard, User, Users } from "lucide-react";

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState<"submissions" | "visitors">("submissions");
  
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [feedback, setFeedback] = useState("");
  const [tickets, setTickets] = useState<any[]>([]);
  const [visitors, setVisitors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchTickets();
    fetchVisitors();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*, media(file_url)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVisitors = async () => {
    try {
      const { data, error } = await supabase
        .from('site_visits')
        .select('*')
        .order('last_visited_at', { ascending: false });

      if (error) throw error;
      setVisitors(data || []);
    } catch (err) {
      console.error("Error fetching visitors:", err);
    }
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
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r text-muted-foreground flex flex-col hidden md:flex shrink-0 h-screen sticky top-0">
        <div className="h-16 flex items-center px-6 border-b bg-muted/50">
          <span className="text-foreground font-bold tracking-wider">KEEA ADMIN</span>
        </div>
        <div className="p-4 flex-1 space-y-2">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${activeView === 'submissions' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}
            onClick={() => setActiveView('submissions')}
          >
            <LayoutDashboard className="mr-3 h-5 w-5" /> Dashboard
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${activeView === 'visitors' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}
            onClick={() => setActiveView('visitors')}
          >
            <Users className="mr-3 h-5 w-5" /> Site Visitors
          </Button>
          <Button variant="ghost" className="w-full justify-start hover:bg-accent hover:text-accent-foreground">
            <User className="mr-3 h-5 w-5" /> My Profile
          </Button>
        </div>
        <div className="p-4 border-t mt-auto">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
              <LogOut className="mr-3 h-5 w-5" /> Logout
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        
        {/* Mobile Header & Nav */}
        <div className="md:hidden sticky top-0 z-20 bg-card border-b flex flex-col">
          <header className="text-foreground h-16 flex items-center justify-between px-4">
            <span className="font-bold tracking-wider">KEEA ADMIN</span>
            <Link to="/">
              <LogOut className="h-5 w-5 text-muted-foreground" />
            </Link>
          </header>
          <div className="flex border-t bg-muted/30">
            <button 
              className={`flex-1 py-3 text-sm font-medium flex justify-center items-center gap-2 transition-colors ${activeView === 'submissions' ? 'border-b-2 border-primary text-primary bg-background' : 'text-muted-foreground hover:bg-background/50'}`}
              onClick={() => {
                setActiveView('submissions');
                setSelectedTicket(null);
              }}
            >
              <LayoutDashboard className="h-4 w-4" /> Submissions
            </button>
            <button 
              className={`flex-1 py-3 text-sm font-medium flex justify-center items-center gap-2 transition-colors ${activeView === 'visitors' ? 'border-b-2 border-primary text-primary bg-background' : 'text-muted-foreground hover:bg-background/50'}`}
              onClick={() => setActiveView('visitors')}
            >
              <Users className="h-4 w-4" /> Visitors
            </button>
          </div>
        </div>

        {/* Topbar */}
        <header className="bg-card border-b h-16 flex items-center justify-between px-6 shrink-0 z-10">
          <h1 className="text-xl font-semibold text-foreground">
            {activeView === 'submissions' ? 'Submissions Overview' : 'Visitor Analytics'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search ID or keyword..." className="w-64 pl-9 bg-background" />
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
              JD
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-6 flex flex-col lg:flex-row gap-6">
          
          {activeView === 'submissions' ? (
            <>
              {/* List View for Submissions */}
              <div className={`w-full lg:w-1/2 xl:w-2/5 flex flex-col gap-4 ${selectedTicket ? 'hidden lg:flex' : 'flex'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Select defaultValue="all" onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] bg-background">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="review">Under Review</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" className="bg-background"><Filter className="h-4 w-4" /></Button>
                </div>

                <div className="space-y-3">
                  {isLoading ? (
                    <p className="text-center text-muted-foreground py-10">Loading submissions...</p>
                  ) : filteredTickets.length === 0 ? (
                    <p className="text-center text-muted-foreground py-10">No submissions found.</p>
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
                            <span className="text-xs font-mono font-bold text-muted-foreground bg-muted px-2 py-1 rounded">{ticket.tracking_id}</span>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              ticket.status === 'Resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                              ticket.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}>
                              {ticket.status}
                            </span>
                          </div>
                          <h3 className="font-semibold text-foreground mb-1">{ticket.subject}</h3>
                          <div className="flex justify-between items-center text-sm text-muted-foreground">
                            <span className="capitalize">{ticket.type} • {ticket.is_anonymous ? 'Anonymous' : (ticket.name || 'Anonymous')}</span>
                            <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              {/* Detail View for Submissions */}
              <div className={`w-full lg:w-1/2 xl:w-3/5 ${!selectedTicket ? 'hidden lg:flex lg:items-center lg:justify-center' : 'flex flex-col'}`}>
                {!selectedTicket ? (
                  <div className="text-center text-muted-foreground flex flex-col items-center">
                    <Inbox className="h-16 w-16 mb-4 opacity-20" />
                    <p>Select a submission from the list to view details</p>
                  </div>
                ) : (
                  <Card className="border-none shadow-xl flex-1 flex flex-col overflow-hidden bg-card">
                    <div className="p-6 border-b flex-shrink-0 relative">
                      <button className="lg:hidden absolute top-6 right-6 text-muted-foreground hover:text-foreground" onClick={() => setSelectedTicket(null)}>
                        &times; Close
                      </button>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full capitalize">{selectedTicket.type}</span>
                        <span className="text-sm text-muted-foreground font-mono">{selectedTicket.tracking_id}</span>
                      </div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">{selectedTicket.subject}</h2>
                      <p className="text-muted-foreground">Submitted by <strong className="text-foreground">{selectedTicket.is_anonymous ? 'Anonymous' : (selectedTicket.name || 'Anonymous')} {selectedTicket.phone ? `(${selectedTicket.phone})` : ''}</strong> on {new Date(selectedTicket.created_at).toLocaleString()}</p>
                      {selectedTicket.email && !selectedTicket.is_anonymous && (
                        <p className="text-muted-foreground mt-1 text-sm">
                          Email: <a href={`mailto:${selectedTicket.email}`} className="text-primary hover:underline">{selectedTicket.email}</a>
                        </p>
                      )}
                    </div>
                    
                    <div className="p-6 flex-1 overflow-auto bg-muted/20">
                      <div className="bg-card p-5 rounded-xl border shadow-sm mb-6">
                        <h4 className="text-sm font-semibold text-foreground mb-2">Description</h4>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {selectedTicket.description}
                        </p>
                      </div>

                      {selectedTicket.media && selectedTicket.media.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-foreground mb-3">Attached Evidence</h4>
                          <div className="grid grid-cols-2 gap-4">
                            {selectedTicket.media.map((m: any, idx: number) => (
                              <a key={idx} href={m.file_url} target="_blank" rel="noopener noreferrer" className="block">
                                {m.file_url.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
                                  <img src={m.file_url} alt="Evidence" className="w-full h-32 object-cover rounded-lg border hover:opacity-80 transition-opacity" />
                                ) : (
                                  <div className="bg-muted h-32 rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors border">
                                    <span className="font-medium">View File</span>
                                    <span className="text-xs mt-1">Opens in new tab</span>
                                  </div>
                                )}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="border-t pt-6 mt-6">
                        <h4 className="text-lg font-semibold text-foreground mb-4">Provide Feedback & Update Status</h4>
                        <div className="space-y-4">
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <Label className="mb-2 block text-muted-foreground">Change Status</Label>
                              <Select defaultValue={selectedTicket.status.toLowerCase().includes('review') ? 'review' : selectedTicket.status.toLowerCase()}>
                                <SelectTrigger id="status-select" className="bg-background">
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
                            <Label className="mb-2 block text-muted-foreground">Response / Feedback Message</Label>
                            <Textarea 
                              placeholder="Type your response to the user here. They will see this when they track their ID." 
                              className="min-h-[120px] bg-background resize-none"
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                            />
                          </div>
                          <Button onClick={handleUpdate} className="w-full md:w-auto px-8 bg-blue-600 hover:bg-blue-700 text-white">
                            Save & Send Feedback
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </>
          ) : (
            /* Visitors View */
            <div className="w-full">
              <Card>
                <CardHeader>
                  <CardTitle>Total Site Visits: {visitors.length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                        <tr>
                          <th className="px-6 py-3 rounded-tl-lg">Time</th>
                          <th className="px-6 py-3">Visitor ID (Unique)</th>
                          <th className="px-6 py-3 rounded-tr-lg">Device Info</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visitors.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="text-center py-6 text-muted-foreground">No visits recorded yet.</td>
                          </tr>
                        ) : (
                          visitors.map((visitor, idx) => (
                            <tr key={idx} className="border-b last:border-0 hover:bg-muted/30">
                              <td className="px-6 py-4 font-medium">
                                {new Date(visitor.last_visited_at).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 font-mono text-xs">
                                {visitor.visitor_id.substring(0, 8)}...
                              </td>
                              <td className="px-6 py-4 text-xs text-muted-foreground truncate max-w-xs">
                                {visitor.device_info}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}