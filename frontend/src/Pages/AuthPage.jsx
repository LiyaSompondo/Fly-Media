
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AuthPage.css";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // Simulate login success
      navigate("/dashboard");
    } else {
      // Simulate registration success → go to dashboard or back to login
      navigate("/dashboard");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? "Login" : "Register"}</h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="auth-input"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="auth-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            required
          />
          <button type="submit" className="auth-button">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="auth-toggle" onClick={toggleAuthMode}>
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}
