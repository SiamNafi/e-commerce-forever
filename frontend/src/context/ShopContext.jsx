import { createContext } from "react";
import { products } from "../assets/assets";
export const ShopContext = createContext();

export const ShopContextProver = ({ children }) => {
  const currency = "$";
  const delivary_fee = 10;
  const value = {
    products,
    currency,
    delivary_fee,
  };
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProver;
