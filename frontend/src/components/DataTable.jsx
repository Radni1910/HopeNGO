export default function DataTable({ columns, rows, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((r, i) => (
              <tr key={r.id ?? i}>
                {columns.map((c) => (
                  <td key={c.key}>{r[c.key] ?? "-"}</td>
                ))}
                <td>
                  <button className="btn small" onClick={() => onEdit?.(r)}>
                    Edit
                  </button>
                  <button
                    className="btn danger small"
                    onClick={() => onDelete?.(r)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="empty">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
