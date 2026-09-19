import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UploadCloud,
  BarChart3,
  AlertOctagon,
  Sparkles,
  History,
  Activity,
  Layers
} from 'lucide-react';
import { useAnalysis } from '../../hooks/useAnalysis';

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const { activeDatasetName, stats, issues } = useAnalysis();

  const navLinks = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/upload',
      label: 'Upload Feedback',
      icon: UploadCloud,
      badge: 'New'
    },
    {
      to: '/analysis',
      label: 'Analysis Results',
      icon: BarChart3,
      badge: stats ? `${stats.totalFeedback}` : null
    },
    {
      to: '/issues',
      label: 'Issues & Insights',
      icon: AlertOctagon,
      badge: issues ? `${issues.length}` : null
    },
    {
      to: '/report',
      label: 'Improvement Report',
      icon: Sparkles,
      badge: 'AI'
    },
    {
      to: '/history',
      label: 'Report History',
      icon: History,
      badge: null
    }
  ];

  return (
    <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-badge">
          <Activity size={20} />
        </div>
        <div className="brand-info">
          <div className="brand-name">
            Sentix<span className="brand-tag">SaaS</span>
          </div>
          <span className="brand-subtitle">Feedback Intelligence</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Core Modules</div>
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onCloseMobile}
            >
              <Icon size={18} className="nav-icon" />
              <span>{link.label}</span>
              {link.badge && <span className="nav-badge">{link.badge}</span>}
            </NavLink>
          );
        })}

        <div className="nav-section-title" style={{ marginTop: '1.5rem' }}>
          Platform
        </div>
        <div className="nav-item" style={{ cursor: 'default', opacity: 0.7 }}>
          <Layers size={18} className="nav-icon" />
          <span>Vite + React 19</span>
          <span className="nav-badge" style={{ fontSize: '0.625rem' }}>v1.0</span>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="dataset-indicator-card">
          <div className="indicator-title">
            <span className="indicator-status-dot" />
            <span>Active Dataset (Simulated)</span>
          </div>
          <div className="indicator-dataset-name" title={activeDatasetName}>
            {activeDatasetName}
          </div>
        </div>
      </div>
    </aside>
  );
}
