import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import TunePassword from "../components/TunePassword";
import { useToast } from "./ToastContext";

import "../pages/LoginPage.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [tunePassword, setTunePassword] = useState("--------");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const { showRetroToast, showErrorToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: tunePassword }),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        const failureMessage = data.error || "Something went wrong";
        setErrorMessage(failureMessage);

        // Trigger Error Toast!
        showErrorToast(failureMessage);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("isAdmin", data.isAdmin);

      // GA4: successful login
      window.gtag?.("event", "login", { method: "email" });

      // alert("Logged in successfully!"); UGLY LOCAL HOST TOAST
      showRetroToast("Logged in Successfully!");

      // navigate("/console"); // ← uncomment when ready
      navigate("/browse");
    } catch (error) {
      const connError = "Failed to connect to the server.";
      // setErrorMessage(connError); the red text

      //custom toast
      showErrorToast(connError);
    }
  };

  return (
    <Container fluid className="account-details-main-container">
      <Row className="account-details-container">
        <Col className="account-details">
          <h1>Account Details</h1>
          {/* {errorMessage && (
						<p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>
					)} */}

          <form id="auth-form" onSubmit={handleSubmit}>
            <div className="input-container">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. leeBernersTimCERN@hotmail.com"
                required
              />
            </div>
          </form>

          <TunePassword onPasswordChange={(pw) => setTunePassword(pw)} />
        </Col>
      </Row>

      <Container fluid className="login-sign-up-submit-button-container">
        <Row className="login-sign-up-submit-button">
          <Col className="login-submit-button">
            <button type="submit" form="auth-form">
              Log In Now!!
            </button>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
