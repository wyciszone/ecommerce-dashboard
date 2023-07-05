import { useState, useEffect } from "react";
import { MainNav } from "@/components/MainNav";
import { UserNav } from "./components/UserNav";
import { navigationLinks } from "../../config/navigationLinks";

export const CustomersPage = () => {
  const [customersData, setCustomersData] = useState([]);
  const [editCustomerData, setEditCustomerData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const fetchCustomersData = () => {
    fetch("http://127.0.0.1:8000/customers")
      .then((res) => res.json())
      .then((data) => {
        setCustomersData(data);
      });
  };

  const deleteCustomer = (customerId) => {
    fetch(`http://127.0.0.1:8000/customers/${customerId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        fetchCustomersData();
      });
  };

  const editCustomer = (customerId) => {
    const customer = customersData.find((customer) => customer.id === customerId);
    setEditCustomerData(customer);
    setIsEditing(true);
  };

  const updateCustomer = (e) => {
    e.preventDefault();
    fetch(`http://127.0.0.1:8000/customers/${editCustomerData.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editCustomerData),
    })
      .then((res) => res.json())
      .then((updatedCustomer) => {
        console.log("Zaktualizowany klient:", updatedCustomer);
        setCustomersData((prevData) =>
          prevData.map((customer) =>
            customer.id === updatedCustomer.id ? updatedCustomer : customer
          )
        );
        setEditCustomerData({});
        setIsEditing(false); // To ukrywa formularz edycji
        window.alert("Successfully changed customer!");
      })
      .catch((error) => {
        console.error("Błąd podczas aktualizowania klienta:", error);
      });
  };

  

  useEffect(() => {
    fetchCustomersData();
  }, []);

  return (
    <div className="hidden flex-col md:flex">
      <div className="border-b-2 border-blue-500">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" links={navigationLinks} />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-4xl font-bold tracking-tight text-blue-800">Our Customers</h2>
        </div>
        <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
          <ul className="bg-gray-100 rounded-lg p-4">
            {customersData.map((item) => (
              <li key={item.id} className="bg-white rounded-lg p-4 shadow-md">
                <p className="text-gray-800">
                  <strong>First Name:</strong> {item.name}
                </p>
                <p className="text-gray-800">
                  <strong>Last Name:</strong> {item.surname}
                </p>
                <p className="text-gray-800">
                  <strong>Email Address:</strong> {item.email}
                </p>
                <p className="text-gray-800">
                  <strong>Phone Number:</strong> {item.phone_number}
                </p>
                <div className="mt-4">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    onClick={() => deleteCustomer(item.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md ml-2"
                    onClick={() => editCustomer(item.id, { name: "Updated Name" })}
                  >
                    Update
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {isEditing && (
          <form className="editForm" onSubmit={updateCustomer}>
            <input
              type="text"
              value={editCustomerData.name || ""}
              onChange={(e) =>
                setEditCustomerData({
                  ...editCustomerData,
                  name: e.target.value,
                })
              }
            />
            <input
              type="text"
              value={editCustomerData.surname || ""}
              onChange={(e) =>
                setEditCustomerData({
                  ...editCustomerData,
                  surname: e.target.value,
                })
              }
            />
            <input
              type="text"
              value={editCustomerData.email || ""}
              onChange={(e) =>
                setEditCustomerData({
                  ...editCustomerData,
                  email: e.target.value,
                })
              }
            />
            <input
              type="text"
              value={editCustomerData.address || ""}
              onChange={(e) =>
                setEditCustomerData({
                  ...editCustomerData,
                  address: e.target.value,
                })
              }
            />
            <button type="submit">Save changes</button>
          </form>
        )}
        </div>
      </div>
    </div>
  );
};
