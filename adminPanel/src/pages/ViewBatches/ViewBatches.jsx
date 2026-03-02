import React, { useState, useEffect } from "react";

// THIRD PARTY
import { toast } from "react-toastify";
import { useParams, Link } from "react-router-dom";

// SERVICES
import { getAllBatches } from "../../services/batchService";

const ViewBatches = () => {
  const { productID } = useParams();
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    const loadBatchDetails = async () => {
      try {
        const response = await getAllBatches(productID);
        if (!response) return;
        const batches = response.data || [];
        setBatches(batches);
      } catch (error) {
        console.error("Error Fetching All Batches in FE:", error);
        toast.error("Failed to Fetch All Batches☹️, Try Again Later!");
      }
    };
    loadBatchDetails();
  }, [productID]);

  return (
    <div className="container p-5">
      <div className="d-flex align-items-center mb-4 position-relative">
        <Link to="/browseBatch" className="me-3">
          <i className="bi bi-arrow-left-circle-fill fs-3 text-primary"></i>
        </Link>
        <h3 className="flex-grow-1 text-center m-0">Batch Details</h3>
      </div>

      <div className="mb-3">
        <span className="fw-bold">Product ID: </span>
        <span>{productID}</span>
      </div>

      <div className="overflow-y-auto max-h-[500px] border rounded-lg shadow-md">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="text-center px-4 py-2 border">Batch ID</th>
              <th className="text-center px-4 py-2 border">Batch Number</th>
              <th className="text-center px-4 py-2 border">
                Manufactured Date
              </th>
              <th className="text-center px-4 py-2 border">Expiry Date</th>
              <th className="text-center px-4 py-2 border">
                Purchased Quantity
              </th>
              <th className="text-center px-4 py-2 border">
                Available Quantity
              </th>
              <th className="text-center px-4 py-2 border">Sold Quantity</th>
              <th className="text-center px-4 py-2 border">Cost Price</th>
              <th className="text-center px-4 py-2 border">Selling Price</th>
              <th className="text-center px-4 py-2 border">MRP</th>
              <th className="text-center px-4 py-2 border">HSN Code</th>
              <th className="text-center px-4 py-2 border">GST (%)</th>
            </tr>
          </thead>
          <tbody>
            {batches.length > 0 ? (
              batches.map((batch) => (
                <tr key={batch.batchID} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{batch.batchID}</td>
                  <td className="px-4 py-2 border">{batch.batchNumber}</td>
                  <td className="px-4 py-2 border">{batch.manufacturedDate}</td>
                  <td className="px-4 py-2 border">{batch.expiryDate}</td>
                  <td className="px-4 py-2 border">
                    {batch.purchasedQuantity}
                  </td>
                  <td className="px-4 py-2 border">
                    {batch.availableQuantity}
                  </td>
                  <td className="px-4 py-2 border">{batch.soldQuantity}</td>
                  <td className="px-4 py-2 border">₹{batch.costPrice}</td>
                  <td className="px-4 py-2 border">₹{batch.sellingPrice}</td>
                  <td className="px-4 py-2 border">₹{batch.marketPrice}</td>
                  <td className="px-4 py-2 border">{batch.hsnCode}</td>
                  <td className="px-4 py-2 border">{batch.gst}%</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={12}
                  className="text-center text-gray-500 py-6 font-medium"
                >
                  Batches are not found ☹️
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewBatches;
