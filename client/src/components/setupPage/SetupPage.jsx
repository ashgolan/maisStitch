import React from "react";
import { useState, useContext } from "react";
import AddItem from "./Add_Item/AddItem";
import AddItemBtn from "./Add_Item/AddItemBtn";
import ItemsTable from "./Items_Table/ItemsTable";
import { FetchingStatus } from "../../utils/context";
import "./SetupPage.css";
import { useEffect } from "react";

import { useNavigate } from "react-router";
import { Api } from "../../utils/Api";
import { clearTokens, getAccessToken } from "../../utils/tokensStorage";
import { refreshMyToken } from "../../utils/setNewAccessToken";

export default function SetupPage({
  collReq,
  report,
  updatedReport,
  isFetching,
  fetchingData,
}) {
  const date = new Date();
  const year = date.getFullYear();

  const navigate = useNavigate();
  // eslint-disable-next-line
  const [fetchedData, setFetchingData] = useState([]);
  const [fetchingStatus, setFetchingStatus] = useContext(FetchingStatus);
  const [itemInChange, setItemInChange] = useState(false);
  const [itemIsUpdated, setItemIsUpdated] = useState(false);
  const [addItemToggle, setaddItemToggle] = useState({
    btnVisible: true,
    formVisible: false,
  });
  const [clients, setClients] = useState([]);

  const [kindOfSort, setKindOfSort] = useState("date");
  const getTotals = () => {
    let total = 0;

    filterByReport(sortedInventory(kindOfSort)).forEach((element) => {
      total += element.totalAmount;
    });

    return total;
  };
  // const sendRequest = async (token) => {
  //   const headers = { Authorization: token };
  //   setFetchingStatus((prev) => {
  //     return { ...prev, status: true, loading: true };
  //   });

  //   if (isFetching) {
  //     if (collReq === "/sales") {
  //       setFetchingData(fetchingData.salesData);
  //     } else if (collReq === "/expenses") {
  //       setFetchingData(fetchingData.expensesData);
  //     }
  //   } else {
  //     if (collReq === "/sales" || collReq === "/clients") {
  //       const { data: clientsData } = await Api.get("/clients", { headers });
  //       setClients(clientsData);
  //     }
  //     const { data } = await Api.get(collReq, { headers });

  //     if (report === undefined) {
  //       if (collReq === "/sales" || collReq === "/expenses") {
  //         setFetchingData(
  //           data.filter(
  //             (item) =>
  //               new Date(item.date).getFullYear() >2023 ||
  //               item.colored === true
  //           )
  //         );
  //       } else {
  //       setFetchingData(data);
  //       }
  //     } else {
  //       setFetchingData(data);
  //     }
  //   }
  //   setFetchingStatus((prev) => {
  //     return {
  //       ...prev,
  //       status: false,
  //       loading: false,
  //     };
  //   });
  // };
  const sendRequest = async (token) => {
    const headers = { Authorization: token };
    setFetchingStatus((prev) => ({
      ...prev,
      status: true,
      loading: true,
    }));

    const fetchRequests = [];

    if (isFetching) {
      if (collReq === "/sales") {
        setFetchingData(fetchingData.salesData);
      } else if (collReq === "/expenses") {
        setFetchingData(fetchingData.expensesData);
      }
    } else {
      if (collReq === "/sales" || collReq === "/clients") {
        fetchRequests.push(Api.get("/clients", { headers }));
      }
      fetchRequests.push(Api.get(collReq, { headers }));
    }

    try {
      const results = await Promise.all(fetchRequests);
      results.forEach((result, index) => {
        if (index === 0 && collReq === "/sales" || collReq === "/clients") {
          setClients(result.data);
        }
        const data = result.data;

        if (!report) {
          setFetchingData(
            data.filter(
              (item) =>
                new Date(item.date).getFullYear() > 2023 ||
                item.colored === true
            )
          );
        } else {
          setFetchingData(data);
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setFetchingStatus((prev) => ({
        ...prev,
        status: false,
        loading: false,
      }));
    }
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
  }, [itemIsUpdated, updatedReport]);
  const filterByReport = (sortedData) => {
    if (!report?.type) return sortedData;
    if (report?.month && report.year) {
      return sortedData.filter((item) => {
        const month =
          new Date(item.date).getMonth() + 1 < 10
            ? `0${new Date(item.date).getMonth() + 1}`
            : new Date(item.date).getMonth() + 1;
        if (report?.clientName)
          return (
            month == report?.month &&
            new Date(item.date).getFullYear() === report?.year &&
            item.clientName === report.clientName
          );
        return (
          month == report?.month &&
          new Date(item.date).getFullYear() === report?.year
        );
      });
    } else if (report?.month) {
      return sortedData.filter((item) => {
        const month =
          new Date(item.date).getMonth() + 1 < 10
            ? `0${new Date(item.date).getMonth() + 1}`
            : new Date(item.date).getMonth() + 1;
        if (report?.clientName)
          return (
            month == report?.month && item.clientName === report.clientName
          );
        return month == report?.month;
      });
    } else {
      if (report?.clientName)
        return sortedData.filter(
          (item) =>
            new Date(item.date).getFullYear() === report?.year &&
            report?.clientName === item.clientName
        );
      else
        return sortedData.filter(
          (item) => new Date(item.date).getFullYear() === report?.year
        );
    }
  };
  const sortedInventory = (kindOfSort) => {
    switch (kindOfSort) {
      case "number":
        return fetchedData?.sort(
          (a, b) => parseFloat(a.number) - parseFloat(b.number)
        );
      case "clientName":
        return fetchedData?.sort((a, b) =>
          a.clientName > b.clientName ? 1 : -1
        );
      case "totalAmount":
        return fetchedData?.sort(
          (a, b) => parseFloat(a.totalAmount) - parseFloat(b.totalAmount)
        );
      case "discount":
        return fetchedData?.sort(
          (a, b) => parseFloat(a.discount) - parseFloat(b.discount)
        );
      case "sale":
        return fetchedData?.sort(
          (a, b) => parseFloat(a.sale) - parseFloat(b.sale)
        );
      case "expenses":
        return fetchedData?.sort(
          (a, b) => parseFloat(a.expenses) - parseFloat(b.expenses)
        );
      case "quantity":
        return fetchedData?.sort(
          (a, b) => parseFloat(a.quantity) - parseFloat(b.quantity)
        );
      case "name":
        return fetchedData?.sort((a, b) => (a.name > b.name ? 1 : -1));
      case "tax":
        return fetchedData?.sort((a, b) => (a.tax > b.tax ? 1 : -1));
      case "date":
        return fetchedData?.sort((a, b) => (a.date > b.date ? 1 : -1));
      default:
        return fetchedData?.sort((a, b) => (a.date > b.date ? 1 : -1));
    }
  };

  return (
    <div className="inventory-container">
      {getTotals() > 0 && (
        <label className="sum-of-totals" htmlFor="">
          {"  "}
          {`المجموع : `}
          {getTotals().toFixed(2)}
          {` شيكل `}
        </label>
      )}
      {!addItemToggle.formVisible &&
        !report?.type &&
        !fetchingStatus.loading && (
          <AddItemBtn setaddItemToggle={setaddItemToggle}></AddItemBtn>
        )}
      {!addItemToggle.btnVisible && !report?.type && (
        <AddItem
          setaddItemToggle={setaddItemToggle}
          setInventoryData={setFetchingData}
          setItemIsUpdated={setItemIsUpdated}
          collReq={collReq}
          selectData={clients}
        ></AddItem>
      )}
      <form
        className="Item_form"
        style={{
          width:
            collReq === "/inventories" || collReq === "/providers"
              ? "60%"
              : "95%",
        }}
      >
        {(collReq === "/expenses" || collReq === "/sales") && (
          <button
            id="date"
            className="input_show_item head"
            style={{ width: report?.type ? "17%" : "11%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "date");
            }}
          >
            تاريخ
          </button>
        )}

        {(collReq === "/sales" || collReq === "/clients") && (
          <button
            id="clientName"
            className="input_show_item head"
            style={{
              width: "18%",
            }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "clientName");
            }}
          >
            زبون
          </button>
        )}
        <button
          id="name"
          className="input_show_item head"
          style={{
            maxWidth: "15%",
            // : collReq === "/sales" || collReq === "/expenses"
            // ? "18%"
            // : "30%"
            minWidth: "15%",
            // : collReq === "/sales" || collReq === "/expenses"
            // ? "18%"
            // : "30%",
          }}
          onClick={(e) => {
            e.preventDefault();
            setKindOfSort(() => "name");
          }}
        >
          {collReq === "/clients" ? "الإقامه" : "المنتج"}
        </button>
        {collReq !== "/clients" && (
          <button
            id="number"
            className="input_show_item head"
            style={{
              width:
                collReq === "/sales"
                  ? "5%"
                  : collReq === "/expenses"
                  ? "10%"
                  : "15%",
            }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "number");
            }}
          >
            {collReq === "/inventories" || collReq === "/sales"
              ? "الثمن"
              : "المبلغ"}
          </button>
        )}
        {collReq === "/sales" && (
          <button
            id="discount"
            className="input_show_item head"
            style={{ width: "5%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "discount");
            }}
          >
            تخفيض
          </button>
        )}
        {collReq === "/sales" && (
          <button
            id="sale"
            className="input_show_item head"
            style={{ width: "6%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "sale");
            }}
          >
            المتبقي
          </button>
        )}
        {collReq === "/sales" && (
          <button
            id="quantity"
            className="input_show_item head"
            style={{ width: collReq === "/sales" ? "5%" : "7%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "quantity");
            }}
          >
            {"الكميه"}
          </button>
        )}
        {collReq === "/sales" && (
          <button
            id="tax"
            className="input_show_item head"
            style={{ width: "7%", textAlign: "center" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "tax");
            }}
          >
            تم الدفع
          </button>
        )}
        {(collReq === "/expenses" || collReq === "/sales") && (
          <button
            id="totalAmount"
            className="input_show_item head"
            style={{
              width:
                collReq === "/expenses"
                  ? "10%"
                  : collReq === "/sales"
                  ? "7%"
                  : "6%",
            }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "totalAmount");
            }}
          >
            المجموع
          </button>
        )}

        {!report?.type && (
          <button
            style={{
              visibility: "hidden",
              width: collReq === "/sales" ? "7%" : "11%",
            }}
            className="edit_btn"
          >
            تعديل
          </button>
        )}
        {!report?.type && (
          <button
            style={{
              visibility: "hidden",
              width: collReq === "/sales" ? "7%" : "11%",
            }}
            className="delete_btn"
          >
            حذف
          </button>
        )}
      </form>

      {(!fetchingStatus.loading || fetchedData.length > 0) &&
        filterByReport(sortedInventory(kindOfSort)).map((item) => {
          return (
            <ItemsTable
              key={`item${item._id}`}
              item={item}
              itemInChange={itemInChange}
              setItemInChange={setItemInChange}
              myData={fetchedData}
              selectData={clients}
              setItemIsUpdated={setItemIsUpdated}
              collReq={collReq}
              report={report}
            />
          );
        })}

    </div>
  );
}
