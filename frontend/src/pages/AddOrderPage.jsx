import React, { useState, useEffect } from "react";
import { MainNav } from "@/components/MainNav";
import { UserNav } from "@/components/UserNav";
import { navigationLinks } from "../config/navigationLinks";

export const AddOrderPage = () => {
  const [handleCustomer, setCustomer] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [total, setNewTotal] = useState("");

  const handleCustomerAddressChange = (event) => {
    setCustomerAddress(event.target.value);
  };
  
  const handleTotalChange = (event) => {
    setNewTotal(event.target.value);
  };
  
  const handleCustomerChange = (event) => {
    setCustomer(event.target.value);
  };
  
  
  const handleSubmit = (event) => {
    event.preventDefault();

    const orderData = {
      customer: handleCustomer,
      address: customerAddress,
      total: total,
    };
    

    fetch("http://127.0.0.1:8000/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCustomer("");
        setCustomerAddress("");
        setNewTotal("");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="hidden flex-col md:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" links={navigationLinks} />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        </div>
        <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
          <form onSubmit={handleSubmit}>
          <div>
              <label htmlFor="customerAddress">Customer Name:</label>
              <input
                type="text"
                id="customerName"
                value={handleCustomer}
                onChange={handleCustomerChange}
                className="text-black"
              />
            </div>
            <div>
              <label htmlFor="customerAddress">Customer Address:</label>
              <input
                type="text"
                id="customerAddress"
                value={customerAddress}
                onChange={handleCustomerAddressChange}
                className="text-black"
              />
            </div>
            <div>
              <label htmlFor="newTotal">Total:</label>
              <input
                type="text"
                id="total"
                value={total}
                onChange={handleTotalChange}
                className="text-black"
              />
            </div>
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
              Add Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
