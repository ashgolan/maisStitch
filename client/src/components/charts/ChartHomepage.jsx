import React, { useContext, useEffect, useState } from "react";
import "./chartHomepage.css";
import Select from "react-select";
import SetupPage from "../setupPage/SetupPage";
import ChartPage from "./ChartPage";
import { FetchingStatus } from "../../utils/context";
import { Api } from "../../utils/Api";
import { clearTokens, getAccessToken } from "../../utils/tokensStorage";
import { refreshMyToken } from "../../utils/setNewAccessToken";
import { useNavigate } from "react-router-dom";

function ChartHomepage() {
  const [report, setReport] = useState({
    typeName: "",
    type: "",
    clientName: "",
    month: "",
    year: "",
  });
  const [updatedReport, setUpdatedReport] = useState(false);
  const [updateChart, setUpdateChart] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [fetchingStatus, setFetchingStatus] = useContext(FetchingStatus);
  const [fetchingData, setFetchingData] = useState({});
  const navigate = useNavigate();
  const months = [
    { value: null, label: null },
    { value: "01", label: "ינואר" },
    { value: "02", label: "פברואר" },
    { value: "03", label: "מרץ" },
    { value: "04", label: "אפריל" },
    { value: "05", label: "מאי" },
    { value: "06", label: "יוני" },
    { value: "07", label: "יולי" },
    { value: "08", label: "אוגוסט" },
    { value: "09", label: "ספטמבר" },
    { value: "10", label: "אוקטובר" },
    { value: "11", label: "נובמבר" },
    { value: "12", label: "דיצמבר" },
  ];
  const allMonths = months.map((item) => {
    return { value: item.value, label: item.label };
  });
  let yearArray = [];
  for (let i = 2020; i <= new Date().getFullYear(); i++) {
    if (i === 2020) yearArray.push(null);
    yearArray.push(i);
  }
  const allYears = yearArray.sort().map((year) => {
    return {
      value: year === 2020 ? null : year,
      label: year === 2020 ? null : year,
    };
  });
  const allTypes = [
    { type: "/expenses", name: "דוח הוצאות" },
    { type: "/sales", name: "דוח הכנסות" },
    { type: "expensesCharts", name: "תרשים הוצאות" },
    { type: "salesCharts", name: "תרשים הכנסות" },
  ].map((item) => {
    return { value: item.type, label: item.name };
  });
  const customStyles = {
    control: (base) => ({
      ...base,
      textAlign: "center",
    }),
    placeholder: (provided) => ({
      ...provided,
    }),
    menu: (base) => ({
      ...base,
      textAlign: "center",
    }),
    option: (provided, state) => ({
      ...provided,
      background: state.isFocused ? "gold" : "whitesmoke",
      color: state.isFocused ? "brown" : "black",
    }),
    singleValue: (styles, state) => {
      return {
        ...styles,
        color: state.isSelected ? "brown" : "black",
      };
    },
  };
  const downloadToPdf = async () => {
    const month = report.month ? report.month : "";
    document.title = report?.typeName + "-" + month + "-" + report.year;
    window.print();
  };

  const sendRequest = async (token) => {
    const headers = { Authorization: token };
    setFetchingStatus((prev) => {
      return { ...prev, status: true, loading: true };
    });
    const { data: salesData } = await Api.get("/sales", { headers });
    const { data: expensesData } = await Api.get("/expenses", { headers });

    setFetchingStatus((prev) => {
      return {
        ...prev,
        status: false,
        loading: false,
      };
    });
    setFetchingData({
      salesData: salesData,
      expensesData: expensesData,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await sendRequest(getAccessToken());
      } catch (error) {
        if (error.response && error.response.status === 401) {
          try {
            const newAccessToken = await refreshMyToken();
            try {
              await sendRequest(newAccessToken);
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
  const ids = fetchingData?.salesData?.map(({ clientName }) => clientName);
  const filtered = fetchingData?.salesData?.filter(
    ({ clientName }, index) => !ids.includes(clientName, index + 1)
  );

  const allSelectData = filtered?.map((item) => {
    return { value: item._id, label: item.clientName };
  });
  allSelectData?.unshift({ value: null, label: null });
  return (
    <>
      <div id={"pdfOrder"}>
        <div className="charts-title">
          <Select
            className="select-chart"
            options={allTypes}
            placeholder="בחר סוג דוח"
            onChange={(e) => {
              setUpdatedReport((prev) => !prev);
              setReport((prev) => {
                return {
                  ...prev,
                  typeName: e.label,
                  clientName: null,
                  type: e.value,
                  month: null,
                  year: null,
                };
              });
              setUpdateChart((prev) => !prev);
              setShowChart(false);
            }}
            styles={customStyles}
          ></Select>{" "}
          {report.type && (
            <Select
              options={allYears.filter((option) => option.value !== null)}
              placeholder="בחר שנה"
              onChange={(selectedOption) => {
                setReport((prev) => {
                  setUpdatedReport((prev) => !prev);
                  return {
                    ...prev,
                    year: selectedOption ? selectedOption.value : null,
                  };
                });
                setUpdateChart((prev) => !prev);
                setShowChart(false);
              }}
              value={
                report.year !== null
                  ? allYears?.find((option) => option.value === report.year)
                  : null
              }
              isClearable={true}
              styles={customStyles}
            ></Select>
          )}
          {report.type && report.year && (
            <Select
              options={allMonths.filter((option) => option.value !== null)}
              placeholder="בחר חודש"
              onChange={(selectedOption) => {
                setReport((prev) => {
                  setUpdatedReport((prev) => !prev);
                  return {
                    ...prev,
                    month: selectedOption ? selectedOption.value : null,
                  };
                });
                setUpdateChart((prev) => !prev);
                setShowChart(false);
              }}
              styles={customStyles}
              value={
                report.month !== null
                  ? allMonths?.find((option) => option.value === report.month)
                  : null
              }
              isClearable={true}
            ></Select>
          )}
          {(report?.type === "/sales" || report?.type === "salesCharts") && (
            <Select
              options={allSelectData.filter((option) => option.value !== null)}
              placeholder="בחר קליינט"
              onChange={(selectedOption) => {
                setReport((prev) => {
                  setUpdatedReport((prev) => !prev);
                  return {
                    ...prev,
                    clientName: selectedOption ? selectedOption.label : null,
                  };
                });
                setUpdateChart((prev) => !prev);
                setShowChart(false);
              }}
              value={
                report.clientName !== null
                  ? allSelectData?.find(
                      (option) => option.value === report.clientName
                    )
                  : null
              }
              isClearable={true}
              styles={customStyles}
            ></Select>
          )}
          {report.type && report.year && (
            <div className="downloadPdf">
              <img
                style={{ width: "70%" }}
                src="/downloadPdf.png"
                alt=""
                onClick={downloadToPdf}
              />
            </div>
          )}
        </div>
        {report.type &&
          (report.type === "/expenses" ||
            report.type === "/sales" ||
            report.type === "/salesByClient") && (
            <SetupPage
              updatedReport={updatedReport}
              collReq={report.type}
              fetchingData={fetchingData}
              isFetching={true}
              report={report}
            ></SetupPage>
          )}
        {report.type &&
          report.year &&
          (report.type === "expensesCharts" ||
            report.type === "salesCharts") && (
            <ChartPage
              fetchingData={fetchingData}
              showChart={showChart}
              setShowChart={setShowChart}
              updateChart={updateChart}
              report={report}
            ></ChartPage>
          )}
      </div>
    </>
  );
}

export default ChartHomepage;
