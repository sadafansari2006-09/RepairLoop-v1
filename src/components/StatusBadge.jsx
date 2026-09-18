const LABELS = {
  active: "Active",
  open: "Open",
  estimating: "Estimating",
  in_progress: "In progress",
  completed: "Completed",
};

export default function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{LABELS[status] ?? status}</span>;
}