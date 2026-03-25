import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, DollarSign } from 'lucide-react';
import Dashboard from '@/pages/Dashboard';
import PlayersPage from '@/pages/PlayersPage';
import TrainingsPage from '@/pages/TrainingsPage';
import FinancesPage from '@/pages/FinancesPage';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/players', icon: Users, label: 'Players' },
  { to: '/trainings', icon: Calendar, label: 'Training' },
  { to: '/finances', icon: DollarSign, label: 'Finances' },
];

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r bg-card">
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">FC</div>
            <span className="text-lg font-bold">Club Manager</span>
          </div>
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="pl-64">
          <div className="p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/players" element={<PlayersPage />} />
              <Route path="/trainings" element={<TrainingsPage />} />
              <Route path="/finances" element={<FinancesPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
