import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Api } from "../../utils/Api";
import {
  clearTokens,
  deleteUserId,
  getAccessToken,
  getUserId,
} from "../../utils/tokensStorage";
import "./HomePage.css";
export default function HomePage() {
  const navigate = useNavigate();
  const logoutAll = async (e) => {
    try {
      await Api.post(`/users/logoutAll/${getUserId()}`, {
        key: process.env.REACT_APP_ADMIN,
      });
      clearTokens();
      deleteUserId();
      navigate("/");
    } catch (e) {
      clearTokens();
      navigate("/");
    }
  };
  return (
    <div className="home-container">
      <div className="title-homepage">
        <h1 style={{ fontSize: "4rem", fontWeight: "bold" }}>מערכת לניהול</h1>
        <div className="welcome">
          <p style={{ color: "#f36710" }}>Mais Stitch</p>
          <p style={{ color: "#98ca3b" }}>עבודות תפירות</p>
        </div>

        {!getAccessToken() && (
          <Link to="/">
            <button className="home-log-btn">יציאה</button>
          </Link>
        )}
        {!getAccessToken() && (
          <Link>
            <button
              style={{
                backgroundColor: "#586d38",
                color: "whitesmoke",
              }}
              onClick={logoutAll}
              className="home-log-btn"
            >
              יציאה מכל המכשירים
            </button>
          </Link>
        )}
        {getAccessToken() && (
          <label
            style={{
              fontSize: "1rem",
              color: "brown",
              fontWeight: "bold",
            }}
            htmlFor=""
          >
            המערכת פתוחה לשימוש חופשי
          </label>
        )}
      </div>
    </div>
  );
}
