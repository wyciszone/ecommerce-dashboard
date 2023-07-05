import { useState, useEffect } from "react";
import { MainNav } from "@/components/MainNav";
import { UserNav } from "./components/UserNav";
import { navigationLinks } from "../../config/navigationLinks";

export const OrdersPage = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [editOrderData, setEditOrderData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const fetchOrdersData = () => {
    fetch("http://127.0.0.1:8000/orders")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setOrdersData(data);
      });
  };

  const deleteOrder = (order_id) => {
    fetch(`http://127.0.0.1:8000/orders/${order_id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        fetchOrdersData();
      });
  };
  

  const editOrder = (order_id) => {
    const order = ordersData.find((order) => order.id === order_id);
    setEditOrderData(order);
    setIsEditing(true);
  };
  

  const updateOrder = (e) => {
    e.preventDefault();
    const { id, customer, address, total } = editOrderData;
  
    const updatedOrderData = {
      customer: customer || "",
      address: address || "",
      total : total || "",
    };
  
    fetch(`http://127.0.0.1:8000/orders/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedOrderData),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Error: " + res.status);
        }
      })
      .then((updatedOrder) => {
        console.log("Updated:", updatedOrder);
        setOrdersData((prevData) =>
          prevData.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          )
        );
        setEditOrderData({});
        setIsEditing(false);
        window.alert("Successfully changed order!");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  

  useEffect(() => {
    fetchOrdersData();
  }, []);

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
          <ul>
            {ordersData.map((item) => (
              <li key={item.id}>
                <p>
                  <strong>Name</strong>
                  {item.customer}
                </p>
                <p>
                  <strong>Address</strong>
                  {item.address}
                </p>
                <p>
                  <strong>Total</strong>
                  {item.total}
                </p>
                <div className="mt-4">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    onClick={() => deleteOrder(item.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md ml-2"
                    onClick={() => editOrder(item.id)}
                  >
                    Update
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {isEditing && (
          <form className="editForm text-black" onSubmit={updateOrder}>
            <input
  type="text"
  value={editOrderData.customer || ""}
  onChange={(e) =>
    setEditOrderData({
      ...editOrderData,
      customer: e.target.value,
    })
  }
/>
            <input
              type="text"
              value={editOrderData.address || ""}
              onChange={(e) =>
                setEditOrderData({
                  ...editOrderData,
                  address: e.target.value,
                })
              }
            />

<input
  type="text"
  value={editOrderData.total || ""}
  onChange={(e) =>
    setEditOrderData({
      ...editOrderData,
      total: e.target.value,
    })
  }
/>
            <button className="text-white" type="submit">Save changes</button>
          </form>
        )}
        </div>
      </div>
    </div>
  );
};


