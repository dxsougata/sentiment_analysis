import { UploadCloud } from 'lucide-react';
import EmptyState from './EmptyState';

export default function NeedAnalysis({
  title = 'No analysis yet',
  description = 'Upload a CSV of customer reviews to populate this view with live sentiment results.'
}) {
  return (
    <EmptyState
      icon={UploadCloud}
      title={title}
      description={description}
      actionText="Upload CSV"
      actionTo="/upload"
    />
  );
}
