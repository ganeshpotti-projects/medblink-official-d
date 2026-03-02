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
        maxWidth: "500px",
        width: "80%",
      }}
    >
      <div>{children}</div>
      <button
        onClick={closeModal}
        className="text-danger mt-3"
        style={{
          border: "none",
          outline: "none",
          background: "transparent",
          cursor: "pointer",
        }}
      >
        <i className="bi bi-x-circle fs-2 mb-3"></i>
      </button>
    </dialog>
  );
};

export default Modal;
