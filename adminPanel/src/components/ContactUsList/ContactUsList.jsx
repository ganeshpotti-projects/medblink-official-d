import React, { useEffect, useState } from "react";

// ASSETS
import { assets } from "../../assets/assets";

// THIRD PARTY
import { toast } from "react-toastify";

// SERVICES
import {
  deleteContactQuery,
  getAllContactQueries,
} from "../../services/contactUsService";

// COMPONENTS
import Modal from "../Modal/Modal.jsx";

const ContactUsList = () => {
  const [data, setData] = useState([]);
  const [searchContact, setSearchContact] = useState("");
  const [modal, setModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");

  const fetchContactQueries = async () => {
    try {
      const response = await getAllContactQueries();
      if (!response) return;
      const allContacts = response.data;

      setData(allContacts || []);
    } catch (error) {
      console.error("Error Fetching All Contact Queries in FE:", error);
      toast.error("Failed to Fetch All Contact Queries☹️, Try Again Later!");
    }
  };

  const deleteContactQueryHandler = async (contactID) => {
    try {
      const response = await deleteContactQuery(contactID);
      if (!response) return;
      toast.success("Contact Query deleted successfully🎉");

      await fetchContactQueries();
    } catch (error) {
      console.error("Error Deleting Contact Query in FE:", error);
      toast.error("Failed to Delete Contact Query☹️, Try Again Later!");
    }
  };

  const openMessageModal = (message) => {
    setSelectedMessage(message);
    setModal(true);
  };

  const filteredContacts = data.filter(
    (contact) =>
      contact.contactName.toLowerCase().includes(searchContact.toLowerCase()) ||
      contact.contactPhoneNumber
        .toLowerCase()
        .includes(searchContact.toLowerCase())
  );

  useEffect(() => {
    fetchContactQueries();
  }, []);

  return (
    <>
      <div className="text-center">
        <h5>Search by Name (or) PhoneNumber</h5>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-5">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Eg: Ganesh (or) 9876543210 etc...."
                value={searchContact}
                onChange={(e) => setSearchContact(e.target.value)}
              />
              <button className="btn btn-primary mt-2" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="p-2 row justify-content-center">
        <div className="col-11 card">
          <table className="table table-responsive">
            <tbody>
              {filteredContacts.map((contact, index) => (
                <tr key={index}>
                  <td>
                    <img src={assets.contact} height={32} width={32} />
                  </td>
                  <td>{contact.contactName}</td>
                  <td>{contact.contactEmail}</td>
                  <td>{contact.contactPhoneNumber}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-info"
                        onClick={() => openMessageModal(contact.contactMessage)}
                      >
                        View Message
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          deleteContactQueryHandler(contact.contactID)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredContacts.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    Contact queries not found ☹️
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal openModal={modal} closeModal={() => setModal(false)}>
        <h5 className="fw-bold text-center">Contact Message</h5>
        <p className="mt-3">{selectedMessage}</p>
      </Modal>
    </>
  );
};

export default ContactUsList;
