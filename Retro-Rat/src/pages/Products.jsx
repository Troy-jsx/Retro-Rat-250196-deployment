import React, { useEffect, useState, useMemo } from "react";
import ProductCard from "../components/ProductCard";
import "./Products.css";
import usePageMeta from "../usePageMeta";
import { Container, Row } from "react-bootstrap";
import FilterBar from "../components/FilterBar";
import Footer from "../components/Footer";
import { apiGet } from "../client";
import TetrisBackground from "../components/TetrisBackground";

//import Img1 from "../assets/product-img.png"; //NOTE: TEMP, until we get something decided on for images.

/*filter labels -> schema values  category and condition match the schema 
im not gonna touch the filter bar so ima do this
*/
const ERA_MAP = {
  "2000S": "2000s",
  "1990S": "90s",
  "1980S": "80s",
  "1970S": "70s",
};

const toTitleCase = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

//all filter labels per wave: for "everything in this wave is selected"
const WAVES = {
  category: [
    "ALL",
    "COMPUTERS",
    "GAMING",
    "AUDIO",
    "MOBILE",
    "VIDEO",
    "CAMERAS",
  ],
  era: ["ALL", "2000S", "1990S", "1980S", "1970S"],
  condition: ["ALL", "EXCELLENT", "GREAT", "MODERATE", "LOW", "POOR"],
};
// BUUUUUUUNCHA DUMMY TEXT
// const DUMMY_LISTINGS = [
// 	{ _id: "1", productName: "Nintendo 64 Console", category: "Gaming", era: "90s", condition: "Excellent", price: 1500.00, seller: { name: "RetroGamer99" }, mainImage: "https://placehold.co/400x300/5E35B1/FFF?text=N64" },
// 	{ _id: "2", productName: "Sony Walkman TPS-L2", category: "Audio", era: "80s", condition: "Great", price: 2450.00, seller: { name: "AudioVintage" }, mainImage: "https://placehold.co/400x300/111111/FFF?text=Walkman" },
// 	{ _id: "3", productName: "Commodore 64", category: "Computers", era: "80s", condition: "Moderate", price: 1800.50, seller: { name: "TechCollector" }, mainImage: "https://placehold.co/400x300/E83B3B/FFF?text=Commodore+64" },
// 	{ _id: "4", productName: "Motorola Razr V3 (Pink)", category: "Mobile", era: "2000s", condition: "Excellent", price: 850.00, seller: { name: "Y2K_Vault" }, mainImage: "https://placehold.co/400x300/FF9D00/FFF?text=Razr+V3" },
// 	{ _id: "5", productName: "Polaroid Sun 600", category: "Cameras", era: "80s", condition: "Great", price: 650.00, seller: { name: "ShutterBug" }, mainImage: "https://placehold.co/400x300/38C938/FFF?text=Polaroid" },
// 	{ _id: "6", productName: "Atari 2600", category: "Gaming", era: "70s", condition: "Low", price: 1100.00, seller: { name: "ArcadeKing" }, mainImage: "https://placehold.co/400x300/00B7EB/FFF?text=Atari+2600" },
// 	{ _id: "7", productName: "Sony Discman D-50", category: "Audio", era: "90s", condition: "Poor", price: 250.00, seller: { name: "AudioVintage" }, mainImage: "https://placehold.co/400x300/2B5DF2/FFF?text=Discman" },
// 	{ _id: "8", productName: "Game Boy Color (Atomic Purple)", category: "Gaming", era: "90s", condition: "Excellent", price: 1850.00, seller: { name: "HandheldHero" }, mainImage: "https://placehold.co/400x300/9B2BF2/FFF?text=GBC+Purple" },
// 	{ _id: "9", productName: "IBM ThinkPad 701C", category: "Computers", era: "90s", condition: "Great", price: 3200.00, seller: { name: "TechCollector" }, mainImage: "https://placehold.co/400x300/5E35B1/FFF?text=ThinkPad" },
// 	{ _id: "10", productName: "Nokia 3310", category: "Mobile", era: "2000s", condition: "Excellent", price: 400.00, seller: { name: "BrickPhones" }, mainImage: "https://placehold.co/400x300/111111/FFF?text=Nokia+3310" },
// 	{ _id: "11", productName: "JVC VHS Camcorder", category: "Video", era: "90s", condition: "Moderate", price: 550.00, seller: { name: "TapeHead" }, mainImage: "https://placehold.co/400x300/E83B3B/FFF?text=Camcorder" },
// 	{ _id: "12", productName: "Apple Macintosh Classic", category: "Computers", era: "90s", condition: "Great", price: 4500.00, seller: { name: "MacFanatic" }, mainImage: "https://placehold.co/400x300/FF9D00/FFF?text=Mac+Classic" },
// 	{ _id: "13", productName: "Sega Genesis", category: "Gaming", era: "90s", condition: "Moderate", price: 900.00, seller: { name: "RetroGamer99" }, mainImage: "https://placehold.co/400x300/FFD500/FFF?text=Sega+Genesis" },
// 	{ _id: "14", productName: "Pioneer Boombox", category: "Audio", era: "80s", condition: "Low", price: 1200.00, seller: { name: "StreetBeats" }, mainImage: "https://placehold.co/400x300/38C938/FFF?text=Boombox" },
// 	{ _id: "15", productName: "Canon AE-1 Program", category: "Cameras", era: "80s", condition: "Excellent", price: 2100.00, seller: { name: "ShutterBug" }, mainImage: "https://placehold.co/400x300/00B7EB/FFF?text=Canon+AE-1" },
// 	{ _id: "16", productName: "Sony Trinitron CRT TV", category: "Video", era: "80s", condition: "Great", price: 1800.00, seller: { name: "TubeTech" }, mainImage: "https://placehold.co/400x300/2B5DF2/FFF?text=Trinitron" },
// 	{ _id: "17", productName: "BlackBerry Curve", category: "Mobile", era: "2000s", condition: "Moderate", price: 350.00, seller: { name: "Y2K_Vault" }, mainImage: "https://placehold.co/400x300/9B2BF2/FFF?text=BlackBerry" },
// 	{ _id: "18", productName: "Nintendo Entertainment System", category: "Gaming", era: "80s", condition: "Excellent", price: 2500.00, seller: { name: "ArcadeKing" }, mainImage: "https://placehold.co/400x300/5E35B1/FFF?text=NES" }
// ];

