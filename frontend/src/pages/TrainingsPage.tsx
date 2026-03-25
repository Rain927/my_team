import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trainingApi } from '@/api/client';
import type { TrainingSession } from '@/api/client';

const emptyTraining: TrainingSession = {
  title: '', date: new Date().toISOString().split('T')[0],
  startTime: '09:00', endTime: '11:00', location: '',
  type: 'TEAM', description: '',
};

const trainingTypes = ['TEAM', 'INDIVIDUAL', 'TACTICAL', 'PHYSICAL', 'RECOVERY', 'MATCH_PREP'] as const;

const typeLabel: Record<string, string> = {
  TEAM: 'Team Training', INDIVIDUAL: 'Individual', TACTICAL: 'Tactical',
  PHYSICAL: 'Physical', RECOVERY: 'Recovery', MATCH_PREP: 'Match Prep',
};

const typeColor: Record<string, string> = {
  TEAM: 'bg-blue-100 text-blue-800', INDIVIDUAL: 'bg-purple-100 text-purple-800',
  TACTICAL: 'bg-orange-100 text-orange-800', PHYSICAL: 'bg-green-100 text-green-800',
  RECOVERY: 'bg-teal-100 text-teal-800', MATCH_PREP: 'bg-red-100 text-red-800',
};

export default function TrainingsPage() {
  const [trainings, setTrainings] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TrainingSession>(emptyTraining);
  const [isEdit, setIsEdit] = useState(false);

  const loadTrainings = () => {
    setLoading(true);
    trainingApi.getAll().then(setTrainings).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { loadTrainings(); }, []);

  const handleSave = async () => {
    try {
      if (isEdit && editing.id) {
        await trainingApi.update(editing.id, editing);
      } else {
        await trainingApi.create(editing);
      }
      setDialogOpen(false);
      loadTrainings();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this training?')) return;
    try { await trainingApi.delete(id); loadTrainings(); } catch (e) { console.error(e); }
  };

  const openCreate = () => { setEditing({ ...emptyTraining }); setIsEdit(false); setDialogOpen(true); };
  const openEdit = (t: TrainingSession) => { setEditing({ ...t }); setIsEdit(true); setDialogOpen(true); };

  const today = new Date().toISOString().split('T')[0];
  const upcoming = trainings.filter(t => t.date >= today);
  const past = trainings.filter(t => t.date < today);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Training Schedule</h1>
          <p className="text-muted-foreground">Plan and manage training sessions</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> New Training</Button>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground py-8">Loading...</p>
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Upcoming ({upcoming.length})</h2>
            {upcoming.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">No upcoming trainings</CardContent></Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcoming.map(t => (
                  <Card key={t.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{t.title}</CardTitle>
                        <Badge className={typeColor[t.type]} variant="secondary">{typeLabel[t.type]}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{t.date} · {t.startTime} - {t.endTime}</span>
                      </div>
                      {t.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{t.location}</span>
                        </div>
                      )}
                      {t.description && <p className="text-sm text-muted-foreground mt-2">{t.description}</p>}
                      <div className="flex justify-end gap-1 pt-2">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(t)}>
                          <Pencil className="h-3 w-3 mr-1" /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => t.id && handleDelete(t.id)}>
                          <Trash2 className="h-3 w-3 mr-1 text-destructive" /> Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {past.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3 text-muted-foreground">Past ({past.length})</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {past.map(t => (
                  <Card key={t.id} className="opacity-70">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{t.title}</CardTitle>
                        <Badge className={typeColor[t.type]} variant="secondary">{typeLabel[t.type]}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{t.date} · {t.startTime} - {t.endTime}</span>
                      </div>
                      {t.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{t.location}</span>
                        </div>
                      )}
                      <div className="flex justify-end gap-1 pt-2">
                        <Button variant="ghost" size="sm" onClick={() => t.id && handleDelete(t.id)}>
                          <Trash2 className="h-3 w-3 mr-1 text-destructive" /> Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Training' : 'New Training'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={editing.date} onChange={e => setEditing({ ...editing, date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={editing.type} onValueChange={v => setEditing({ ...editing, type: v as TrainingSession['type'] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {trainingTypes.map(t => <SelectItem key={t} value={t}>{typeLabel[t]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input type="time" value={editing.startTime} onChange={e => setEditing({ ...editing, startTime: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input type="time" value={editing.endTime} onChange={e => setEditing({ ...editing, endTime: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={editing.location} onChange={e => setEditing({ ...editing, location: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{isEdit ? 'Save Changes' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
