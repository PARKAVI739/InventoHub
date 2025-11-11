import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await register(form);
      navigate('/', { replace: true });
    } catch (error) {
      showToast(error.message || 'Unable to create account', { type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <section className="card auth-card">
        <h2>Create your InventoHub account</h2>
        <p className="subtitle">Stay organized with an inventory workspace tailored for you.</p>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="registerName">Full name</label>
              <input
                id="registerName"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Alex Johnson"
                minLength={2}
                required
                autoComplete="name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="registerEmail">Email</label>
              <input
                id="registerEmail"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="registerPassword">Password</label>
              <input
                id="registerPassword"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                minLength={8}
                required
                autoComplete="new-password"
              />
              <small>Must be at least 8 characters.</small>
            </div>
            <div className="form-group">
              <label htmlFor="registerRole">Role</label>
              <select
                id="registerRole"
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin (first account only)</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn primary" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login">
            Sign in
          </Link>
        </p>
      </section>
    </div>
  );
};

export default RegisterPage;



