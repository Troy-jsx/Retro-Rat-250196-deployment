import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SingleProductImage from "../components/SingleProductImage";
import SingleProductInformation from "../components/SingleProductInformation";
import CommentSectionComponent from "../components/CommentSectionComponent";

import { apiGet } from "../client";

import "../pages/SingleProductView.css";
import "./SingleProductView.css";
import "../components/SingleProductImage.css";
import "../components/SingleProductInformation.css";

function SingleProductView() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiGet(`/listings/${id}`)
      .then((data) => {
        setListing(data);

        // GA4: product page viewed
        window.gtag?.("event", "view_item", {
          currency: "ZAR",
          value: Number(data.price),
          items: [
            {
              item_id: data._id,
              item_name: data.productName,
              item_category: data.category,
            },
          ],
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading product...</p>;
  if (error) return <p>Couldn't load product: {error}</p>;
  if (!listing) return <p>Product not found.</p>;

  return (
    <div className="singleProductView">
      <div className="mainContent">
        {/* <div className="breadcrumbs"></div> */}
        <div className="productDetails">
          <SingleProductImage listing={listing} />
          <SingleProductInformation listing={listing} />
        </div>
        <CommentSectionComponent listingId={listing._id} />
      </div>
    </div>
  );
}

export default SingleProductView;
