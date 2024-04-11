import React, { useState } from "react";
import { useContext } from "react";
import "./Delete_Item.css";
import { FetchingStatus } from "../../../utils/context";
import { Api } from "../../../utils/Api";
import { useNavigate } from "react-router";
import { refreshMyToken } from "../../../utils/setNewAccessToken";
import { clearTokens, getAccessToken } from "../../../utils/tokensStorage";
export default function DeleteItem({
  itemInChange,
  setItemInChange,
  changeStatus,
  setChangeStatus,
  setItemsValues,
  item,
  setItemIsUpdated,
  collReq,
}) {
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [fetchingStatus, setFetchingStatus] = useContext(FetchingStatus);
  const sendDeleteRequest = async (token) => {
    const headers = { Authorization: token };
    await Api.delete(`${collReq}/${item._id}`, {
      data: item,
      headers: headers,
    });
    setFetchingStatus((prev) => {
      return { ...prev, loading: false, message: "המוצר נמחק בהצלחה" };
    });
    setTimeout(() => {
      setFetchingStatus((prev) => {
        return { ...prev, status: false, message: null };
      });
      setItemIsUpdated((prev) => !prev);
    }, 1000);
  };
  const deleteData = async () => {
    try {
      await sendDeleteRequest(getAccessToken());
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          const newAccessToken = await refreshMyToken();
          try {
            await sendDeleteRequest(newAccessToken);
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
            message: ".. תקלה בביטול ההזמנה",
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

  const deleteHandler = (e) => {
    e.preventDefault();

    setChangeStatus((prev) => {
      return {
        editText: prev.delete === "حذف" ? "إلغاء" : "تعديل",
        delete: prev.delete === "حذف" ? "موافق" : "حذف",
        disabled: true,
        itemId: prev.delete === "حذف" ? item._id : null,
      };
    });
    if (changeStatus.delete === "إلغاء") {
      setItemsValues(item);
      setFetchingStatus((prev) => {
        return {
          ...prev,
          status: false,
          message: null,
        };
      });
    }
    if (changeStatus.delete === "موافق") {
      deleteData();
    }
    setItemInChange(!itemInChange);
  };
  return (
    <button
      style={{
        width: collReq === "/sales" ? "7%" : "11%",
        visibility:
          !itemInChange || changeStatus.itemId === item._id
            ? "visible"
            : "hidden",
      }}
      className="delete_btn"
      onClick={(e) => deleteHandler(e)}
    >
      {changeStatus.delete}
    </button>
  );
}
