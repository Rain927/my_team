import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { financeApi } from '@/api/client';
import type { Finance, FinanceSummary } from '@/api/client';

const emptyFinance: Finance = {
  type: 'INCOME', category: '', amount: 0,
  date: new Date().toISOString().split('T')[0], description: '', relatedPlayerName: '',
};

const incomeCategories = ['Sponsorship', 'Ticket Sales', 'Merchandise', 'Transfer', 'Broadcasting', 'Other'];
const expenseCategories = ['Salary', 'Facility', 'Equipment', 'Travel', 'Medical', 'Transfer Fee', 'Other'];

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];

export default function FinancesPage() {
  const [finances, setFinances] = useState<Finance[]>([]);
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Finance>(emptyFinance);
  const [isEdit, setIsEdit] = useState(false);
  const [filterType, setFilterType] = useState('ALL');

  const loadData = () => {
    setLoading(true);
    Promise.all([financeApi.getAll(), financeApi.summary()])
      .then(([f, s]) => { setFinances(f); setSummary(s); })
      .catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    try {
      if (isEdit && editing.id) {
        await financeApi.update(editing.id, editing);
      } else {
        await financeApi.create(editing);
      }
      setDialogOpen(false);
      loadData();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try { await financeApi.delete(id); loadData(); } catch (e) { console.error(e); }
  };

  const openCreate = () => { setEditing({ ...emptyFinance }); setIsEdit(false); setDialogOpen(true); };
  const openEdit = (f: Finance) => { setEditing({ ...f }); setIsEdit(true); setDialogOpen(true); };

  const filtered = filterType === 'ALL' ? finances : finances.filter(f => f.type === filterType);

  // Chart data
  const categoryData = finances.reduce<Record<string, { income: number; expense: number }>>((acc, f) => {
    if (!acc[f.category]) acc[f.category] = { income: 0, expense: 0 };
    if (f.type === 'INCOME') acc[f.category].income += f.amount;
    else acc[f.category].expense += f.amount;
    return acc;
  }, {});

  const barChartData = Object.entries(categoryData).map(([category, data]) => ({
    category, ...data,
  }));

  const expensePieData = finances.filter(f => f.type === 'EXPENSE').reduce<Record<string, number>>((acc, f) => {
    acc[f.category] = (acc[f.category] || 0) + f.amount;
    return acc;
  }, {});

  const pieData = Object.entries(expensePieData).map(([name, value]) => ({ name, value }));

  const categories = editing.type === 'INCOME' ? incomeCategories : expenseCategories;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finances</h1>
          <p className="text-muted-foreground">Track income and expenses</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Record</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">¥{summary?.totalIncome?.toLocaleString() ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">¥{summary?.totalExpense?.toLocaleString() ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${(summary?.balance ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ¥{summary?.balance?.toLocaleString() ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {barChartData.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Income vs Expenses by Category</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
                  <Bar dataKey="income" fill="#22c55e" name="Income" />
                  <Bar dataKey="expense" fill="#ef4444" name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          {pieData.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Expense Breakdown</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {pieData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction Records</CardTitle>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="INCOME">Income</SelectItem>
                <SelectItem value="EXPENSE">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount (¥)</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Related Player</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(f => (
                  <TableRow key={f.id}>
                    <TableCell>{f.date}</TableCell>
                    <TableCell>
                      <Badge variant={f.type === 'INCOME' ? 'default' : 'destructive'}>
                        {f.type === 'INCOME' ? 'Income' : 'Expense'}
                      </Badge>
                    </TableCell>
                    <TableCell>{f.category}</TableCell>
                    <TableCell className={f.type === 'INCOME' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                      {f.type === 'INCOME' ? '+' : '-'}¥{f.amount?.toLocaleString()}
                    </TableCell>
                    <TableCell className="max-w-48 truncate">{f.description}</TableCell>
                    <TableCell>{f.relatedPlayerName || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(f)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => f.id && handleDelete(f.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No records found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Record' : 'Add Record'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={editing.type} onValueChange={v => setEditing({ ...editing, type: v as Finance['type'], category: '' })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INCOME">Income</SelectItem>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={editing.category} onValueChange={v => setEditing({ ...editing, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Amount (¥)</Label>
                <Input type="number" value={editing.amount} onChange={e => setEditing({ ...editing, amount: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={editing.date} onChange={e => setEditing({ ...editing, date: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Related Player (optional)</Label>
              <Input value={editing.relatedPlayerName || ''} onChange={e => setEditing({ ...editing, relatedPlayerName: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{isEdit ? 'Save Changes' : 'Add Record'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
