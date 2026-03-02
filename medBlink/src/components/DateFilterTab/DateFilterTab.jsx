import React, { useState } from "react";

// DESIGN SYSTEM
import { Button } from "@/design-system";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const DateFilterBar = ({ onFilter, onClear, activeFilter }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFilter = () => {
    if (!startDate || !endDate) return;
    onFilter(startDate, endDate);
  };

  return (
    <div className="d-flex align-items-end gap-3 mb-4 flex-wrap">
      {!activeFilter ? (
        <>
          <div>
            <label className="small text-muted">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="small text-muted">End Date</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <Button
            variant="success"
            state={!startDate || !endDate ? "disabled" : "outline"}
            onClick={handleFilter}
          >
            Apply <i className="bi bi-arrow-right"></i>
          </Button>
        </>
      ) : (
        <div className="d-flex align-items-center gap-2 bg-light border rounded-pill px-3 py-2">
          <span className="fw-semibold">
            {formatDate(activeFilter.startDate)} -{" "}
            {formatDate(activeFilter.endDate)}
          </span>
          <Button variant="danger" state="link" onClick={onClear}>
            <i className="bi bi-x-circle"></i>
          </Button>
        </div>
      )}
    </div>
  );
};

export default DateFilterBar;
