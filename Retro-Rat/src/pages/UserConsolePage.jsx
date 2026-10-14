import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../client";
import "./UserConsolePage.css";
import Img1 from "../assets/product-img.png";
import Img2 from "../assets/Image (Classic Game Console Controller).png";
import Img3 from "../assets/Image (Sony Walkman Cassette Player).png";

import LogoutBtnComp from "../components/LogOutBtnComponent";

import { Link, Route, Routes, NavLink } from "react-router-dom";

import SubmitProduct from "./SubmitProduct";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
	faPenToSquare,
	faClock,
	faEye,
	faTrashCan,
} from "@fortawesome/free-regular-svg-icons";

// Mock data — swap with real API calls later
const mockUser = {
	username: "TECHCOLLECTOR",
	memberSince: "January 2026",
	rating: 4.9,
	sales: 23,
	initial: "T",
};

const mockListings = [
	{
		id: 1,
		title: "VINTAGE MECHANICAL KEYBOARD",
		price: "R245.00",
		views: 156,
		comments: 5,
		status: "active",
		imgSrc: Img1,
	},
	{
		id: 2,
		title: "RETRO CRT MONITOR",
		price: "R180.00",
		views: null,
		comments: null,
		status: "pending",
		note: "AWAITING ADMIN APPROVAL",
		imgSrc: Img3,
	},
	{
		id: 3,
		title: "CLASSIC GAME CONTROLLER",
		price: "R85.00",
		views: 234,
		comments: 18,
		status: "sold",
		imgSrc: Img2,
	},
];

const mockNotifications = [];

const STATUS_CONFIG = {
	approved: { label: "ACTIVE", className: "status-active" },
	pending: { label: "PENDING REVIEW", className: "status-pending" },
	rejected: { label: "DENIED", className: "status-sold" },
};

