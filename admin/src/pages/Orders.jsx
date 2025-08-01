import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }
    try {
      const res = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );
      if (res.data.success) {
        setOrders(res.data.orders.reverse());
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Error fetching all orders(admin)", error.message);
    }
  };

  // update status
  const statusHandler = async (e, orderId) => {
    try {
      const res = await axios.post(
        backendUrl + "/api/order/status",
        {
          orderId,
          status: e.target.value,
        },
        { headers: { token } }
      );
      console.log(res.data);
      if (res.data.success) {
        await fetchAllOrders();
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("error in statusHanlder", error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {orders?.map((order, index) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
            key={index}
          >
            <img className="w-12" src={assets.parcel_icon} alt="" />
            <div>
              <div>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return (
                      <p className="py-0.5" key={index}>
                        {item?.name} X {item?.quantity}{" "}
                        <span>{item?.size}</span>
                      </p>
                    );
                  } else {
                    return (
                      <p className="py-0.5" key={index}>
                        {item?.name} X {item?.quantity}{" "}
                        <span>{item?.size} ,</span>
                      </p>
                    );
                  }
                })}
              </div>
              <p className="mt-3 mb-2 font-medium">
                {order?.address?.firstName + " " + order?.address?.lastName}
              </p>
              <div>
                <p>{order?.address?.street + ","}</p>
                <p>
                  {order?.address?.city +
                    ", " +
                    order?.address?.state +
                    ", " +
                    order?.address?.country +
                    ", " +
                    order?.address?.zipcode}
                </p>
              </div>
              <p>{order?.address?.phone}</p>
            </div>
            <div>
              <p className="text-sm sm:text-[15px]">
                Items: {order?.items?.length}
              </p>
              <p className="mt-3">Method: {order?.paymentMethod}</p>
              <p>Payment: {order?.payment ? "Done" : "Pending"}</p>
              <p>Date: {new Date(order?.date).toLocaleString()}</p>
            </div>
            <p className="text-sm sm:text-[15px]">
              {currency} {order?.amount}
            </p>
            <select
              onChange={(e) => statusHandler(e, order?._id)}
              value={order?.status}
              className="p-2 font-semibold"
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivary">Out for Delivary</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
