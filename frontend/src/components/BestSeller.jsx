import React, { useEffect, useState } from "react";
import Title from "./Title";
import UseShop from "../utils/UseShop";
import ProductItem from "./ProductItem";

const BestSeller = () => {
  const { products } = UseShop();
  const [bestProducts, setBestProducts] = useState([]);
  useEffect(() => {
    const filtered = products.filter((item) => item.bestseller);
    setBestProducts(filtered);
  }, [products]);
  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"BEST"} text2={"SELLER"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor,
          molestias aut quibusdam atque nulla numquam laboriosam quo quidem
          aliquam enim, maiores delectus repellat harum perspiciatis porro rerum
          consectetur rem asperiores?
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {bestProducts.map((product, index) => (
          <ProductItem key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
