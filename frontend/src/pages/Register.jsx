import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    // Clear error when user starts correcting the form
    if (error) {
      setError("");
    }
  };

  // Strong password validation
  const isStrongPassword = (password) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isStrongPassword(form.password)) {
      setError("Please enter a valid password.");
      return;
    }

    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card register-card">
        {/* Logo and heading */}
        <div className="login-logo">
          <div className="icon">🕊</div>

          <h4>Create Account</h4>

          <p>Register for the HopeNGO management system</p>
        </div>

        {/* Error */}
        {error && (
          <div className="login-error">
            <i className="bi bi-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="login-field">
            <label className="login-label">Full Name</label>

            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-person"></i>
              </span>

              <input
                type="text"
                name="fullname"
                className="login-input"
                placeholder="Enter your full name"
                value={form.fullname}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="login-field">
            <label className="login-label">Email</label>

            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-envelope"></i>
              </span>

              <input
                type="email"
                name="email"
                className="login-input"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Username */}
          <div className="login-field">
            <label className="login-label">Username</label>

            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-person-badge"></i>
              </span>

              <input
                type="text"
                name="username"
                className="login-input"
                placeholder="username"
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
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Register button */}
          <button type="submit" className="btn-login">
            <i className="bi bi-person-plus"></i>
            Create Account
          </button>
        </form>

        {/* Login link */}
        <div className="register-link">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
