import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const UseShop = () => {
  const value = useContext(ShopContext);
  return value;
};

export default UseShop;
