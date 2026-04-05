"use client";

import { useState } from "react";
import styles from "./login.module.css";

export default function Login() {
  //false = Sign in
  //true = Sign up
  const [isSignUp, setIsSignUp] = useState(false);

  //Signin Data
  const [signinData, setSigninData] = useState({
    username: "",
    password: "",
  });

  //Signup Data
  const [signupData, setSignupData] = useState({
    username: "",
    password: "",
    repeatPassword: "",
    email: "",
  });

  const handleSignIn = async (e: React.FormEvent) => {
  e.preventDefault();

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(signinData),
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("token", data.token);
    alert("Login Success");
    window.location.href = "/dashboard";
  } else {
    alert(data.error);
  }
};

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if(signupData.password !== signupData.repeatPassword) {
        alert("Passwords do not match")
        return
    }

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: signupData.username,
        email: signupData.email,
        password: signupData.password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "/profile/setup";
    } else {
      alert(data.message || data.error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.container} ${
          isSignUp ? styles.rightPanelActive : ""
        }`}
      >
        {/* --- SIGN UP FORM CONTAINER --- */}
        <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
          <form className={styles.form} onSubmit={handleSignUp}>
            <h1 className={styles.title}>Create Account</h1>
            <input
              type="text"
              placeholder="Username"
              className={styles.input}
              value={signupData.username}
              onChange={(e) =>
                setSignupData({ ...signupData, username: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              className={styles.input}
              value={signupData.email}
              onChange={(e) =>
                setSignupData({ ...signupData, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              className={styles.input}
              value={signupData.password}
              onChange={(e) =>
                setSignupData({ ...signupData, password: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Repeat Password"
              className={styles.input}
              value={signupData.repeatPassword}
              onChange={(e) =>
                setSignupData({ ...signupData, repeatPassword: e.target.value })
              }
            />
            <button className={styles.button}>Sign Up</button>
          </form>
        </div>

        {/* --- SIGN IN FORM CONTAINER --- */}
        <div className={`${styles.formContainer} ${styles.signInContainer}`}>
          <form className={styles.form} onSubmit={handleSignIn}>
            <h1 className={styles.title}>Sign in</h1>
            <input
              type="text"
              placeholder="Username"
              className={styles.input}
              value={signinData.username}
              onChange={(e) =>
                setSigninData({ ...signinData, username: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              className={styles.input}
              value={signinData.password}
              onChange={(e) =>
                setSigninData({ ...signinData, password: e.target.value })
              }
            />
            <a href="#" style={{ margin: "15px 0", color: "#333", textDecoration: "none", fontSize: "14px" }}>
              Forgot your password?
            </a>
            <button className={styles.button}>Sign In</button>
          </form>
        </div>

        {/* --- OVERLAY CONTAINER --- */}
        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>
            {/* Left panel */}
            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
              <h1 className={styles.title} style={{ color: "white" }}>
                Welcome Back!
              </h1>
              <p style={{ margin: "20px 0 30px" }}>
                To keep connected with us please login with your personal info
              </p>
              <button
                className={`${styles.button} ${styles.ghost}`}
                onClick={() => setIsSignUp(false)}
              >
                Sign In
              </button>
            </div>

            {/* Right panel */}
            <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
              <h1 className={styles.title} style={{ color: "white" }}>
                Hello, Friend!
              </h1>
              <p style={{ margin: "20px 0 30px" }}>
                Enter your personal details and start journey with us
              </p>
              <button
                className={`${styles.button} ${styles.ghost}`}
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}