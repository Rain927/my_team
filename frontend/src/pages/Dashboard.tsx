import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { playerApi, trainingApi, financeApi } from '@/api/client';
import type { Player, TrainingSession, FinanceSummary } from '@/api/client';

export default function Dashboard() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [upcomingTrainings, setUpcomingTrainings] = useState<TrainingSession[]>([]);
  const [financeSummary, setFinanceSummary] = useState<FinanceSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      playerApi.getAll(),
      trainingApi.upcoming(),
      financeApi.summary(),
    ]).then(([p, t, f]) => {
      setPlayers(p);
      setUpcomingTrainings(t.slice(0, 5));
      setFinanceSummary(f);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;
  }

  const activePlayers = players.filter(p => p.status === 'ACTIVE').length;
  const injuredPlayers = players.filter(p => p.status === 'INJURED').length;

  const statusColor: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-800',
    INJURED: 'bg-red-100 text-red-800',
    SUSPENDED: 'bg-yellow-100 text-yellow-800',
    ON_LOAN: 'bg-blue-100 text-blue-800',
    RETIRED: 'bg-gray-100 text-gray-800',
  };

  const trainingTypeLabel: Record<string, string> = {
    TEAM: 'Team Training',
    INDIVIDUAL: 'Individual',
    TACTICAL: 'Tactical',
    PHYSICAL: 'Physical',
    RECOVERY: 'Recovery',
    MATCH_PREP: 'Match Prep',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Football Club Management Overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{players.length}</div>
            <p className="text-xs text-muted-foreground">{activePlayers} active, {injuredPlayers} injured</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Trainings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingTrainings.length}</div>
            <p className="text-xs text-muted-foreground">scheduled sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ¥{financeSummary?.totalIncome?.toLocaleString() ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">{financeSummary?.transactionCount ?? 0} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${(financeSummary?.balance ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ¥{financeSummary?.balance?.toLocaleString() ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">current balance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Squad Overview</CardTitle>
            <Link to="/players" className="text-sm text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {players.slice(0, 6).map(player => (
                <div key={player.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold">
                      {player.jerseyNumber}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{player.name}</p>
                      <p className="text-xs text-muted-foreground">{player.position}</p>
                    </div>
                  </div>
                  <Badge className={statusColor[player.status]} variant="secondary">
                    {player.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Trainings</CardTitle>
            <Link to="/trainings" className="text-sm text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTrainings.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming trainings</p>
              ) : (
                upcomingTrainings.map(training => (
                  <div key={training.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{training.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {training.date} {training.startTime && `· ${training.startTime}`}
                      </p>
                    </div>
                    <Badge variant="outline">{trainingTypeLabel[training.type] || training.type}</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
