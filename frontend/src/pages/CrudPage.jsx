
import { useEffect, useState } from 'react';
import { get, post, put, del } from '../api';
import DataTable from '../components/DataTable';

const configs = {
  donors: {
    title: 'Donors',
    endpoint: '/donors',
    columns: [['name', 'Name'], ['email', 'Email'], ['phone', 'Phone'], ['address', 'Address']],
    fields: [['name', 'Full Name', 'text'], ['email', 'Email', 'email'], ['phone', 'Phone', 'text'], ['address', 'Address', 'text']]
  },
  donations: {
    title: 'Donations',
    endpoint: '/donations',
    columns: [['donor_name', 'Donor'], ['amount', 'Amount'], ['donation_date', 'Date'], ['purpose', 'Purpose']],
    fields: [['donor_id', 'Donor ID', 'number'], ['amount', 'Amount', 'number'], ['donation_date', 'Date', 'date'], ['purpose', 'Purpose', 'text']]
  },
  volunteers: {
    title: 'Volunteers',
    endpoint: '/volunteers',
    columns: [['name', 'Name'], ['email', 'Email'], ['phone', 'Phone'], ['assigned_work', 'Assigned Work']],
    fields: [['name', 'Full Name', 'text'], ['email', 'Email', 'email'], ['phone', 'Phone', 'text'], ['assigned_work', 'Assigned Work', 'text']]
  },
  events: {
    title: 'Events',
    endpoint: '/events',
    columns: [['event_name', 'Event'], ['event_date', 'Date'], ['location', 'Location'], ['description', 'Description']],
    fields: [['event_name', 'Event Name', 'text'], ['event_date', 'Date', 'date'], ['location', 'Location', 'text'], ['description', 'Description', 'text']]
  },
  beneficiaries: {
    title: 'Beneficiaries',
    endpoint: '/beneficiaries',
    columns: [['name', 'Name'], ['age', 'Age'], ['help_type', 'Help Type'], ['contact', 'Contact']],
    fields: [['name', 'Full Name', 'text'], ['age', 'Age', 'number'], ['help_type', 'Help Type', 'text'], ['contact', 'Contact', 'text']]
  }
};

export default function CrudPage({ type }) {
  const c = configs[type];

  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load records whenever the selected section changes
  const load = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await get(c.endpoint);
      setRows(response.data);
    } catch (err) {
      console.error('Error loading records:', err);
      setError('Unable to load records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [type]);

  const save = async (e) => {
    e.preventDefault();

    try {
      if (editing) {
        await put(`${c.endpoint}/${editing.id}`, form);
      } else {
        await post(c.endpoint, form);
      }

      setEditing(null);
      setForm({});
      await load();
    } catch (err) {
      console.error('Error saving record:', err);
      alert('Unable to save record.');
    }
  };

  const remove = async (r) => {
    if (confirm('Delete this record?')) {
      try {
        await del(`${c.endpoint}/${r.id}`);
        await load();
      } catch (err) {
        console.error('Error deleting record:', err);
        alert('Unable to delete record.');
      }
    }
  };

  const cols = c.columns.map(([key, label]) => ({ key, label }));

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>{c.title}</h1>
          <p>Manage {c.title.toLowerCase()} records</p>
        </div>

        <button
          className="primary"
          onClick={() => {
            setEditing(null);
            setForm({});
          }}
        >
          + Add {c.title.slice(0, -1)}
        </button>
      </div>

      <div className="card">
        {loading ? (
          <p>Loading records...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <DataTable
            columns={cols}
            rows={rows}
            onEdit={(r) => {
              setEditing(r);
              setForm(r);
            }}
            onDelete={remove}
          />
        )}
      </div>

      <div className="card form">
        <h2>{editing ? 'Edit' : 'Add'} {c.title.slice(0, -1)}</h2>

        <form onSubmit={save}>
          {c.fields.map(([key, label, fieldType]) => (
            <div className="field" key={key}>
              <label>{label}</label>
              <input
                type={fieldType}
                required={!['email', 'address', 'description', 'contact'].includes(key)}
                value={form[key] ?? ''}
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
              />
            </div>
          ))}

          <button className="primary">
            {editing ? 'Update' : 'Save'}
          </button>

          {editing && (
            <button
              type="button"
              className="btn"
              onClick={() => {
                setEditing(null);
                setForm({});
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
