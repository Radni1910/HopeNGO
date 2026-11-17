import { useEffect, useState } from "react";
import { get } from "../api";
export default function Reports() {
  const [d, setD] = useState({});
  useEffect(() => {
    get("/reports").then((r) => setD(r.data));
  }, []);
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Reports</h1>
          <p>Summary of NGO performance</p>
        </div>
      </div>
      <div className="metrics">
        <div className="metric">
          <div>
            <p>Total Donations</p>
            <strong>
              ₹{Number(d.totalDonations || 0).toLocaleString("en-IN")}
            </strong>
          </div>
        </div>
        <div className="metric">
          <div>
            <p>Donation Count</p>
            <strong>{d.donationCount || 0}</strong>
          </div>
        </div>
        <div className="metric">
          <div>
            <p>Events</p>
            <strong>{d.eventCount || 0}</strong>
          </div>
        </div>
      </div>
      <div className="card">
        <h2>Donations by Purpose</h2>
        {(d.byPurpose || []).map((x) => (
          <div className="report-row" key={x.purpose}>
            <span>{x.purpose}</span>
            <b>₹{Number(x.total).toLocaleString("en-IN")}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
