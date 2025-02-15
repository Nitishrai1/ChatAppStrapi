import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import the CSS file

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async () => {
    const endpoint = isSignUp
      ? "http://localhost:1337/api/auth/local/register"
      : "http://localhost:1337/api/auth/local";

    const body = isSignUp
      ? { username: email.split("@")[0], email, password }
      : { identifier: email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.jwt) {
        localStorage.setItem("jwt", data.jwt);
        alert("Authentication successful!");
        navigate("/chat");
      } else {
        alert("Authentication failed: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isSignUp ? "Create an Account" : "Welcome Back"}</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />

        <button onClick={handleAuth} className="login-button">
          {isSignUp ? "Sign Up" : "Login"}
        </button>

        <p className="toggle-text">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <span onClick={() => setIsSignUp(!isSignUp)} className="toggle-link">
            {isSignUp ? "Login here" : "Sign up now"}
          </span>
        </p>
      </div>
    </div>
  );
}
