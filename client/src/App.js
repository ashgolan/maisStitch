import "./App.css";
import React from "react";
import Navbar from "./components/navbar/Navbar";
import { FetchingStatus } from "./utils/context";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import Login from "./components/login/Login";
import HomePage from "./components/homepage/HomePage";
import IdleTimer from "./utils/IdleTimer";
import { clearTokens } from "./utils/tokensStorage";
import Expenses from "./components/expenses/Expenses";
import Sales from "./components/sales/Sales";
import ChartHomepage from "./components/charts/ChartHomepage";
import Calender from "./components/calender/Calender";
import Clients from "./components/clients/Clients";
function App() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [fetchingStatus, setFetchingStatus] = useState({
    loading: false,
    error: false,
    status: false,
    message: null,
  });
  const handleIdle = () => {
    if (!loggedIn) return;
    clearTokens();
    setLoggedIn(false);
    navigate("/homepage");
  };

  return (
    <div>
      <IdleTimer timeout={10 * 60 * 1000} onIdle={handleIdle} />
      <Navbar></Navbar>
      {fetchingStatus.message && (
        <h5 className="message">{fetchingStatus.message}</h5>
      )}
      {fetchingStatus.loading && (
        <div className="loading">
          <span className="loader"></span>
        </div>
      )}
      <FetchingStatus.Provider value={[fetchingStatus, setFetchingStatus]}>
        <Routes>
          <Route
            exact
            path="/"
            element={<Login setLoggedIn={setLoggedIn}></Login>}
          ></Route>

          <Route path="/expenses" element={<Expenses></Expenses>}></Route>

          <Route path="/sales" element={<Sales></Sales>}></Route>
          <Route path="/clients" element={<Clients></Clients>}></Route>
          <Route
            path="/chartHomepage"
            element={<ChartHomepage></ChartHomepage>}
          ></Route>
          <Route path="/homePage" element={<HomePage></HomePage>}></Route>
          <Route path="/calender" element={<Calender></Calender>}></Route>
        </Routes>
      </FetchingStatus.Provider>
    </div>
  );
}

export default App;
