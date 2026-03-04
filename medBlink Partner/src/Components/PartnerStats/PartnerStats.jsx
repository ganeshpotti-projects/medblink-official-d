import React, { useState } from "react";

// THIRD PARTY
import { useNavigate } from "react-router-dom";

// DESIGN SYSTEM
import { Badge } from "@/design-system";

// COMPONENTS
import InfoModal from "../InfoModal/InfoModal";

// UTILS
import { formatIndianCurrency } from "../../utils/currencyUtil";
import { getFormattedDate } from "../../utils/dateUtil";

const PartnerStats = ({ stats }) => {
  const navigate = useNavigate();
  const [modalData, setModalData] = useState(null);

  // Handle null/undefined stats
  if (!stats) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info">
          <p className="mb-0">Please log in to view your statistics.</p>
        </div>
      </div>
    );
  }

  const income = stats?.partnerIncome || {};
  const blinkPointsData = stats?.blinkPoints || {};

  return (
    <div className="container mt-4">
      <div className="row g-4">
        <div className="col-md-7 d-flex flex-column gap-4">
          <div className="card shadow-sm rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-semibold d-flex align-items-center gap-2 mb-0">
                BlinkPoints Summary
                <i
                  className="bi bi-info-circle text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setModalData({
                      color: "info",
                      title: "BlinkPoints System",
                      description: (
                        <>
                          Earn <strong>BlinkPoints</strong> for every order you
                          deliver. Points can be redeemed for rewards and bonus
                          payouts.
                          <ul className="list-unstyled small text-center mt-3">
                            <li className="mb-2">
                              🛒 <strong>First Order:</strong> +250 Points
                            </li>
                            <li className="mb-2">
                              📦 <strong>Each Delivered Order:</strong> +10
                              Points
                            </li>
                            <li>
                              🎯 <strong>Every 10 Orders:</strong> +20 Bonus
                              Points
                            </li>
                          </ul>
                          <div className="text-center mt-2">
                            <strong>1 BlinkPoint = ₹1 in reward value</strong>
                          </div>
                        </>
                      ),
                      icon: "bi-lightning-fill",
                    })
                  }
                ></i>
              </h5>
              <Badge label="Active" variant="success" size="sm" />
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-secondary">
                Current BlinkPoints{" "}
                <i className="bi bi-lightning-fill text-warning"></i>
              </span>
              <span className="fw-semibold text-success">
                {blinkPointsData.currentBlinkPoints}
              </span>
            </div>

            <div className="d-flex justify-content-between">
              <span className="text-secondary">
                Total BlinkPoints Earned{" "}
                <i className="bi bi-gift-fill text-primary"></i>
              </span>
              <span className="fw-semibold text-primary">
                {blinkPointsData.totalBlinkPoints}
              </span>
            </div>
          </div>

          {/* -------- Salary Summary Card -------- */}
          <div className="card shadow-sm rounded-4 p-4">
            <h5 className="fw-semibold mb-3 d-flex align-items-center gap-2">
              Salary Summary
              <Badge
                label={income.hikeGranted ? "Hike Granted" : "No Hike"}
                variant={income.hikeGranted ? "success" : "secondary"}
                size="sm"
              />
            </h5>

            <div className="d-flex justify-content-between mb-2 align-items-center">
              <span className="text-secondary d-flex align-items-center gap-2">
                Yearly Salary
                <i
                  className="bi bi-info-circle text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setModalData({
                      color: "success",
                      title: "Yearly Salary Hike",
                      description: (
                        <>
                          Complete{" "}
                          <strong>200 orders on average per month</strong>{" "}
                          between your joining date and{" "}
                          <strong>1st January</strong> every year to get a{" "}
                          <strong>7% hike</strong> in your salary.
                        </>
                      ),
                      icon: "bi-graph-up-arrow",
                    })
                  }
                />
              </span>
              <span className="fw-semibold text-success">
                {formatIndianCurrency(income.yearlySalary)}
              </span>
            </div>

            <div className="d-flex justify-content-between mb-2 align-items-center">
              <span className="text-secondary d-flex align-items-center gap-2">
                Last Month Bonus
                <i
                  className="bi bi-info-circle text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setModalData({
                      color: "warning",
                      title: "Monthly Bonus",
                      description: (
                        <>
                          Complete <strong>200 orders</strong> this month to
                          earn a <strong>₹200 bonus</strong> on your next
                          payout.
                        </>
                      ),
                      icon: "bi-cash-stack",
                    })
                  }
                ></i>
              </span>
              <span className="fw-semibold text-warning">
                {formatIndianCurrency(income.lastMonthBonus)}
              </span>
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card shadow-sm rounded-4 p-4 h-100">
            <h5 className="fw-semibold mb-4 d-flex align-items-center gap-2">
              Orders Summary
              <Badge label="This Period" variant="info" size="sm" />
            </h5>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-secondary">Total Orders Delivered</span>
              <span className="fw-semibold text-success">
                {stats.ordersDelivered}
              </span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-secondary">Yearly Orders (Current)</span>
              <span className="fw-semibold text-primary">
                {income.yearlyOrders}
              </span>
            </div>

            <div className="d-flex justify-content-between">
              <span className="text-secondary">Monthly Orders (Current)</span>
              <span className="fw-semibold text-warning">
                {income.monthlyOrders}
              </span>
            </div>

            <button
              className="btn btn-outline-success w-100 mt-4"
              onClick={() => navigate("/orders")}
            >
              Deliver Orders <i className="bi bi-box-seam-fill"></i>
            </button>

            <div className="text-center text-secondary small mt-3">
              Updated on {getFormattedDate()}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Info Modal ---------- */}
      {modalData && (
        <InfoModal
          openModal={!!modalData}
          closeModal={() => setModalData(null)}
          color={modalData.color}
          title={modalData.title}
          description={modalData.description}
          icon={modalData.icon}
        />
      )}
    </div>
  );
};

export default PartnerStats;
