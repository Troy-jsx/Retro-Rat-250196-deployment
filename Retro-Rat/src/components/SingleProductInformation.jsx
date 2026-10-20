import React, { useState, useEffect } from "react";
import "./SingleProductInformation.css";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost, apiDelete } from "../client";
import FlagButtonComponent from "./FlagButtonComponent";
import SellerContainerComponent from "./SellerContainerComponent";
import DeleteItemBtn from "./AdminDeleteItemBtnComponent";

// FontAwesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

function SingleProductInformation({ listing }) {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);

  useEffect(() => {
    apiGet("/users/me")
      .then(setMe)
      .catch(() => setMe(null));
  }, []);

  // const isOwner =
  // 	me && listing.seller && (listing.seller._id || listing.seller) === me._id;

  const canManage =
    me &&
    (me.isAdmin ||
      (listing.seller && (listing.seller._id || listing.seller) === me._id));

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      apiGet("/users/me")
        .then((user) => setCurrentUser(user))
        .catch((err) => {
          console.log("Viewing as guest.");
        });
    }
  }, []);

  const sellerId = listing.seller?._id || listing.seller;
  const isOwner = currentUser && currentUser._id === sellerId;
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const canDelete = isOwner || isAdmin;

  const gaItem = {
    currency: "ZAR",
    value: Number(listing.price),
    items: [
      {
        item_id: listing._id,
        item_name: listing.productName,
        item_category: listing.category,
      },
    ],
  };

  const handleAddToCart = async () => {
    try {
      await apiPost("/cart", { listingId: listing._id });

      // GA4: added to cart
      window.gtag?.("event", "add_to_cart", gaItem);
    } catch (err) {
      console.error("Couldn't add to cart:", err);
    }
  };

  const handleBuyNow = async () => {
    try {
      await apiPost("/cart", { listingId: listing._id });

      // GA4: went straight to checkout
      window.gtag?.("event", "begin_checkout", gaItem);

      navigate("/cart");
    } catch (err) {
      console.error("Couldn't add to cart:", err);
    }
  };

  // Troy's Delete
  const handleDelete = async () => {
    if (!confirm("Delete this listing? This can't be undone.")) return;
    try {
      await apiDelete(`/listings/${listing._id}`);
      // navigate("/console");
      navigate("/account");
    } catch (err) {
      console.error("Couldn't delete listing:", err);
    }
  };

  // Tshedza's Delete
  const handleDeleteListing = async () => {
    // are you sure...
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing? This cannot be undone.",
    );
    if (!confirmDelete) return;

    try {
      // alright...
      await apiDelete(`/listings/${listing._id}`);

      // nothing to see, let's look at some other stuff
      navigate("/browse");
    } catch (err) {
      console.error("Failed to delete listing:", err);
      alert("Failed to delete the listing.");
    }
  };

  return (
    <div className="singleProductContainer">
      <div className="product-title-info">
        <div className="titleContainer">
          <div className="titleContainer1">
            <h1>{listing.productName}</h1>
            <div className="productTags">
              <p className="tag1">{listing.category}</p>
              <p className="tag2">{listing.era}</p>
              <p className="tag3">Verified</p>
            </div>
            <div className="locationText">
              <FontAwesomeIcon
                className="locationMarker"
                icon={faLocationDot}
              />
              <span className="location-text">{listing.location}</span>
            </div>
          </div>
          <div className="item-controls-container">
            {canManage && (
              <>
                {isOwner && (
                  <FlagButtonComponent
                    listingId={listing._id}
                    onClick={() => navigate(`/sell/${listing._id}`)}
                  />
                )}
                <DeleteItemBtn listingId={listing._id} onClick={handleDelete} />
              </>
            )}
          </div>
        </div>
        <SellerContainerComponent seller={listing.seller} />
        <div className="item-information">
          <div className="divider"></div>
          <div className="priceContainer">
            <h2 className="price">R{listing.price.toFixed(2)}</h2>
          </div>
          <div className="itemDescriptionContainer">
            <p>{listing.description}</p>
          </div>
        </div>
      </div>

      <div className="condition-and-buttons">
        <div className="divider"></div>
        <div className="conditionContainer">
          <h3 className="">CONDITION</h3>
          <div className="conditionTag">
            <span className="conditionText">
              {listing.condition?.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="buttonsContainer">
          <button className="addToCartButton" onClick={handleAddToCart}>
            <div className="cartIconContainer">
              <FontAwesomeIcon icon={faCartShopping} />
            </div>
            <span className="buttonText">ADD TO CART</span>
          </button>
          <button className="buyNowBtn" onClick={handleBuyNow}>
            <span className="buttonText">BUY NOW</span>
          </button>
          {/* {isOwner ? (
						<button
							className="buyNowBtn"
							onClick={() => navigate(`/edit/${listing._id}`)}>
							<span className="buttonText">EDIT LISTING</span>
						</button>
					) : (
						<>
							<button className="addToCartButton" onClick={handleAddToCart}>
								<div className="cartIconContainer">
									<FontAwesomeIcon icon={faCartShopping} />
								</div>
								<span className="buttonText">ADD TO CART</span>
							</button>
							<button className="buyNowBtn" onClick={handleBuyNow}>
								<span className="buttonText">BUY NOW</span>
							</button>
						</>
					)} */}
        </div>
      </div>
    </div>
  );
}

export default SingleProductInformation;