export default function ProductsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    // --- TEMPORARY DUMMY DATA LOADER FOR BACKGROUND TESTING ---
    // setLoading(true);
    // setTimeout(() => {
    // 	setListings(DUMMY_LISTINGS);
    // 	setLoading(false);
    // }, 800); // Fakes an 800ms API loading time

    apiGet("/listings")
      .then((data) => setListings(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredListings = useMemo(() => {
    const tagSet = new Set(selectedTags);

    //for each wave figure out which schema values are selected- if "ALL" is in the wave or nothing is selected, we don't filter on that wave.
    const waveFilter = (waveName, transform) => {
      const tags = WAVES[waveName];
      const selectedInWave = tags.filter((t) => tagSet.has(t));

      if (selectedInWave.length === 0 || selectedInWave.includes("ALL")) {
        return null;
      }

      return new Set(selectedInWave.map(transform).filter(Boolean));
    };

    const categoryFilter = waveFilter("category", toTitleCase);
    const eraFilter = waveFilter("era", (t) => ERA_MAP[t]);
    const conditionFilter = waveFilter("condition", toTitleCase);

    return listings.filter((l) => {
      if (categoryFilter && !categoryFilter.has(l.category)) return false;
      if (eraFilter && !eraFilter.has(l.era)) return false;
      if (conditionFilter && !conditionFilter.has(l.condition)) return false;
      return true;
    });
  }, [listings, selectedTags]);

  usePageMeta(
    "Browse Retro Electronics for Sale | Retro Rat",
    "Shop vintage gaming consoles, cassette players, classic computers and cameras from verified South African sellers. Every listing checked by our team.",
  );

  return (
    <div className="tetris-page-wrapper">
      <TetrisBackground />
      <Container fluid className="product-main-content">
        <Container fluid className="product-header">
          <div className="header-text">
            <h1>Welcome to Retro Rat</h1>
            <p>
              Buy and sell authentic retro electronics from verified collectors
            </p>
          </div>
        </Container>

        <FilterBar onFilterChange={setSelectedTags} />

        <Row className="product-card-container">
          {
            loading && (
              <p className="error-text">Loading listings...</p>
            ) /*{} makes it a js expression in the html, this is just a one line if statement basically */
          }
          {
            error && (
              <p className="error-text">Couldn't load listings: {error}</p>
            ) /*again another one wow*/
          }
          {!loading && !error && filteredListings.length === 0 && (
            <p className="error-text">
              {listings.length === 0
                ? "No listings yet. Check back soon."
                : "No listings match your filters."}
            </p>
          )}
          <div className="product-card-masonry">
            {filteredListings.map((listing) => (
              <ProductCard
                key={listing._id} //react prop, used to know if something is the same or not when reloading the component.
                id={listing._id} //the actual id property of the listing
                title={listing.productName} //rest of this stuff just follows the schema
                year={listing.era}
                username={listing.seller?.name || "unknown"} //if no name then show unknown
                price={`R${listing.price.toFixed(2)}`} //formatting done here*******
                condition={listing.condition}
                imgSrc={listing.mainImage} //we gonna get back to this (listing.mainImage is the actual thing to go here)
              />
            ))}
          </div>
        </Row>
      </Container>
    </div>
  );
}
