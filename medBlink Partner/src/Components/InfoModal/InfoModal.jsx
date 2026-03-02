import { useEffect, useRef } from "react";

const InfoModal = ({
  openModal,
  closeModal,
  color = "info",
  title,
  description,
  icon, 
}) => {
  const ref = useRef();

  useEffect(() => {
    if (openModal) ref.current?.showModal();
    else ref.current?.close();
  }, [openModal]);

  const defaultIcons = {
    success: "bi-check-circle",
    warning: "bi-exclamation-triangle",
    danger: "bi-x-circle",
    info: "bi-info-circle",
    primary: "bi-lightbulb",
  };

  const selectedIcon = icon ? icon : defaultIcons[color] || "bi-info-circle";

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
      <div className="d-flex flex-column align-items-center gap-3">
        <i className={`bi ${selectedIcon} fs-1 text-${color}`}></i>
        <h5 className="fw-semibold">{title}</h5>
        <div className="text-secondary text-center">{description}</div>
        <button
          className={`btn btn-${color} text-white px-4`}
          onClick={closeModal}
        >
          Got it
        </button>
      </div>
    </dialog>
  );
};

export default InfoModal;
