import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./SubmitProduct.css";
import { Container, Row, Col } from "react-bootstrap";

import Footer from "../components/Footer";
import UploadIcon from "../assets/uploadIcon.svg";
import TagIcon from "../assets/tagIcon.svg";
import CalenderIcon from "../assets/calenderIcon.svg";
import LocationIcon from "../assets/locationIcon.svg";
import DescriptionIcon from "../assets/descriptionIcon.svg";

import { uploadImage } from "../cloudinary";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

// TEMP: hardcoded seller until i get around to auth
const TEMP_SELLER_ID = "6a031ed938a375e22177a08c";

export default function SubmitProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productName: "",
    category: "",
    price: "",
    era: "",
    condition: "",
    location: "",
    description: "",
    shippingOptions: [],
    authenticityAgreed: false,
  });

  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleShippingChange = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      shippingOptions: checked
        ? [...prev.shippingOptions, value]
        : prev.shippingOptions.filter((opt) => opt !== value),
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }
    setError(null);
    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!imageFile) {
      setError("Please upload a product photo");
      return;
    }
    if (!form.authenticityAgreed) {
      setError("You must agree to the authenticity policy");
      return;
    }

    setSubmitting(true);
    try {
      // Step 1: Get the JWT passport
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication error: Please log in again.");
      }

      // Step 2: Get everything into a FormData object (This converts the image into a binary stream)
      const formDataPayload = new FormData();
      formDataPayload.append("productName", form.productName);
      formDataPayload.append("description", form.description);
      formDataPayload.append("price", form.price);
      formDataPayload.append("condition", form.condition);
      formDataPayload.append("era", form.era);
      formDataPayload.append("category", form.category);
      formDataPayload.append("location", form.location);

      // Append each shipping option
      form.shippingOptions.forEach((opt) => {
        formDataPayload.append("shippingOptions", opt);
      });

      // IMPORTANTTT: This name 'image' must perfectly match upload.single('image') in the backend route
      // because multer looks for that key to extract the file from the request
      formDataPayload.append("image", imageFile);

      // Step 3: Send the package at your backend pipeline
      const res = await fetch(`${import.meta.env.VITE_API_URL}/listings`, {
        method: "POST",
        headers: {
          // Present the token to the backend for verification and authentication
          Authorization: `Bearer ${token}`,
        },
        body: formDataPayload,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Submission failed");
      }

      window.gtag?.("event", "create_listing", {
        category: form.category,
        era: form.era,
        condition: form.condition,
        value: Number(form.price),
        currency: "ZAR",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="submit-page-wrapper">
      {/* Top Admin Alert Notice Strip Thingy*/}
      <div className="admin-verification-banner">
        {/* <span className="warning-icon">⚠️</span> */}
        <span className="warning-icon">
          <FontAwesomeIcon icon={faTriangleExclamation} />
        </span>
        <p>
          <strong>ADMIN VERIFICATION REQUIRED</strong>
          <br />
          All listings are reviewed by our team to ensure authenticity. You'll
          be notified once your item is approved (usually within 24 hours).
        </p>
      </div>

      <div className="submit-product-container">
        <div className="submit-product-header">
          <h1>list your vintage tech</h1>
          <p>Share your retro electronics with collectors</p>
        </div>

        <form className="submit-product-form" onSubmit={handleSubmit}>
          {/* === PRODUCT PHOTOS SECTION === */}
          <Container fluid className="form-section-card photo-card-bg">
            <div className="section-inner-padding">
              <label className="section-main-label">Product Photos</label>
              <div className="photo-instructions-box">
                <img
                  src={UploadIcon}
                  alt="Upload Icon"
                  className="upload-icon-graphic"
                />
                <p className="upload-text-main">
                  {imageFile
                    ? imageFile.name
                    : "DRAG AND DROP YOUR IMAGES HERE"}
                </p>
                <p className="upload-text-divider">OR</p>
                <button
                  type="button"
                  className="browse-files-btn"
                  onClick={() =>
                    document.getElementById("product-photo").click()
                  }
                >
                  Browse Files
                </button>
                <input
                  type="file"
                  id="product-photo"
                  name="product-photo"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <p className="upload-text-sub">
                  SUPPORTED: JPG, PNG (MAX 5MB EACH)
                </p>
              </div>
            </div>
          </Container>

          {/* === ITEM CLASSIFICATION SECTION === */}
          <Container fluid className="form-section-card classification-card-bg">
            <div className="section-inner-padding">
              <label className="section-main-label">Item Classification</label>

              <div className="product-details-form">
                <div className="input-group-block mb-4">
                  <label htmlFor="product-title" className="field-label">
                    <img
                      src={TagIcon}
                      alt="Tag"
                      className="label-inline-icon"
                    />{" "}
                    Item Name
                  </label>
                  <input
                    type="text"
                    id="product-title"
                    name="productName"
                    placeholder="e.g., IBM Model M Mechanical Keyboard"
                    value={form.productName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Row className="g-4 mb-4">
                  <Col md={6} className="d-flex flex-column gap-2">
                    <label htmlFor="product-category" className="field-label">
                      Category
                    </label>
                    <select
                      id="product-category"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select category</option>
                      <option value="Computers">Computers</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Audio">Audio</option>
                      <option value="Mobile">Mobile</option>
                      <option value="Video">Video</option>
                      <option value="Cameras">Cameras</option>
                      <option value="Other">Other</option>
                    </select>
                  </Col>
                  <Col md={6} className="d-flex flex-column gap-2">
                    <label htmlFor="product-price" className="field-label">
                      R PRICE (ZAR)
                    </label>
                    <input
                      type="number"
                      id="product-price"
                      name="price"
                      placeholder="245.00"
                      step="0.01"
                      value={form.price}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                <Row className="g-4">
                  <Col md={6} className="d-flex flex-column gap-2">
                    <label htmlFor="era-decade" className="field-label">
                      <img
                        src={CalenderIcon}
                        alt="Calendar"
                        className="label-inline-icon"
                      />{" "}
                      Era/Decade
                    </label>
                    <select
                      id="era-decade"
                      name="era"
                      value={form.era}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select era/decade</option>
                      <option value="70s">1970s</option>
                      <option value="80s">1980s</option>
                      <option value="90s">1990s</option>
                      <option value="2000s">2000s</option>
                    </select>
                  </Col>
                  <Col md={6} className="d-flex flex-column gap-2">
                    <label htmlFor="product-condition" className="field-label">
                      Condition
                    </label>
                    <select
                      id="product-condition"
                      name="condition"
                      value={form.condition}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select condition</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Great">Great</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Low">Low</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </Col>
                </Row>
              </div>
            </div>
          </Container>

          {/* === ITEM INFORMATION SECTION === */}
          <Container fluid className="form-section-card info-card-bg">
            <div className="section-inner-padding d-flex flex-column gap-4">
              <label className="section-main-label m-0">Item Information</label>

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
                  required
                >
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

              <div className="input-group-block">
                <label htmlFor="product-description" className="field-label">
                  <img
                    src={DescriptionIcon}
                    alt="Description"
                    className="label-inline-icon"
                  />{" "}
                  Description
                </label>
                <textarea
                  id="product-description"
                  name="description"
                  rows={4}
                  placeholder="Describe your item's history, condition, functionality, and any unique features..."
                  value={form.description}
                  onChange={handleChange}
                  required
                />
                <p className="form-tip-text">
                  TIP: INCLUDE DETAILS ABOUT FUNCTIONALITY, ORIGINAL PACKAGING,
                  AND ANY INCLUDED ACCESSORIES
                </p>
              </div>
            </div>
          </Container>

          {/* === SHIPPING OPTIONS SECTION === */}
          <Container fluid className="form-section-card shipping-card-bg">
            <div className="section-inner-padding d-flex flex-column gap-3">
              <label className="section-main-label m-0">Shipping Options</label>

              <ul className="shipping-options-list">
                <li>
                  <input
                    type="checkbox"
                    id="local-pickup"
                    value="local_pickup"
                    checked={form.shippingOptions.includes("local_pickup")}
                    onChange={handleShippingChange}
                  />
                  <label htmlFor="local-pickup">Local Pickup Available</label>
                </li>
                <li>
                  <input
                    type="checkbox"
                    id="domestic-shipping"
                    value="domestic"
                    checked={form.shippingOptions.includes("domestic")}
                    onChange={handleShippingChange}
                  />
                  <label htmlFor="domestic-shipping">
                    Domestic Shipping (SA)
                  </label>
                </li>
                <li>
                  <input
                    type="checkbox"
                    id="international-shipping"
                    value="international"
                    checked={form.shippingOptions.includes("international")}
                    onChange={handleShippingChange}
                  />
                  <label htmlFor="international-shipping">
                    International Shipping
                  </label>
                </li>
              </ul>

              <div className="terms-checkbox-strip">
                <input
                  type="checkbox"
                  id="authenticity-policy"
                  checked={form.authenticityAgreed}
                  onChange={(e) =>
                    setForm({ ...form, authenticityAgreed: e.target.checked })
                  }
                />
                <label htmlFor="authenticity-policy" className="terms-label">
                  I certify that this item is authentic vintage/retro tech and
                  accurately described. I agree to RetroTech Market's{" "}
                  <span className="yellow-highlight">SELLER TERMS</span> and{" "}
                  <span className="yellow-highlight">AUTHENTICITY POLICY</span>.
                </label>
              </div>
            </div>
          </Container>

          {error && <p className="error-display-msg">{error}</p>}

          {/* === ACTION CONTROLS FOOTER === */}
          <div className="submit-action-row">
            <button
              type="button"
              className="action-btn cancel-btn"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="action-btn process-btn"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit For Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
