import { useState } from "react";
import "./SignupPage.css";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "DRIVER",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // clear field error while typing
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "/user/signup",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setMessage("🎉 Registration successful! Await admin approval.");

      setTimeout(() => navigate("/nt/login"), 1500);
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setMessage("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container signup-container">
      <h2>Create Account</h2>

      <form className="signup-form" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword}</span>
          )}
        </div>

        {/* Role */}
        <div className="form-group">
          <label>Role</label>

          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="role"
                value="DRIVER"
                checked={formData.role === "DRIVER"}
                onChange={handleChange}
              />
              Driver
            </label>

            <label>
              <input
                type="radio"
                name="role"
                value="OWNER"
                checked={formData.role === "OWNER"}
                onChange={handleChange}
              />
              Owner
            </label>

            {/* Remove ADMIN if public signup should not allow it */}
            <label>
              <input
                type="radio"
                name="role"
                value="ADMIN"
                checked={formData.role === "ADMIN"}
                onChange={handleChange}
              />
              Admin
            </label>
          </div>

          {errors.role && <span className="error">{errors.role}</span>}
        </div>

        {/* Submit */}
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        {/* Success Toast */}
        {message && <div className="toast success">{message}</div>}

        <p className="login-link">
          Already have an account? <a href="/login">Log In</a>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
