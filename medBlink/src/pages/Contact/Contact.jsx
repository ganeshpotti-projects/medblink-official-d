import React, { useState } from "react";

// ASSETS
import { assets } from "../../assets/assets";

// THIRD PARTY
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// DESIGN SYSTEM
import { Button } from "@/design-system";

// CSS
import "./Contact.css";
import { addContactQuery } from "../../service/contactService";

const Contact = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const contactData = {
      contactName: data.name,
      contactEmail: data.email,
      contactPhoneNumber: data.phoneNumber,
      contactMessage: data.message,
    };

    try {
      const response = await addContactQuery(contactData);
      if (!response) return;
      toast.success("Contact query sent successfully🎉");
      navigate("/");
    } catch (error) {
      console.error("Error Sending Contact query in FE:", error);
      toast.error("Failed to Send Contact query☹️, Try Again Later!");
    }
  };

  return (
    <div className="container py-5 contact3">
      <div className="row align-items-center mb-5">
        <div className="col-lg-6 mb-4 mb-lg-0">
          <div className="card-shadow">
            <img
              src={assets.contact}
              className="img-fluid rounded"
              alt="Contact Illustration"
            />
          </div>
        </div>

        <div className="col-lg-6">
          <h2 className="fw-bold mb-3">Quick Contact</h2>
          <form onSubmit={onSubmitHandler}>
            <div className="form-group mb-3">
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={onChangeHandler}
                className="form-control"
                placeholder="Your Name"
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={onChangeHandler}
                className="form-control"
                placeholder="Email Address"
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="number"
                value={data.phoneNumber}
                name="phoneNumber"
                onChange={onChangeHandler}
                className="form-control"
                placeholder="Phone"
              />
            </div>
            <div className="form-group mb-3">
              <textarea
                className="form-control"
                name="message"
                value={data.message}
                onChange={onChangeHandler}
                rows="4"
                placeholder="Message"
              ></textarea>
            </div>
            <div className="text-center">
              <Button variant="danger">Submit</Button>
            </div>
          </form>
        </div>
      </div>

      <div className="row text-center g-4">
        <div className="col-md-4">
          <div className="card border-0 h-100">
            <div className="card-body d-flex align-items-center justify-content-start gap-3">
              <img
                src="https://www.wrappixel.com/demos/ui-kit/wrapkit/assets/images/contact/icon1.png"
                alt="Address"
              />
              <div>
                <h6 className="font-weight-medium mb-1">Address</h6>
                <p className="mb-0">
                  SBK Luxus, 1/3 Vidya Nagar,
                  <br />
                  Guntur,
                  <br />
                  Andhra Pradesh. (522007)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 h-100">
            <div className="card-body d-flex align-items-center justify-content-start gap-3">
              <img
                src="https://www.wrappixel.com/demos/ui-kit/wrapkit/assets/images/contact/icon2.png"
                alt="Phone"
              />
              <div>
                <h6 className="font-weight-medium mb-1">Phone</h6>
                <p className="mb-0">
                  +91 9246744448
                  <br />
                  +91 7207604676
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 h-100">
            <div className="card-body d-flex align-items-center justify-content-start gap-3">
              <img
                src="https://www.wrappixel.com/demos/ui-kit/wrapkit/assets/images/contact/icon3.png"
                alt="Email"
              />
              <div>
                <h6 className="font-weight-medium mb-1">Email</h6>
                <p className="mb-0">
                  ganeshpotti2003@gmail.com
                  <br />
                  medblink@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
