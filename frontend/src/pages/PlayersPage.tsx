import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { playerApi } from '@/api/client';
import type { Player } from '@/api/client';

const emptyPlayer: Player = {
  name: '', jerseyNumber: 0, position: 'GK', age: 18,
  nationality: '', salary: 0, status: 'ACTIVE', joinDate: new Date().toISOString().split('T')[0],
};

const positions = ['GK', 'CB', 'RB', 'LB', 'CDM', 'CM', 'CAM', 'RW', 'LW', 'ST', 'CF'];
const statuses = ['ACTIVE', 'INJURED', 'SUSPENDED', 'ON_LOAN', 'RETIRED'] as const;

const statusColor: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  INJURED: 'bg-red-100 text-red-800',
  SUSPENDED: 'bg-yellow-100 text-yellow-800',
  ON_LOAN: 'bg-blue-100 text-blue-800',
  RETIRED: 'bg-gray-100 text-gray-800',
};

const statusLabel: Record<string, string> = {
  ACTIVE: 'Active',
  INJURED: 'Injured',
  SUSPENDED: 'Suspended',
  ON_LOAN: 'On Loan',
  RETIRED: 'Retired',
};

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Player>(emptyPlayer);
  const [isEdit, setIsEdit] = useState(false);
  const [search, setSearch] = useState('');
  const [filterPosition, setFilterPosition] = useState('ALL');

  const loadPlayers = () => {
    setLoading(true);
    playerApi.getAll().then(setPlayers).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { loadPlayers(); }, []);

  const handleSave = async () => {
    try {
      if (isEdit && editing.id) {
        await playerApi.update(editing.id, editing);
      } else {
        await playerApi.create(editing);
      }
      setDialogOpen(false);
      loadPlayers();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this player?')) return;
    try {
      await playerApi.delete(id);
      loadPlayers();
    } catch (e) { console.error(e); }
  };

  const openCreate = () => { setEditing({ ...emptyPlayer }); setIsEdit(false); setDialogOpen(true); };
  const openEdit = (p: Player) => { setEditing({ ...p }); setIsEdit(true); setDialogOpen(true); };

  const filtered = players.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.position.toLowerCase().includes(search.toLowerCase()) ||
      p.nationality.toLowerCase().includes(search.toLowerCase());
    const matchPos = filterPosition === 'ALL' || p.position === filterPosition;
    return matchSearch && matchPos;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Players</h1>
          <p className="text-muted-foreground">Manage your squad</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Player</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Squad List ({filtered.length})</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-8 w-48" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Select value={filterPosition} onValueChange={setFilterPosition}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Positions</SelectItem>
                  {positions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Nationality</TableHead>
                  <TableHead>Salary (¥)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(player => (
                  <TableRow key={player.id}>
                    <TableCell className="font-bold">{player.jerseyNumber}</TableCell>
                    <TableCell className="font-medium">{player.name}</TableCell>
                    <TableCell>{player.position}</TableCell>
                    <TableCell>{player.age}</TableCell>
                    <TableCell>{player.nationality}</TableCell>
                    <TableCell>{player.salary?.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={statusColor[player.status]} variant="secondary">
                        {statusLabel[player.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(player)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => player.id && handleDelete(player.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No players found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Player' : 'Add Player'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Jersey #</Label>
                <Input type="number" value={editing.jerseyNumber} onChange={e => setEditing({ ...editing, jerseyNumber: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Position</Label>
                <Select value={editing.position} onValueChange={v => setEditing({ ...editing, position: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {positions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Age</Label>
                <Input type="number" value={editing.age} onChange={e => setEditing({ ...editing, age: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nationality</Label>
                <Input value={editing.nationality} onChange={e => setEditing({ ...editing, nationality: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Salary</Label>
                <Input type="number" value={editing.salary} onChange={e => setEditing({ ...editing, salary: parseFloat(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={editing.status} onValueChange={v => setEditing({ ...editing, status: v as Player['status'] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statuses.map(s => <SelectItem key={s} value={s}>{statusLabel[s]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Join Date</Label>
                <Input type="date" value={editing.joinDate} onChange={e => setEditing({ ...editing, joinDate: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={editing.phone || ''} onChange={e => setEditing({ ...editing, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={editing.email || ''} onChange={e => setEditing({ ...editing, email: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{isEdit ? 'Save Changes' : 'Add Player'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
