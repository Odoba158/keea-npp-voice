import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Plus, FileText, Clock, CheckCircle2 } from "lucide-react";

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setUser(session.user);
      fetchSubmissions(session.user.id);
    };
    checkAuth();
  }, [navigate]);

  const fetchSubmissions = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold text-slate-900">KEEA Voice</Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500 hidden md:block">{user?.email}</span>
          <Button variant="ghost" onClick={handleLogout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Submissions</h1>
            <p className="text-slate-500">Track and view your previous requests, complaints, and suggestions.</p>
          </div>
          <Link to="/submit">
            <Button className="shrink-0">
              <Plus className="mr-2 h-4 w-4" /> New Submission
            </Button>
          </Link>
        </div>

        {submissions.length === 0 ? (
          <Card className="border-dashed bg-transparent border-2">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
              <CardTitle className="mb-2">No Submissions Yet</CardTitle>
              <CardDescription className="mb-6">
                You haven't made any submissions yet. When you do, they will appear here.
              </CardDescription>
              <Link to="/submit">
                <Button>Make your first submission</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {submissions.map((sub) => (
              <Card key={sub.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="p-6 flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {sub.category}
                      </span>
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {new Date(sub.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{sub.subject}</h3>
                    <p className="text-muted-foreground line-clamp-2 text-sm">{sub.message}</p>
                    
                    {sub.admin_feedback && (
                      <div className="mt-4 p-3 bg-muted rounded-md text-sm border-l-4 border-primary">
                        <strong>Admin Feedback:</strong> {sub.admin_feedback}
                      </div>
                    )}
                  </div>
                  <div className="bg-muted/50 p-6 sm:w-48 flex flex-col items-start sm:items-end justify-center border-t sm:border-t-0 sm:border-l">
                    <div className="text-sm text-muted-foreground mb-1">Status</div>
                    <div className="font-medium flex items-center mb-4">
                      {sub.status === 'Resolved' && <CheckCircle2 className="text-green-500 mr-2 h-4 w-4" />}
                      {sub.status}
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">Tracking ID</div>
                    <div className="font-mono font-bold text-sm bg-background px-2 py-1 rounded border">
                      {sub.tracking_id || sub.id.substring(0, 8).toUpperCase()}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
