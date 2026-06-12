import { useState } from "react";
import { supabase } from "../lib/supabase";
import "./Auth.css";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setMessage("Check your email to confirm your account!");
      }
    }
    setLoading(false);
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? "..." : isLogin ? "Login" : "Sign Up"}
        </button>
        {error && <p className="auth-error">{error}</p>}
        {message && <p className="auth-message">{message}</p>}
        <button
          type="button"
          className="auth-toggle"
          onClick={() => {
            setIsLogin(!isLogin);
            setError(null);
            setMessage(null);
          }}
        >
          {isLogin ? "Need an account? Sign up" : "Have an account? Login"}
        </button>
      </form>
    </div>
  );
}
