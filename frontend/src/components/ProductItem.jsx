import React from "react";
import UseShop from "../utils/UseShop";
import { Link } from "react-router-dom";
const ProductItem = ({ product }) => {
  const { _id, image, name, price } = product || {};
  const { currency } = UseShop();
  return (
    <Link className="text-gray-700 cursor-pointer" to={`/product/${_id}`}>
      <div className="overflow-hidden">
        <img
          src={image[0]}
          className="hover:scale-110 transition ease-in-out"
          alt=""
        />
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="text-sm font-medium">
        {currency}
        {price}
      </p>
    </Link>
  );
};

export default ProductItem;
