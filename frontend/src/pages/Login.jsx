import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await login(form);

      localStorage.setItem("ngoUser", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo and heading */}
        <div className="login-logo">
          <div className="icon">🕊</div>

          <h4>HopeNGO</h4>

          <p>Sign in to your admin dashboard</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="login-error">
            <i className="bi bi-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="login-field">
            <label className="login-label">Username</label>

            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-person"></i>
              </span>

              <input
                type="text"
                name="username"
                className="login-input"
                placeholder="Enter username"
                value={form.username}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-field password-field">
            <label className="login-label">Password</label>

            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-lock"></i>
              </span>

              <input
                type="password"
                name="password"
                className="login-input"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Login button */}
          <button type="submit" className="btn-login">
            <i className="bi bi-box-arrow-in-right"></i>
            Sign In
          </button>
        </form>

        {/* Register */}
        <div className="register-link">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
