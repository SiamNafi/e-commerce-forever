import React, { useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import UseShop from "../utils/UseShop";
import { toast } from "react-toastify";
import { ImSpinner9 } from "react-icons/im";
import axios from "axios";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivary_fee,
    products,
  } = UseShop();
  const [loading, setLoading] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivary_fee,
      };

      switch (method) {
        // api call for COD order
        case "cod": {
          const res = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } }
          );
          if (res.data.success) {
            setCartItems({});
            toast.success("Order Placed");
            navigate("/orders");
          } else {
            toast.error(res.data.message);
          }
          break;
        }
        case "stripe":
          {
            const responeStripe = await axios.post(
              backendUrl + "/api/order/stripe",
              orderData,
              { headers: { token } }
            );
            if (responeStripe.data.success) {
              const { session_url } = responeStripe.data;
              window.location.replace(session_url);
            } else {
              console.log(responeStripe.data.message);
              toast.error(responeStripe.data.message);
            }
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.log("error in order submit handler frontend");
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* --------------LEFT SIDE-------------- */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVARY"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            value={formData.firstName}
            name="firstName"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none"
            type="text"
            placeholder="First Name"
          />
          <input
            required
            onChange={onChangeHandler}
            value={formData.lastName}
            name="lastName"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none"
            type="text"
            placeholder="Last Name"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          value={formData.email}
          name="email"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none"
          type="email"
          placeholder="Email Adress"
        />
        <input
          required
          onChange={onChangeHandler}
          value={formData.street}
          name="street"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none"
          type="text"
          placeholder="Street Adress"
        />

        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            value={formData.city}
            name="city"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none"
            type="text"
            placeholder="City Name"
          />
          <input
            required
            onChange={onChangeHandler}
            value={formData.state}
            name="state"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none"
            type="text"
            placeholder="State Name"
          />
        </div>

        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            value={formData.zipcode}
            name="zipcode"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none"
            type="number"
            placeholder="Zip Code"
          />
          <input
            required
            onChange={onChangeHandler}
            value={formData.country}
            name="country"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none"
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          value={formData.phone}
          name="phone"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none"
          type="number"
          placeholder="Phone"
        />
      </div>
      {/* ------------righ side------------ */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>
        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          <div className="flex gap-3 flex-col sm:flex-row">
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border p-2 px-4 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "stripe" ? "bg-green-400" : ""
                }`}
              ></p>
              <img className="h-5 mx-4" src={assets.stripe_logo} alt="" />
            </div>
            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-4 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVARY
              </p>
            </div>
          </div>
          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black flex items-center justify-center text-white px-16 py-3 text-sm hover:bg-transparent border hover:border-black hover:text-black transition-all cursor-pointer"
            >
              {loading ? (
                <ImSpinner9 size={20} className="animate-spin" />
              ) : (
                "PLACE ORDER"
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
