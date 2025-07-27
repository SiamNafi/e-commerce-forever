import { createContext, useState } from "react";
import { products } from "../assets/assets";
export const ShopContext = createContext();

export const ShopContextProver = ({ children }) => {
  const currency = "$";
  const delivary_fee = 10;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const value = {
    products,
    currency,
    delivary_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
  };
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProver;
