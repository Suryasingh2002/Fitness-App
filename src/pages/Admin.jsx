import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "../components/ui/table";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "../components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "../components/ui/select";
import { Trash2, Pencil, Plus, Users, Dumbbell, Trophy, Activity } from "lucide-react";
import { toast } from "sonner";
import { CATEGORIES, categoryLabel, formatError } from "../lib/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

export default function Admin() {
  const { user } = useAuth();
  const [tab, setTab] = useState("analytics");

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-8" data-testid="admin-page">
      <div>
        <span className="label-uppercase text-primary">Admin Console</span>
        <h1 className="font-display text-4xl md:text-5xl leading-none mt-2">CONTROL CENTER</h1>
        <p className="text-muted-foreground mt-2">Signed in as {user.email}</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList data-testid="admin-tabs">
          <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
          <TabsTrigger value="users" data-testid="tab-users">Users</TabsTrigger>
          <TabsTrigger value="workouts" data-testid="tab-workouts">Workouts</TabsTrigger>
        </TabsList>
        <TabsContent value="analytics" className="mt-6"><AnalyticsTab /></TabsContent>
        <TabsContent value="users" className="mt-6"><UsersTab /></TabsContent>
        <TabsContent value="workouts" className="mt-6"><WorkoutsTab /></TabsContent>
      </Tabs>
    </div>
  );
}

function AnalyticsTab() {
  const [data, setData] = useState(null);
  useEffect(() => {
    api.get("/admin/analytics").then((r) => setData(r.data));
  }, []);
  if (!data) return <div className="text-muted-foreground">Loading...</div>;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard icon={Users} label="Total Users" value={data.total_users} />
        <MetricCard icon={Dumbbell} label="Workouts" value={data.total_workouts} />
        <MetricCard icon={Trophy} label="Challenges Joined" value={data.joined_challenges} />
        <MetricCard icon={Activity} label="Sessions Logged" value={data.total_sessions_logged} />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 tact-card">
          <h3 className="font-display text-xl leading-none mb-4">TOP WORKOUTS BY VIEWS</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={data.top_workouts} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis type="category" dataKey="title" width={120} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))" }} />
                <Bar dataKey="views" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="p-6 tact-card">
          <h3 className="font-display text-xl leading-none mb-4">WORKOUTS BY CATEGORY</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={data.categories}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="category" tickFormatter={(c) => categoryLabel(c)} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))" }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value }) {
  return (
    <div className="p-5 tact-card">
      <div className="flex items-center justify-between">
        <span className="label-uppercase text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="mt-3 font-display text-4xl leading-none">{value}</div>
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState([]);
  const { user: me } = useAuth();

  const load = () => api.get("/admin/users").then((r) => setUsers(r.data));
  useEffect(() => { load(); }, []);

  async function del(id) {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      load();
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail));
    }
  }

  return (
    <div className="tact-card overflow-hidden" data-testid="users-table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id} data-testid={`user-row-${u.id}`}>
              <TableCell className="font-medium">{u.name}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>
                <span className="label-uppercase text-primary">{u.role}</span>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {u.created_at ? new Date(u.created_at).toLocaleDateString() : "-"}
              </TableCell>
              <TableCell className="text-right">
                {u.id !== me.id && (
                  <Button size="sm" variant="outline" onClick={() => del(u.id)} data-testid={`delete-user-${u.id}`}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const BLANK_WORKOUT = {
  title: "", category: "weight_loss", duration: 20, difficulty: "beginner",
  trainer: "", video_url: "", thumbnail: "", description: "", goal: "burn_fat",
};

function WorkoutsTab() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK_WORKOUT);

  const load = () => api.get("/workouts?limit=100").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditing(null);
    setForm(BLANK_WORKOUT);
    setOpen(true);
  }
  function openEdit(w) {
    setEditing(w);
    setForm({ ...BLANK_WORKOUT, ...w });
    setOpen(true);
  }

  async function save() {
    try {
      if (editing) {
        await api.put(`/admin/workouts/${editing.id}`, { ...form, duration: Number(form.duration) });
        toast.success("Workout updated");
      } else {
        await api.post("/admin/workouts", { ...form, duration: Number(form.duration) });
        toast.success("Workout created");
      }
      setOpen(false);
      load();
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail));
    }
  }

  async function del(id) {
    if (!window.confirm("Delete this workout?")) return;
    try {
      await api.delete(`/admin/workouts/${id}`);
      toast.success("Deleted");
      load();
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate} data-testid="new-workout-btn">
          <Plus className="h-4 w-4 mr-2" /> New Workout
        </Button>
      </div>
      <div className="tact-card overflow-hidden" data-testid="workouts-table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Trainer</TableHead>
              <TableHead>Views</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((w) => (
              <TableRow key={w.id}>
                <TableCell className="font-medium">{w.title}</TableCell>
                <TableCell>{categoryLabel(w.category)}</TableCell>
                <TableCell className="capitalize">{w.difficulty}</TableCell>
                <TableCell>{w.duration} min</TableCell>
                <TableCell>{w.trainer}</TableCell>
                <TableCell>{w.views}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button size="sm" variant="outline" onClick={() => openEdit(w)} data-testid={`edit-workout-${w.id}`}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => del(w.id)} data-testid={`delete-workout-${w.id}`}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Workout" : "New Workout"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="wf-title" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={form.difficulty} onValueChange={(v) => setForm({ ...form, difficulty: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Duration (min)</Label>
              <Input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Trainer</Label>
              <Input value={form.trainer} onChange={(e) => setForm({ ...form, trainer: e.target.value })} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Video URL (YouTube embed)</Label>
              <Input value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="https://www.youtube.com/embed/..." />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Thumbnail URL</Label>
              <Input value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} data-testid="save-workout-btn">{editing ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