function UserConsolePage({ id }) {
	// Updating the signed in user's name on the card
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		// Fetch "my" details.
		apiGet("/users/me")
			.then((data) => {
				setUser(data);
				setLoading(false);
			})
			.catch((err) => {
				console.error("Auth failed:", err);
				localStorage.removeItem("token");
				navigate("/login");
			});
	}, [navigate]);

	function handleLogout() {
		// get rid of token and force a hard refresh
		localStorage.removeItem("token");
		localStorage.removeItem("isAdmin");
		window.location.href = "/";
	}

	// fetch signed in user's listings
	const [listings, setListings] = useState([]);
	const [listingsLoading, setListingsLoading] = useState(true);
	const [listingsError, setListingsError] = useState(null);

	// saved items state
	const [savedItems, setSavedItems] = useState([]);
	const [savedLoading, setSavedLoading] = useState(false);
	const [savedError, setSavedError] = useState(null);

	const joinDate = user?.createdAt
		? new Date(user.createdAt).toLocaleString("default", {
				month: "long",
				year: "numeric",
			})
		: "Loading...";

	useEffect(() => {
		const fetchMyListings = async () => {
			try {
				const token = localStorage.getItem("token");
				const res = await fetch(`${import.meta.env.VITE_API_URL}/listings/my`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (!res.ok) throw new Error("Failed to fetch listings");
				const data = await res.json();
				setListings(data);
			} catch (error) {
				setListingsError(error.message);
			} finally {
				setListingsLoading(false);
			}
		};
		fetchMyListings();
	}, []);

	const [activeTab, setActiveTab] = useState("listings");
	// const [listings, setListings] = useState(mockListings);

	// fetch saved items when the saved tab opens
	useEffect(() => {
		if (activeTab !== "saved") return;

		setSavedLoading(true);
		setSavedError(null);
		apiGet("/saved")
			.then((data) => setSavedItems(data))
			.catch((err) => setSavedError(err.message))
			.finally(() => setSavedLoading(false));
	}, [activeTab]);

	const handleDelete = async (id) => {
		if (!confirm("Delete this listing? This can't be undone.")) return;
		try {
			const token = localStorage.getItem("token");
			const res = await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!res.ok) throw new Error("Failed to delete listing");
			setListings((prev) => prev.filter((l) => l._id !== id));
		} catch (err) {
			console.error("Couldn't delete listing:", err);
		}
	};

	const handleUnsave = async (listingId) => {
		try {
			await apiPost(`/saved/toggle/${listingId}`);
			setSavedItems((prev) => prev.filter((item) => item._id !== listingId));
		} catch (err) {
			console.error("Failed to unsave:", err);
		}
	};

	const renderListings = () => {
		const activeAndPending = listings.filter(
			(item) => item.status === "approved" || item.status === "pending",
		);

		return (
			<div className="uc-panel">
				<h2 className="uc-panel-title">Active and Pending Review Listings:</h2>
				{listingsLoading && <p>Loading...</p>}
				{listingsError && <p style={{ color: "red" }}>{listingsError}</p>}
				{!listingsLoading && activeAndPending.length === 0 && (
					<p className="uc-empty">
						No Active Listings or Listings Pending Review...
					</p>
				)}
				<div className="uc-listing-list">
					{activeAndPending.map((item) => {
						const statusCfg = STATUS_CONFIG[item.status];
						return (
							<div className="uc-listing-card" key={item._id}>
								<img
									src={item.mainImage}
									alt={item.productName}
									className="uc-listing-img"
								/>
								<div className="uc-listing-body">
									<div className="uc-listing-top">
										<div>
											<p className="uc-listing-title">{item.productName}</p>
											<p className="uc-listing-price">
												R{Number(item.price).toFixed(2)}
											</p>
											{item.status === "pending" && (
												<p className="uc-listing-note">
													<FontAwesomeIcon icon={faClock} />
													AWAITING ADMIN APPROVAL
												</p>
											)}
											<p className="uc-listing-meta">
												<span>
													<FontAwesomeIcon icon={faEye} />
													{item.views} VIEWS
												</span>
											</p>
										</div>
										<span className={`uc-status-badge ${statusCfg.className}`}>
											{statusCfg.label}
										</span>
									</div>
									<div className="uc-listing-actions">
										<button
											className="uc-btn uc-btn-view"
											onClick={() => navigate(`/product/${item._id}`)}>
											<FontAwesomeIcon icon={faEye} />
											<span>VIEW</span>
										</button>
										{item.status === "approved" && (
											<button
												className="uc-btn uc-btn-edit"
												onClick={() => navigate(`/sell/${item._id}`)}>
												<FontAwesomeIcon icon={faPenToSquare} />
												<span>EDIT</span>
											</button>
										)}
										<button
											className="uc-btn uc-btn-delete"
											// onClick={() => handleDelete(id)}>
											// onClick={() => handleDelete(item.id)}>
											onClick={() => handleDelete(item._id)}>
											<FontAwesomeIcon icon={faTrashCan} />
											<span>DELETE</span>
										</button>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	};

	const renderSaved = () => (
		<div className="uc-panel">
			<h2 className="uc-panel-title">SAVED ITEMS</h2>
			{savedLoading && <p>Loading...</p>}
			{savedError && <p style={{ color: "red" }}>{savedError}</p>}
			{!savedLoading && savedItems.length === 0 && (
				<p className="uc-empty">No saved items yet.</p>
			)}
			<div className="uc-listing-list">
				{savedItems.map((item) => (
					<div className="uc-listing-card" key={item._id}>
						<img
							src={item.mainImage}
							alt={item.productName}
							className="uc-listing-img"
						/>
						<div className="uc-listing-body">
							<div className="uc-listing-top">
								<div>
									<p className="uc-listing-title">{item.productName}</p>
									<p className="uc-listing-price">
										R{Number(item.price).toFixed(2)}
									</p>
									<p className="uc-listing-meta">
										<span>by {item.seller?.name || "unknown"}</span>
									</p>
								</div>
							</div>
							<div className="uc-listing-actions">
								<button className="uc-btn uc-btn-view">VIEW</button>
								<button
									className="uc-btn uc-btn-delete"
									onClick={() => handleUnsave(item._id)}>
									🗑 UNSAVE
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);

	const renderNotifications = () => (
		<div className="uc-panel">
			<h2 className="uc-panel-title">YOUR LISTINGS:</h2>
			{listingsLoading && <p>Loading...</p>}
			{listingsError && <p style={{ color: "red" }}>{listingsError}</p>}
			{!listingsLoading && listings.length === 0 && (
				<p className="uc-empty">No listings yet.</p>
			)}
			<div className="uc-listing-list">
				{listings.map((item) => {
					const statusCfg = STATUS_CONFIG[item.status] || {
						label: item.status.toUpperCase(),
						className: "status-pending",
					};
					return (
						<div className="uc-listing-card" key={item._id}>
							<img
								src={item.mainImage}
								alt={item.productName}
								className="uc-listing-img"
							/>
							<div className="uc-listing-body">
								<div className="uc-listing-top">
									<div>
										<p className="uc-listing-title">{item.productName}</p>
										<p className="uc-listing-price">
											R{Number(item.price).toFixed(2)}
										</p>
										{item.status === "pending" && (
											<p className="uc-listing-note">
												<span className="uc-clock-icon">🕐</span> AWAITING ADMIN
												APPROVAL
											</p>
										)}
										<p className="uc-listing-meta">
											<span>
												<span className="uc-icon">👁</span> {item.views} VIEWS
											</span>
										</p>
									</div>
									<span className={`uc-status-badge ${statusCfg.className}`}>
										{statusCfg.label}
									</span>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);

	return (
		<div className="uc-page">
			{/* Profile Header */}
			<div className="uc-profile-header">
				<div className="uc-profile-left">
					<div className="uc-avatar">
						{user?.name?.[0]?.toUpperCase() || "?"}
					</div>
					<div className="uc-profile-info">
						<h1 className="uc-username">{user?.name || "Loading..."}</h1>
						<p className="uc-member-since">
							MEMBER SINCE{" "}
							{user
								? new Date(user.createdAt).toLocaleDateString("en-US", {
										month: "long",
										year: "numeric",
									})
								: ""}
						</p>
						<p className="uc-stats">
							<span className="uc-star">★</span> {mockUser.rating} RATING
							<span className="uc-dot">•</span> {mockUser.sales} SALES
						</p>
					</div>
				</div>
				<div className="uc-card-btns">
					<LogoutBtnComp onLogout={handleLogout} />
					{/* <button className="uc-list-new-btn">LIST NEW ITEM</button> */}
					<NavLink to="/sell" className="uc-list-new-btn">
						LIST NEW ITEM
					</NavLink>
				</div>
				{/* Test 1: For Linking to Submit Form Page... - Need to do */}
				{/* <Link
					to={`./Pages/SubmitProduct.jsx`}
					style={{ textDecoration: "none", color: "inherit" }}>
					<button className="uc-list-new-btn">LIST NEW ITEM</button>
				</Link> */}
				{/* Test 2 */}
				{/* <Routes>
					<Route path="/sell" element={<SubmitProduct />}>
						<button className="uc-list-new-btn">LIST NEW ITEM</button>
					</Route>
				</Routes> */}
			</div>

			{/* Tab Navigation */}
			<div className="uc-tabs">
				<button
					className={`uc-tab ${activeTab === "notifications" ? "uc-tab-active" : ""}`}
					onClick={() => setActiveTab("notifications")}>
					♡ All Listings
				</button>
				<button
					className={`uc-tab ${activeTab === "listings" ? "uc-tab-active uc-tab-purple" : ""}`}
					onClick={() => setActiveTab("listings")}>
					📦 MY LISTINGS
				</button>
				<button
					className={`uc-tab ${activeTab === "saved" ? "uc-tab-active" : ""}`}
					onClick={() => setActiveTab("saved")}>
					♡ SAVED ITEMS
				</button>
			</div>

			{/* Tab Content */}
			<div className="uc-content">
				{activeTab === "listings" && renderListings()}
				{activeTab === "saved" && renderSaved()}
				{activeTab === "notifications" && renderNotifications()}
			</div>
		</div>
	);
}

export default UserConsolePage;
