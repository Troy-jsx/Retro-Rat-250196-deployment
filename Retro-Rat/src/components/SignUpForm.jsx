import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import TunePassword from "../components/TunePassword";

import LocationIcon from "../assets/locationIcon.svg";
import { useToast } from "./ToastContext";
import "../pages/LoginPage.css";

export default function SignUpForm() {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [tunePassword, setTunePassword] = useState("--------");
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();

	const { showRetroToast, showErrorToast } = useToast();

	const [form, setForm] = useState({
		location: "",
	});

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	// Borrowed from Remmy's code on the Submit Product form
	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorMessage("");

		try {
			const response = await fetch("http://localhost:5001/api/users/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: username,
					email,
					password: tunePassword,
					location: form.location,
				}),
			});

			const data = await response.json();
			if (!response.ok) {
				const failureMsg = data.error || "Something went wrong";
                setErrorMessage(failureMsg);
                
                
                showErrorToast(failureMsg);
			}
			const successMsg = "Account created! Please log in."
			
			// alert(successMsg);
			console.log("Account Created Successfully");
			
			showRetroToast(successMsg);
			navigate("/login"); // ← redirect to login after signup
		} catch (error) {
			setErrorMessage("Failed to connect to the server.");
			showErrorToast("Failed to connect to the server.")
			console.log(errorMessage);
		}
	};

	return (
		<Container fluid className="account-details-main-container">
			<Row className="account-details-signup-container">
				<Col className="account-details">
					<h1>Account Details</h1>
					{/* {errorMessage && (
						<p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>
					)} */}

					<form id="auth-form" onSubmit={handleSubmit}>
						<div className="input-container">
							<label htmlFor="username">Username</label>
							<input
								type="text"
								id="username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								placeholder="e.g. RetroRat123"
								required
							/>
						</div>
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

						<div className="input-group-block">
							<label htmlFor="product-location" className="field-label">
								<img
									src={LocationIcon}
									alt="Location"
									className="label-inline-icon"
								/>{" "}
								Location
							</label>

							<select
								id="product-location"
								name="location"
								className="province-dropdown"
								value={form.location}
								onChange={handleChange}
								required>
								<option value="" disabled hidden>
									Select Province
								</option>
								<option value="Eastern Cape">Eastern Cape</option>
								<option value="Free State">Free State</option>
								<option value="Gauteng">Gauteng</option>
								<option value="KwaZulu-Natal">KwaZulu-Natal</option>
								<option value="Limpopo">Limpopo</option>
								<option value="Mpumalanga">Mpumalanga</option>
								<option value="Northern Cape">Northern Cape</option>
								<option value="North West">North West</option>
								<option value="Western Cape">Western Cape</option>
							</select>
						</div>
					</form>
				</Col>
			</Row>

			<Row className="password-details-container">
				<Col className="account-details">
					<h1>Password</h1>
					{/* {errorMessage && (
						<p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>
					)} */}
					<TunePassword onPasswordChange={(pw) => setTunePassword(pw)} />
				</Col>
			</Row>

			<Container fluid className="login-sign-up-submit-button-container">
				<Row className="login-sign-up-submit-button">
					<Col className="login-submit-button">
						<button type="submit" form="auth-form">
							Sign Up Today!!
						</button>
					</Col>
				</Row>
			</Container>
		</Container>
	);
}
