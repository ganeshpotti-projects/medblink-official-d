import React, { useContext, useEffect, useRef, useState } from "react";

// THIRD PARTY
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

// CONTEXT
import { ProductsContext } from "../../context/ProductsContext";

// SERVICES
import { updateProduct } from "../../services/productService";

// UTILS
import { entityUpdater } from "../../utils/entityUpdaterUtil";

const UpdateProduct = () => {
  const navigate = useNavigate();
  const { productID } = useParams();
  const { productsList, setProductsList } = useContext(ProductsContext);
  const fileInputRef = useRef(null);

  const [data, setData] = useState({
    name: "",
    description: "",
    category: "Tablets",
    manufacturer: "",
  });

  useEffect(() => {
    const product = productsList.find((p) => p.productID === productID);
    if (product) {
      setData({
        name: product.productName || "",
        description: product.productDescription || "",
        category: product.productCategory || "Tablets",
        manufacturer: product.productManufacturer || "",
      });
    }
  }, [productID, productsList]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to update the product?")) return;

    const updateData = {
      productName: data.name,
      productDescription: data.description,
      productCategory: data.category,
      productManufacturer: data.manufacturer,
    };
    const file = fileInputRef.current?.files?.[0];

    try {
      const response = await updateProduct(updateData, productID, file);
      if (!response) return;
      setProductsList((prev) =>
        entityUpdater(prev, response.data, "UPDATED", "productID")
      );
      toast.success("Product Updated successfully 🎉");
      navigate("/browseProduct");
    } catch (error) {
      console.error("Error Updating Product in FE:", error);
      toast.error("Failed to Update Product☹️, Try Again Later!");
    }
  };

  return (
    <div className="mx-5 my-5">
      <div className="col-lg-10 col-md-12 col-sm-12">
        <div className="card-body">
          <h3 className="gap-2 text-center mb-5">
            Update Product <i className="bi bi-arrow-bar-up"></i>
          </h3>
          <form onSubmit={onSubmitHandler}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label fw-bold">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={data.name}
                className="form-control"
                id="name"
                placeholder="Eg: Esoz D 40, Dolo 650, etc..."
                onChange={onChangeHandler}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label fw-bold">
                Description
              </label>
              <textarea
                className="form-control"
                name="description"
                value={data.description}
                id="description"
                rows="5"
                placeholder="Provide product description..."
                onChange={onChangeHandler}
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="category" className="form-label fw-bold">
                Category
              </label>
              <select
                name="category"
                id="category"
                className="form-control"
                value={data.category}
                onChange={onChangeHandler}
                required
              >
                <option value="Capsules">Capsules</option>
                <option value="Devices">Devices</option>
                <option value="Drops">Drops</option>
                <option value="Injections">Injections</option>
                <option value="Ointments">Ointments</option>
                <option value="Ortho">Ortho</option>
                <option value="Syrups">Syrups</option>
                <option value="Tablets">Tablets</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="manufacturer" className="form-label fw-bold">
                Manufacturer
              </label>
              <input
                type="text"
                name="manufacturer"
                value={data.manufacturer}
                className="form-control"
                id="manufacturer"
                placeholder="Eg: Cipla, Alkem, Mankind etc..."
                onChange={onChangeHandler}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="image" className="form-label fw-bold">
                <i className="bi bi-cloud-arrow-up-fill me-2"></i>
                Upload Image (OPTIONAL)
              </label>
              <input
                type="file"
                className="form-control"
                id="image"
                ref={fileInputRef}
              />
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-warning btn-lg">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
