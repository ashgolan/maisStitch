import React, { useState } from "react";
import { useEffect } from "react";
import DeleteItem from "../Delete_Item/DeleteItem";
import EditItem from "../Edit_Item/EditItem";
import "./Item_Table.css";
import Select from "react-select";

export default function ItemsTable({
  item,
  itemInChange,
  setItemInChange,
  myData,
  setItemIsUpdated,
  collReq,
  selectData,
  report,
}) {
  const [changeStatus, setChangeStatus] = useState({
    editText: "تعديل",
    delete: "حذف",
    disabled: true,
    itemId: null,
  });
  const [itemsValues, setItemsValues] = useState({
    name: "",
    clientName: "",
    number: "",
    discount: "",
    sale: "",
    expenses: "",
    quantity: "",
    colored: false,
    date: "",
    tax: false,
    totalAmount: 0,
  });
  useEffect(() => {
    const getData = async () => {
      const thisItem = myData?.find((t) => t._id === item._id);
      setItemsValues((prev) => {
        return {
          name: thisItem.name ? thisItem.name : "",
          clientName: thisItem.clientName ? thisItem.clientName : "",
          number: thisItem.number ? thisItem.number : "",
          discount: thisItem.discount ? thisItem.discount : "",
          sale: thisItem.sale ? thisItem.sale : "",
          expenses: thisItem.expenses ? thisItem.expenses : "",
          quantity: thisItem.quantity ? thisItem.quantity : "",
          colored: thisItem.colored ? thisItem.colored : false,
          date: thisItem.date ? thisItem.date : "",
          tax: thisItem.tax ? thisItem.tax : false,
          totalAmount: thisItem.totalAmount ? thisItem.totalAmount : "",
        };
      });
    };
    getData();
  }, [item._id, myData]);

  const allTaxSelect = [
    { value: true, label: "نعم" },
    { value: false, label: "لا" },
  ].map((item) => {
    return { value: item.value, label: item.label };
  });
  const customStyles = {
    control: (base, state) => ({
      ...base,
      textAlign: "right",
      border: "none",
      backgroundColor: "white",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      // display: report?.type !== undefined && "none",
      display: "none",
    }),
    option: (provided, state) => ({
      ...provided,
      padding: "10px", // Adjust padding as needed
      background: state.isFocused ? "gold" : "rgb#ffd900",
      color: state.isFocused ? "rgb(48, 45, 45)" : "inherit",
    }),
    singleValue: (provided, styles, state) => ({
      ...provided,
      ...styles,
      color: state?.isSelected ? "red" : "black",

      margin: "0",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: itemsValues.colored ? "rgb(255, 71, 46)" : "black",
    }),
    menu: (base) => ({
      ...base,
      textAlign: "center",
    }),
  };

  const allSelectedTypesData = [
    { value: "1", label: "فوطه" },
    { value: "2", label: "طاره" },
    { value: "3", label: "محرمه" },
    { value: "4", label: "لوغو" },
  ].map((item) => {
    return { value: item.value, label: item.label };
  });
  const allSelectData = selectData?.map((item) => {
    return { value: item._id, label: item.clientName };
  });
  const changeColorOfClientName = (e) => {
    setItemsValues((prev) => {
      return { ...prev, colored: !prev.colored };
    });
  };

  return (
    <>
      <form
        className="Item_form"
        key={`form${item.id}`}
        style={{
          width: collReq === "/inventories" ? "60%" : "95%",
        }}
      >
        {(collReq === "/expenses" || collReq === "/sales") && (
          <input
            id="date"
            type="date"
            className="input_show_item"
            style={{ width: report?.type ? "17%" : "11%" }}
            disabled={changeStatus.disabled}
            value={itemsValues.date}
            onChange={(e) => {
              setItemsValues((prev) => {
                return { ...prev, date: e.target.value };
              });
            }}
          ></input>
        )}
        {collReq === "/sales" ||
          (collReq === "/clients" && (
            <input
              id="clientName"
              className="input_show_item"
              style={{
                width: "18%",
                color: itemsValues.colored ? "rgb(255, 71, 46)" : "black",
              }}
              disabled={changeStatus.disabled}
              value={itemsValues.clientName}
              onChange={(e) => {
                setItemsValues((prev) => {
                  return { ...prev, clientName: e.target.value };
                });
              }}
            ></input>
          ))}
        {collReq === "/sales" && (
          <Select
            options={allSelectData}
            className="input_show_item select-product-head "
            placeholder={
              itemsValues?.clientName ? itemsValues.clientName : "בחר חקלאי"
            }
            isDisabled={changeStatus.disabled}
            styles={customStyles}
            menuPlacement="auto"
            required
            value={itemsValues.clientName}
            onChange={(e) => {
              setItemsValues((prev) => {
                return {
                  ...prev,
                  name: "",
                  clientName: e.label,
                };
              });
            }}
          ></Select>
        )}

        {collReq === "/sales" && (
          <Select
            options={allSelectedTypesData}
            className="input_show_item select-product "
            placeholder={itemsValues?.name ? itemsValues.name : "اختر منتج"}
            isDisabled={changeStatus.disabled}
            styles={customStyles}
            menuPlacement="auto"
            required
            defaultValue={itemsValues.name}
            onChange={(e) => {
              setItemsValues((prev) => {
                return {
                  ...prev,
                  name: e.label,
                };
              });
            }}
          ></Select>
        )}
        {collReq !== "/sales" && (
          <input
            id="name"
            className="input_show_item"
            style={{
              width: "15%",
            }}
            disabled={changeStatus.disabled}
            value={itemsValues.name}
            onChange={(e) => {
              setItemsValues((prev) => {
                return { ...prev, name: e.target.value };
              });
            }}
          ></input>
        )}
        {collReq !== "/clients" && (
          <input
            id="number"
            className="input_show_item"
            style={{
              width:
                collReq === "/sales"
                  ? "5%"
                  : collReq === "/contacts" || collReq === "/expenses"
                  ? "10%"
                  : "15%",
            }}
            onDoubleClick={changeColorOfClientName}
            disabled={changeStatus.disabled}
            value={itemsValues.number}
            onChange={(e) => {
              setItemsValues((prev) => {
                return {
                  ...prev,
                  number: e.target.value,
                  sale:
                    collReq === "/sales"
                      ? +e.target.value -
                        (+prev.discount * +e.target.value) / 100
                      : 0,
                  totalAmount: !(collReq === "/sales")
                    ? +prev.quantity
                      ? +e.target.value * +prev.quantity
                      : +e.target.value
                    : (+e.target.value -
                        (+e.target.value * +prev.discount) / 100) *
                      +prev.quantity,
                };
              });
            }}
          ></input>
        )}
        {collReq === "/sales" && (
          <input
            id="discount"
            className="input_show_item"
            style={{ width: "5%" }}
            disabled={changeStatus.disabled}
            value={itemsValues.discount}
            onChange={(e) => {
              setItemsValues((prev) => {
                return {
                  ...prev,
                  discount: e.target.value,
                  sale: +prev.number - (+prev.number * +e.target.value) / 100,
                  totalAmount:
                    (+prev.number - (+prev.number * +e.target.value) / 100) *
                    +prev.quantity,
                };
              });
            }}
          ></input>
        )}
        {collReq === "/sales" && (
          <input
            id="sale"
            className="input_show_item"
            style={{ width: "6%" }}
            disabled
            value={itemsValues.sale}
          ></input>
        )}
        {collReq === "/sales" && (
          <input
            id="quantity"
            className="input_show_item"
            style={{ width: collReq === "/sales" ? "5%" : "7%" }}
            disabled={changeStatus.disabled}
            value={itemsValues.quantity}
            onChange={(e) => {
              setItemsValues((prev) => {
                return {
                  ...prev,
                  quantity: e.target.value,
                  totalAmount:
                    collReq === "/sales"
                      ? (+prev.number - (+prev.number * +prev.discount) / 100) *
                          +e.target.value -
                        +prev.expenses
                      : e.target.value * prev.number,
                };
              });
            }}
          ></input>
        )}

        {collReq === "/sales" && (
          <Select
            id="tax"
            options={allTaxSelect}
            className="input_show_item select-category"
            isDisabled={changeStatus.disabled}
            placeholder={itemsValues?.tax === true ? "نعم" : "لا"}
            defaultValue={itemsValues.tax}
            onChange={(e) => {
              setItemsValues((prev) => {
                return { ...prev, tax: e.value };
              });
            }}
            menuPlacement="auto"
            styles={customStyles}
            required
          />
        )}

        {(collReq === "/expenses" || collReq === "/sales") && (
          <input
            id="totalAmount"
            className="input_show_item"
            style={{
              width:
                collReq === "/expenses"
                  ? "10%"
                  : collReq === "/sales"
                  ? "7%"
                  : "6%",
            }}
            disabled
            value={+itemsValues.totalAmount.toFixed(2)}
          ></input>
        )}
        {!report?.type && (
          <EditItem
            item={item}
            itemInChange={itemInChange}
            setItemInChange={setItemInChange}
            changeStatus={changeStatus}
            setChangeStatus={setChangeStatus}
            itemsValues={itemsValues}
            setItemIsUpdated={setItemIsUpdated}
            collReq={collReq}
          ></EditItem>
        )}
        {!report?.type && (
          <DeleteItem
            itemInChange={itemInChange}
            setItemInChange={setItemInChange}
            item={item}
            changeStatus={changeStatus}
            setChangeStatus={setChangeStatus}
            setItemsValues={setItemsValues}
            setItemIsUpdated={setItemIsUpdated}
            collReq={collReq}
          ></DeleteItem>
        )}
      </form>
    </>
  );
}
