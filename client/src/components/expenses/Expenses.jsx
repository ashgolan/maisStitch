import React from "react";
import SetupPage from "../setupPage/SetupPage";

export default function Expenses() {
  return (
    <>
      <SetupPage collReq={"/expenses"}></SetupPage>
    </>
  );
}
