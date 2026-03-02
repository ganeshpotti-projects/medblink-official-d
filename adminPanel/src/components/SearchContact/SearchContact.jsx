import React, { useState } from "react";

// COMPONENTS
import ContactUsList from "../ContactUsList/ContactUsList";

const SearchContact = () => {
  const [searchContact, setSearchContact] = useState("");
  return (
    <div>
      <div className="row justify-content-center">
        <div className="col-md-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Eg: Ganesh (or) 9876543210 ...."
                onChange={(e) => setSearchContact(e.target.value)}
                value={searchContact}
              />

              <button className="btn btn-primary mt-2" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
      <ContactUsList searchContact={searchContact} />
    </div>
  );
};

export default SearchContact;
