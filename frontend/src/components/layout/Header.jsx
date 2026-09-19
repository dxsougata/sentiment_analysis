import { Menu, UploadCloud, Bell, Building2, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAnalysis } from '../../hooks/useAnalysis';

export default function Header({ onToggleMobile }) {
  const { activeDatasetName } = useAnalysis();

  return (
    <header className="top-header">
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={onToggleMobile}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className="workspace-badge">
          <Building2 size={15} color="var(--primary)" />
          <span>Workspace:</span>
          <span className="workspace-org">Apex Retail Group</span>
        </div>

        <div className="workspace-badge" style={{ display: 'none' }} id="desktop-dataset-badge">
          <Database size={15} color="var(--text-muted)" />
          <span className="indicator-dataset-name" style={{ maxWidth: '180px' }}>
            {activeDatasetName}
          </span>
        </div>
      </div>

      <div className="header-right">
        <Link to="/upload" className="btn btn-primary btn-sm">
          <UploadCloud size={16} />
          <span>Upload Feedback</span>
        </Link>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.45rem', borderRadius: '50%' }}
          title="Notifications"
          aria-label="View notifications"
        >
          <Bell size={16} />
        </button>

        <div className="user-profile" title="Product Operations Lead">
          <div className="avatar">AM</div>
          <div className="user-details">
            <span className="user-name">Alex Morgan</span>
            <span className="user-role">Head of Customer Ops</span>
          </div>
        </div>
      </div>
    </header>
  );
}
