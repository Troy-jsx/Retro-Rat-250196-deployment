import { useEffect, useState } from "react";
import "../pages/AdminConsolePage.css";
import ACBlockListItem from "./ACBlockListItem";

function ACReviewBlockPending() {
	// 1... Fetch Pending listings
	const [listings, setListings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchPending = async () => {
			try {
				const token = localStorage.getItem("token");
				// const res = await fetch("http://localhost:5001/api/listings", {
				// 	headers: { Authorization: `Bearer ${token}` },
				// });
				const res = await fetch(`${import.meta.env.VITE_API_URL}/listings/pending`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (!res.ok) throw new Error("Failed to fetch pending listings");
				const data = await res.json();
				setListings(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		fetchPending();
	}, []);

	// 2... Handle the approval of listings
	const handleApprove = async (id) => {
		const token = localStorage.getItem("token");
		await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ status: "approved" }),
		});
		setListings((prev) => prev.filter((l) => l._id !== id));
	};

	// 3... Handle the denial of listings
	const handleDeny = async (id) => {
		const token = localStorage.getItem("token");
		await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ status: "rejected" }),
		});
		setListings((prev) => prev.filter((l) => l._id !== id));
	};

	return (
		<div className="ac-main-block">
			<div className="ac-tab-title">
				<span className="tab-title">Pending Listings For Review</span>
			</div>
			<div className="ac-block-items-list">
				{loading && <p>Loading...</p>}
				{error && <p style={{ color: "red" }}>{error}</p>}
				{!loading && listings.length === 0 && <p>No pending listings.</p>}
				{listings.map((listing) => (
					<ACBlockListItem
						key={listing._id}
						listing={listing}
						onApprove={handleApprove}
						onDeny={handleDeny}
					/>
				))}
			</div>
		</div>
	);
}

export default ACReviewBlockPending;
