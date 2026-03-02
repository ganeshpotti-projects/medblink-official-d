import { useEffect, useRef } from "react";

const Modal = ({ openModal, closeModal, children }) => {
  const ref = useRef();

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);

  return (
    <dialog
      ref={ref}
      onCancel={closeModal}
      style={{
        padding: "20px",
        border: "none",
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        textAlign: "center",
        maxWidth: "600px",
        width: "90%",
        position: "relative",
      }}
    >
      <button
        onClick={closeModal}
        className="btn btn-outline-danger"
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <i className="fs-3 bi bi-x"></i>
      </button>

      <div style={{ marginTop: "30px" }}>{children}</div>
    </dialog>
  );
};

export default Modal;
