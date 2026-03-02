import React, { useState, useRef, useContext } from "react";

// THIRD PARTY
import { toast } from "react-toastify";

// CONTEXT
import { ProductsContext } from "../../context/ProductsContext";

// SERVICES
import { addProduct } from "../../services/productService";

// UTILS
import { entityUpdater } from "../../utils/entityUpdaterUtil";

const AddProduct = () => {
  const { setProductsList } = useContext(ProductsContext);
  const fileInputRef = useRef();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    name: "",
    description: "",
    category: "Tablets",
    manufacturer: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const productData = {
      productName: data.name,
      productDescription: data.description,
      productCategory: data.category,
      productManufacturer: data.manufacturer,
    };
    const productImage = fileInputRef.current.files[0];

    try {
      setLoading(true);
      const response = await addProduct(productData, productImage);
      if (!response) return;
      setLoading(false);
      setProductsList((prev) =>
        entityUpdater(prev, response.data, "CREATED", "productID")
      );
      toast.success("Product saved successfully 🎉");
      setData({
        name: "",
        description: "",
        category: "Tablets",
        manufacturer: "",
      });
      fileInputRef.current.value = null;
    } catch (error) {
      console.error("Error Saving Product in FE:", error);
      toast.error("Failed to Save Product☹️, Try Again Later!");
    }
  };

  return (
    <div className="container mx-5 my-5">
      <div className="col-lg-10 col-md-12 col-sm-12">
        <div className="card-body">
          <h3 className="gap-2 text-center mb-5">
            Add Product <i className="bi bi-bag-plus-fill"></i>
          </h3>

          <form id="registrationForm" onSubmit={onSubmitHandler}>
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
              <label htmlFor="name" className="form-label fw-bold">
                Manufacturer
              </label>
              <input
                type="text"
                name="manufacturer"
                value={data.manufacturer}
                className="form-control"
                id="manufacturer"
                placeholder="Eg: Cipla, Alkem, Ranbaxy etc..."
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
  );
};

export default AddProduct;
