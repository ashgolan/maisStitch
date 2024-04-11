export const getCollectionProps = (collReq) => {
  switch (collReq) {
    case "/clients":
      return ["clientName", "name"];
    case "/expenses":
      return ["name", "number", "date", "totalAmount"];
    case "/sales":
      return [
        "date",
        "clientName",
        "number",
        "quantity",
        "tax",
        "name",
        "sale",
        "discount",
        "totalAmount",
      ];
    default:
      return false;
  }
};
