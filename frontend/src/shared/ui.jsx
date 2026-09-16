export const LoadingState = () => <div className="card text-sm text-slate-500">Memuat data...</div>;

export const EmptyState = ({ title = 'Data kosong' }) => (
  <div className="card text-sm text-slate-500">{title}</div>
);
