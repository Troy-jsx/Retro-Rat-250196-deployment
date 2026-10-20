const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
app.use(cors());

app.use(express.json());

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.log(err));

// User routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// Listing routes
const listingRoutes = require("./routes/listingRoutes");
app.use("/api/listings", listingRoutes);

// Cart routes
const cartRoutes = require("./routes/cartRoutes");
app.use("/api/cart", cartRoutes);

const commentRoutes = require("./routes/commentRoutes");
app.use("/api/comments", commentRoutes);

const savedRoutes = require("./routes/savedRoutes");
app.use("/api/saved", savedRoutes);

// Sitemap for Google Search Console
const Listing = require("./models/Listing");

app.get("/sitemap.xml", async (req, res) => {
	const base = `${req.protocol}://${req.get("host")}`;
	const listings = await Listing.find({ status: "approved" }).select("_id updatedAt");

	const urls = [
		`<url><loc>${base}/</loc></url>`,
		`<url><loc>${base}/browse</loc></url>`,
		...listings.map(
			(l) =>
				`<url><loc>${base}/product/${l._id}</loc>` +
				(l.updatedAt ? `<lastmod>${l.updatedAt.toISOString().slice(0, 10)}</lastmod>` : "") +
				`</url>`,
		),
	];

	res.type("application/xml").send(
		'<?xml version="1.0" encoding="UTF-8"?>' +
			'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
			urls.join("") +
			"</urlset>",
	);
});

// Error handler: log the real error and send JSON instead of an HTML page
app.use((err, req, res, next) => {
	console.error(err);
	res.status(err.http_code || err.status || 500).json({
		error: err.message || "Something went wrong",
	});
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});