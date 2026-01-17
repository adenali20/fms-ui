import { useState, useEffect } from 'react';
import './SignupPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../features/user/userThunks';
import { clearSignupState } from '../features/user/userSlice';
const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, signupSuccess } = useSelector(
    (state) => state.user
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'DRIVER',
  });

  const [localErrors, setLocalErrors] = useState({});

  useEffect(() => {
    return () => {
      dispatch(clearSignupState());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setLocalErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    dispatch(signupUser(formData, navigate));
  };

  return (
    <div className="container signup-container">
      <h2>Create Account</h2>

      <form className="signup-form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" onChange={handleChange} />
        {localErrors.name && <span className="error">{localErrors.name}</span>}

        <input name="email" placeholder="Email" onChange={handleChange} />
        {localErrors.email && <span className="error">{localErrors.email}</span>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        {localErrors.password && (
          <span className="error">{localErrors.password}</span>
        )}

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
        />
        {localErrors.confirmPassword && (
          <span className="error">{localErrors.confirmPassword}</span>
        )}

        <button disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        {signupSuccess && (
          <div className="toast success">
            🎉 Registration successful! Await admin approval.
          </div>
        )}

        {typeof error === 'string' && (
          <p className="error">{error}</p>
        )}
      </form>
    </div>
  );
};

export default SignupPage;
