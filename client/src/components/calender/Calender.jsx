import React, { useState, useEffect, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { Api } from "../../utils/Api";
import { useNavigate } from "react-router-dom";
import { FetchingStatus } from "../../utils/context";
import { clearTokens, getAccessToken } from "../../utils/tokensStorage";
import { refreshMyToken } from "../../utils/setNewAccessToken";
import "moment/locale/he"; // Import the Hebrew locale

function Calender() {
  const date = new Date();
  const year = date.getFullYear();
  const month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

  const localizer = momentLocalizer(moment);
  const [events, setEvents] = useState([]);
  const [showLogo, setShowLogo] = useState("none");
  const [calenderTitle, setCalenderTitle] = useState(
    "יומן סידור העבודה החודשי"
  );
  const navigate = useNavigate();
  const [fetchingStatus, setFetchingStatus] = useContext(FetchingStatus);

  const sendGetRequest = async (token) => {
    const headers = { Authorization: token };
    setFetchingStatus((prev) => {
      return { ...prev, status: true, loading: true };
    });
    let { data } = await Api.get("/events", { headers });
    setFetchingStatus((prev) => {
      return {
        ...prev,
        status: false,
        loading: false,
      };
    });
    setEvents(data);
  };
  const sendDeleteRequest = async (eventId) => {
    try {
      await handleDelete(eventId, getAccessToken());
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          const newAccessToken = await refreshMyToken();
          try {
            await handleDelete(eventId, newAccessToken);
          } catch (e) {
            throw e;
          }
        } catch (refreshError) {
          setFetchingStatus((prev) => {
            return {
              ...prev,
              status: false,
              loading: false,
            };
          });
          clearTokens();

          navigate("/homepage");
        }
      } else {
        clearTokens();

        setFetchingStatus((prev) => {
          return {
            ...prev,
            status: false,
            loading: false,
            message: ".. תקלה במחיקת הנתונים",
          };
        });
        setTimeout(() => {
          setFetchingStatus((prev) => {
            return {
              ...prev,
              status: false,
              loading: false,
              message: null,
            };
          });
          navigate("/homepage");
        }, 1000);
      }
    }
  };

  const sendPostRequest = async ({ start, end }) => {
    try {
      await handleSelect({ start, end }, getAccessToken());
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          const newAccessToken = await refreshMyToken();
          try {
            await handleSelect({ start, end }, newAccessToken);
          } catch (e) {
            throw e;
          }
        } catch (refreshError) {
          setFetchingStatus((prev) => {
            return {
              ...prev,
              status: false,
              loading: false,
            };
          });
          clearTokens();

          navigate("/homepage");
        }
      } else {
        clearTokens();

        setFetchingStatus((prev) => {
          return {
            ...prev,
            status: false,
            loading: false,
            message: ".. תקלה בהוספת הנתונים",
          };
        });
        setTimeout(() => {
          setFetchingStatus((prev) => {
            return {
              ...prev,
              status: false,
              loading: false,
              message: null,
            };
          });
          navigate("/homepage");
        }, 1000);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await sendGetRequest(getAccessToken());
      } catch (error) {
        if (error.response && error.response.status === 401) {
          try {
            const newAccessToken = await refreshMyToken();
            try {
              await sendGetRequest(newAccessToken);
            } catch (e) {
              throw e;
            }
          } catch (refreshError) {
            setFetchingStatus((prev) => {
              return {
                ...prev,
                status: false,
                loading: false,
              };
            });
            clearTokens();

            navigate("/homepage");
          }
        } else {
          clearTokens();

          setFetchingStatus((prev) => {
            return {
              ...prev,
              status: false,
              loading: false,
              message: ".. תקלה ביבוא הנתונים",
            };
          });
          setTimeout(() => {
            setFetchingStatus((prev) => {
              return {
                ...prev,
                status: false,
                loading: false,
                message: null,
              };
            });
            navigate("/homepage");
          }, 1000);
        }
      }
    };
    fetchData();
  }, []);

  const handleSelect = async ({ start, end }, token) => {
    const headers = { Authorization: token };

    try {
      const title = prompt("הכנס את ההערה הרצויה :");
      if (title) {
        const newEvent = {
          title,
          start,
          end,
        };
        const { data } = await Api.post("/events", newEvent, {
          headers,
        });
        setEvents([...events, data]);
      }
    } catch (e) {
      console.error("Error adding event:", e);
    }
  };
  const handleDelete = async (eventId, token) => {
    try {
      const headers = { Authorization: token };
      setFetchingStatus((prev) => {
        return { ...prev, status: true, loading: true };
      });

      if (window.confirm("האם למחוק את ההערה ?") === true) {
        await Api.delete(`/events/${eventId}`, { headers });
      } else {
        throw Error("מחיקה ההערה בוטלה");
      }
      const updatedEvents = events.filter((event) => event._id !== eventId);
      setEvents(updatedEvents);
      setFetchingStatus((prev) => {
        return { ...prev, status: false, loading: false };
      });
    } catch (e) {
      setFetchingStatus((prev) => {
        return { ...prev, status: false, loading: false };
      });
      console.error("Error deleting event:", e);
    }
  };
  const printCalender = () => {
    document.title = `${calenderTitle} - ${year + "-" + month + "-" + day}`;
    window.print();
  };
  return (
    <div id="pdfOrder">
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          htmlFor=""
          style={{
            padding: "1%",
            width: "97%",
            textAlign: "center",
            border: "none",
            margin: "1% auto",
            color: "brown",
            fontSize: "1.5rem",
            textDecoration: "underline",
            direction: "rtl",
          }}
          onChange={(e) => setCalenderTitle(e.target.value)}
          value={calenderTitle}
        />

        <img
          onClick={printCalender}
          src="/downloadPdf.png"
          alt=""
          style={{ width: "3%", cursor: "pointer" }}
        />
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={sendPostRequest}
        onSelectEvent={(event) => sendDeleteRequest(event._id)}
        views={["month"]}
        messages={{
          today: "היום",
          month: "חודש",
          week: "שבוע",
          day: "יום",
          agenda: "סדר יום",
          date: "תאריך",
          time: "שעה",
          event: "אירוע",
        }}
        rtl={true} // Set RTL to true
      />
    </div>
  );
}

export default Calender;
