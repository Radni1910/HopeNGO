import { useEffect, useState } from "react";
import { get } from "../api";
import NotificationBell from "../components/NotificationBell";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { PieChart, Pie, Cell, Legend } from "recharts";

export default function Dashboard() {
  const [data, setData] = useState({
    stats: {},
    recentDonations: [],
    events: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await get("/dashboard");

      console.log("DASHBOARD DATA:", response.data);

      setData(response.data);
    } catch (err) {
      console.error("Dashboard error:", err);

      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  const stats = data.stats || {};

  /* -----------------------------------------
     USER
  ----------------------------------------- */

  const user = JSON.parse(localStorage.getItem("ngoUser") || "{}");

  const username = user.fullname || user.username || "Admin";

  /* -----------------------------------------
     MONTHLY DONATION DATA
  ----------------------------------------- */

  const monthlyData =
    stats.monthlyTrend ||
    stats.monthlyData ||
    data.monthlyTrend ||
    data.monthlyData ||
    [];

  /* -----------------------------------------
     PURPOSE DATA
  ----------------------------------------- */

  const purposeData = stats.byPurpose || data.byPurpose || [];

  /* -----------------------------------------
     FORMAT MONEY
  ----------------------------------------- */

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN");
  };

  /* -----------------------------------------
     DATE
  ----------------------------------------- */

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-IN");
  };

  /* -----------------------------------------
     EVENT DATE
  ----------------------------------------- */

  const getDay = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).getDate();
  };

  const getMonth = (date) => {
    if (!date) {
      return "---";
    }

    return new Date(date)
      .toLocaleString("en-US", {
        month: "short",
      })
      .toUpperCase();
  };

  return (
    <div className="dashboard">
      {/* =====================================
          HEADER
      ===================================== */}

      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {username}</h1>

          <p>
            Here's what's happening at <strong>HopeNGO</strong>.
          </p>
        </div>
      </div>

      {error && <div className="dashboard-error">{error}</div>}

      {/* =====================================
          METRIC CARDS
      ===================================== */}

      <div className="metric-grid">
        {/* TOTAL DONATIONS */}

        <div className="metric-card">
          <div className="metric-icon blue">
            <i className="bi bi-cash-stack"></i>
          </div>

          <div className="metric-content">
            <span>Total Donations</span>

            <h2>₹{formatAmount(stats.totalDonations)}</h2>

            <p>All time</p>
          </div>
        </div>

        {/* TOTAL DONORS */}

        <div className="metric-card">
          <div className="metric-icon green">
            <i className="bi bi-person-heart"></i>
          </div>

          <div className="metric-content">
            <span>Total Donors</span>

            <h2>{stats.donors || stats.totalDonors || 0}</h2>

            <p>Registered</p>
          </div>
        </div>

        {/* VOLUNTEERS */}

        <div className="metric-card">
          <div className="metric-icon amber">
            <i className="bi bi-people-fill"></i>
          </div>

          <div className="metric-content">
            <span>Volunteers</span>

            <h2>{stats.volunteers || stats.totalVolunteers || 0}</h2>

            <p>Active</p>
          </div>
        </div>

        {/* EVENTS */}

        <div className="metric-card">
          <div className="metric-icon purple">
            <i className="bi bi-calendar-event-fill"></i>
          </div>

          <div className="metric-content">
            <span>Events</span>

            <h2>{stats.events || stats.totalEvents || 0}</h2>

            <p>Total organised</p>
          </div>
        </div>
      </div>

      {/* =====================================
          CHARTS
      ===================================== */}

      <div className="dashboard-chart-grid">
        {/* MONTHLY DONATION TREND */}

        <div className="dashboard-card">
          <div className="card-title">
            <h2>Monthly Donation Trend</h2>
          </div>

          <div className="line-chart-container">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{
                    top: 10,
                    right: 20,
                    left: 10,
                    bottom: 10,
                  }}
                >
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) =>
                      `₹${Number(value).toLocaleString("en-IN")}`
                    }
                  />

                  <Tooltip
                    formatter={(value) =>
                      `₹${Number(value).toLocaleString("en-IN")}`
                    }
                  />

                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{
                      r: 5,
                      fill: "#2563eb",
                    }}
                    activeDot={{
                      r: 7,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty">
                <p>No monthly donation data available.</p>
              </div>
            )}
          </div>
        </div>

        {/* DONATIONS BY PURPOSE */}

        <div className="dashboard-card">
          <div className="card-title">
            <h2>Donations by Purpose</h2>
          </div>

          <div className="donut-chart-container">
            {purposeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={purposeData}
                    dataKey="total"
                    nameKey="purpose"
                    cx="50%"
                    cy="45%"
                    outerRadius={90}
                    innerRadius={50}
                    paddingAngle={3}
                  >
                    {purposeData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          [
                            "#2563eb",
                            "#16a34a",
                            "#f59e0b",
                            "#9333ea",
                            "#ef4444",
                          ][index % 5]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty">
                <p>No donation purpose data available.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================
          BOTTOM SECTION
      ===================================== */}

      <div className="dashboard-bottom-grid">
        {/* RECENT DONATIONS */}

        <div className="dashboard-card">
          <div className="card-title">
            <h2>Recent Donations</h2>
          </div>

          <div className="donation-table-wrapper">
            <table className="donation-table">
              <thead>
                <tr>
                  <th>DATE</th>

                  <th>DONOR</th>

                  <th>PURPOSE</th>

                  <th>AMOUNT</th>
                </tr>
              </thead>

              <tbody>
                {data.recentDonations?.length > 0 ? (
                  data.recentDonations.map((donation, index) => (
                    <tr key={index}>
                      <td>
                        {formatDate(donation.date || donation.donation_date)}
                      </td>

                      <td>
                        {donation.donor_name || donation.donor || "Donor"}
                      </td>

                      <td>
                        <span className="purpose-badge">
                          {donation.purpose || "General"}
                        </span>
                      </td>

                      <td className="amount">
                        ₹{formatAmount(donation.amount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-row">
                      No donations yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* UPCOMING EVENTS */}

        <div className="dashboard-card">
          <div className="card-title">
            <h2>Upcoming Events</h2>
          </div>

          <div className="events-list">
            {data.events?.length > 0 ? (
              data.events.map((event, index) => (
                <div className="event-item" key={index}>
                  <div className="event-date">
                    <span className="event-day">
                      {getDay(event.event_date || event.date)}
                    </span>

                    <span className="event-month">
                      {getMonth(event.event_date || event.date)}
                    </span>
                  </div>

                  <div className="event-details">
                    <h3>{event.event_name || event.name || "Event"}</h3>

                    <p>
                      <i className="bi bi-geo-alt"></i>

                      {event.location || "Location not specified"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-events">No upcoming events.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
