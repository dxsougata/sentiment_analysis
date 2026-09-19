import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Toast from '../common/Toast';
import { useAnalysis } from '../../hooks/useAnalysis';

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toast } = useAnalysis();

  return (
    <div className="app-shell">
      <Sidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="main-wrapper">
        <Header onToggleMobile={() => setMobileOpen(!mobileOpen)} />
        <main className="page-container">
          <Outlet />
        </main>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
