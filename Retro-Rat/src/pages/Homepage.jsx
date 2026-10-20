import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import "./Homepage.css";
import { apiGet } from "../client";
import bootRatWhite from "../assets/bootRatWhite.svg";
import ProductCard from "../components/ProductCard";
import { useToast } from "../components/ToastContext";
import TetrisWrapper from "../components/TetrisWrapper";

export default function Homepage() {
  const [listings, setListings] = useState([]);
  // const [isToastOpen, setIsToastOpen] = useState(false);
  const navigate = useNavigate();
  const { showErrorToast } = useToast();

  // AUTH CHECK SYSTEM: Redirecting verified people, flashing an error to freeloaders
  // I'm not fluent in ruotes but from what i saw this is my roughtest guess @Troy-jsx
  const handleListingButtonClick = () => {
    const isLoggedIn = !!localStorage.getItem("token");
    if (isLoggedIn) {
      navigate("/account"); // ??????
    } else {
      // 3. Trigger the premium Win95 error popup with a dynamic button!
      showErrorToast(
        "Unauthorized Entry! You must be logged in to create a marketplace listing.",
        { label: "Take me to Login", route: "/login" },
      );
    }
  };

  const handleStatusButtonClick = () => {
    const isLoggedIn = !!localStorage.getItem("token");
    if (isLoggedIn) {
      navigate("/account"); // Placeholder to take them to view status of posted listings, i know this is the route for admins but i dunno the user route
    } else {
      showErrorToast(
        "Unauthorized Entry! You must authenticate your collector account to access this content.",
        { label: "Take me to Login", route: "/login" },
      );
    }
  };

  useEffect(() => {
    apiGet("/listings").then((data) => setListings(data));
  }, []);

  usePageMeta(
    "Retro Rat | Buy & Sell Retro Electronics in South Africa",
    "South Africa's marketplace for retro electronics. Buy and sell vintage consoles, cassette players, CRT monitors and classic computers, priced in rands.",
  );

  return (
    <div className="home-container">
      <div className="home-content">
        {/* === HERO SECTION === */}
        <Container fluid className="hero-section">
          <div className="hero-overlay">
            <div className="hero-img-container">
              <img src={bootRatWhite} alt="Boot Rat" className="hero-image" />
            </div>
            <div className="hero-footer">
              <div className="hero-text">
                <h1>Vintage Market Place</h1>
                <p>
                  Buy and sell authentic retro electronics from verified
                  collectors
                </p>
              </div>
              <button
                className="browse-button"
                onClick={() => navigate("/browse")}
              >
                Browse Now!
              </button>
            </div>
          </div>
        </Container>

        {/* === POPULAR SECTION === */}
        <TetrisWrapper bgColor="#5b2c91">
          <Container fluid className="popular-section">
            <div className="section-inner-wrapper">
              <div className="popular-banner">
                <div className="popular-text">
                  <h2>popular tech on the marketplace</h2>
                  <p>These are some popular items from fellow Vendors!!</p>
                </div>
              </div>

              {/*maps mapping across columns natively so cards sit side-by-side */}
              <Row className="popular-items justify-content-center">
                {listings.slice(0, 3).map((listing) => (
                  <Col
                    md={4}
                    key={listing._id}
                    className="d-flex justify-content-center mb-4"
                  >
                    <ProductCard
                      id={listing._id}
                      title={listing.productName}
                      year={listing.era}
                      username={listing.seller?.name || "unknown"}
                      price={`R${listing.price.toFixed(2)}`}
                      condition={listing.condition}
                      imgSrc={listing.mainImage}
                    />
                  </Col>
                ))}
                {/* Fallbacks if  database has less than 3 thingys */}
                {listings.length < 2 && (
                  <Col md={4} className="d-flex justify-content-center mb-4">
                    Insert Card
                  </Col>
                )}
                {listings.length < 3 && (
                  <Col md={4} className="d-flex justify-content-center mb-4">
                    Insert Card
                  </Col>
                )}
              </Row>

              <div className="view-listed-btn">
                <button onClick={() => navigate("/browse")}>
                  View Listed items!!
                </button>
              </div>
            </div>
          </Container>
        </TetrisWrapper>

        {/* === JOIN SECTION === */}
        <Container fluid className="join-section">
          <div className="section-inner-wrapper">
            <Row className="flex-column gap-4">
              <Col xs={12}>
                <div className="join-banner">
                  <div className="join-text-banner">
                    <h2>become a vendor and sell your tech</h2>
                    <p>join our community of vintage tech enthusiasts</p>
                  </div>
                </div>
              </Col>

              <Col xs={12}>
                <div className="join-hero">
                  <div className="join-content">
                    <div className="join-text">
                      <h2>
                        Log In or Register to become a fellow vendor or
                        collector!!
                      </h2>
                      <p>Start buying and selling now!!</p>
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={12}>
                <div className="join-btn-container">
                  <button onClick={() => navigate("/login/signup")}>
                    Sign Up
                  </button>
                  <button onClick={() => navigate("/login")}>Log In</button>
                </div>
              </Col>
            </Row>
          </div>
        </Container>

        {/* === ALREADY A MEMBER SECTION === */}
        <TetrisWrapper bgColor="#0B8C8C">
          <Container fluid className="already-a-member-section">
            <div className="section-inner-wrapper">
              <Row className="flex-column gap-4">
                <Col xs={12}>
                  <div className="already-banner">
                    <div className="already-text">
                      <h2>Already A Member??</h2>
                      <p>
                        Add your items to sell and View Your Listings for
                        pending approval!
                      </p>
                    </div>
                  </div>
                </Col>

                <Col xs={12}>
                  <Row className="g-4">
                    <Col md={6} className="d-flex flex-column gap-4">
                      <div className="already-col add-your-listing">
                        <div className="text-container">
                          <div className="title-text">
                            <h2>Add and Sell your items!!</h2>
                            <p>Upload your items and get selling!</p>
                          </div>
                        </div>
                      </div>
                      <button
                        className="already-action-btn"
                        onClick={handleListingButtonClick}
                      >
                        Add your listing!!
                      </button>
                    </Col>

                    <Col md={6} className="d-flex flex-column gap-4">
                      <div className="already-col view-product-approval-status">
                        <div className="text-container">
                          <div className="title-text">
                            <h2>Unsure if people are buying your items yet?</h2>
                            <p>
                              View your listings approval status and check if
                              your items are selling yet!!
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        className="already-action-btn"
                        onClick={handleStatusButtonClick}
                      >
                        View Your Product approval Status!!
                      </button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </Container>
        </TetrisWrapper>
      </div>

      {/* // This stays on screen and shows TWO buttons: "Take me to Login" and "OK". */}
    </div>
  );
}
