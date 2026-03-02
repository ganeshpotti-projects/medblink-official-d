import React, { useState } from "react";

// THIRD PARTY
import { toast } from "react-toastify";
import { addBatch } from "../../services/batchService";
import { Link, useParams } from "react-router-dom";
import { getProductsList } from "../../services/productService";

const AddBatch = () => {
  const { productID } = useParams();

  const [data, setData] = useState({
    batchNumber: "",
    manufacturedDate: "",
    expiryDate: "",
    pack: "",
    purchasedQuantity: "",
    costPrice: "",
    sellingPrice: "",
    marketPrice: "",
    hsnCode: "",
    gst: "",
  });

  const [loading, setLoading] = useState(false);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const batchData = {
      ...data,
      productID: productID,
    };
    try {
      setLoading(true);
      const response = await addBatch(batchData);
      if (!response) return;
      setLoading(false);

      toast.success("Batch saved successfully 🎉");
      setData({
        batchNumber: "",
        manufacturedDate: "",
        expiryDate: "",
        pack: "",
        purchasedQuantity: "",
        costPrice: "",
        sellingPrice: "",
        marketPrice: "",
        hsnCode: "",
        gst: "",
      });

      const productsResponse = await getProductsList();
      if (!productsResponse) return;
    } catch (error) {
      console.error("Error Saving Batch in FE:", error);
      toast.error("Failed to Save Batch☹️, Try Again Later!");
    }
  };

  return (
    <div className="mx-5 my-5">
      <div className="row justify-content-left">
        <div className="col-lg-10 col-md-12 col-sm-12">
          <div className="card-body">
            <div className="d-flex align-items-center position-relative mb-5">
              <Link to="/browseBatch" className="me-3">
                <i className="bi bi-arrow-left-circle-fill fs-3 text-primary"></i>
              </Link>
              <h3 className=" flex-grow-1 text-center m-0">
                Add Batch{" "}
                <span>
                  <i className="bi bi-box-seam-fill"></i>
                </span>
              </h3>
            </div>

            <form id="registrationForm" onSubmit={onSubmitHandler}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-bold">
                  BatchNumber
                </label>
                <input
                  type="text"
                  name="batchNumber"
                  value={data.batchNumber}
                  className="form-control"
                  id="batchNumber"
                  placeholder="Eg: ABC1234, ZF123A etc..."
                  onChange={onChangeHandler}
                  required
                />
              </div>

              <div className=" mb-3 ">
                <label
                  htmlFor="manufacturedDate"
                  className="form-label fw-bold"
                >
                  Manufactured Date
                </label>
                <input
                  type="date"
                  id="manufacturedDate"
                  name="manufacturedDate"
                  className="form-control"
                  value={data.manufacturedDate}
                  onChange={onChangeHandler}
                  required
                />
              </div>

              <div className="mb-3">
                <label
                  htmlFor="manufacturedDate"
                  className="form-label fw-bold"
                >
                  Expiry Date
                </label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  className="form-control"
                  value={data.expiryDate}
                  onChange={onChangeHandler}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-bold">
                  Pack
                </label>
                <input
                  type="text"
                  name="pack"
                  value={data.pack}
                  className="form-control"
                  id="pack"
                  placeholder="Eg: Strip of 10, 100 ml, etc..."
                  onChange={onChangeHandler}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-bold">
                  Purchased Quantity
                </label>
                <input
                  type="number"
                  name="purchasedQuantity"
                  value={data.purchasedQuantity}
                  className="form-control"
                  id="purchasedQuantity"
                  placeholder="Eg: 100, 120, etc..."
                  onChange={onChangeHandler}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-bold">
                  Cost Price
                </label>
                <input
                  type="number"
                  name="costPrice"
                  value={data.costPrice}
                  className="form-control"
                  id="costPrice"
                  placeholder="Eg: 100.89, 167.98, etc..."
                  onChange={onChangeHandler}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-bold">
                  MRP
                </label>
                <input
                  type="number"
                  name="marketPrice"
                  value={data.marketPrice}
                  className="form-control"
                  id="marketPrice"
                  placeholder="Eg: 120.45, 177.68, etc..."
                  onChange={onChangeHandler}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-bold">
                  Selling Price
                </label>
                <input
                  type="number"
                  name="sellingPrice"
                  value={data.sellingPrice}
                  className="form-control"
                  id="marketPrice"
                  placeholder="Eg: 120.24, 170.38, etc..."
                  onChange={onChangeHandler}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-bold">
                  HSN Code
                </label>
                <input
                  type="text"
                  name="hsnCode"
                  value={data.hsnCode}
                  className="form-control"
                  id="hsnCode"
                  placeholder="Eg: 30045689, 30095690, etc..."
                  onChange={onChangeHandler}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="category" className="form-label fw-bold">
                  GST %
                </label>
                <select
                  name="gst"
                  id="gst"
                  className="form-control"
                  value={data.gst}
                  onChange={onChangeHandler}
                  required
                >
                  <option value="5">5%</option>
                  <option value="12">12%</option>
                  <option value="18">18%</option>
                </select>
              </div>

              <div className="text-center">
                {loading ? (
                  <button className="btn btn-success btn-lg disabled">
                    Saving ...
                  </button>
                ) : (
                  <button type="submit" className="btn btn-success btn-lg">
                    Save
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBatch;
