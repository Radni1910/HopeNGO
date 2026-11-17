export default function MetricCard({ title, value, icon }) {
  return (
    <div className="metric">
      <div>
        <p>{title}</p>
        <strong>{value}</strong>
      </div>
      <div className="metric-icon">{icon}</div>
    </div>
  );
}
