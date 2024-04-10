export const getCollectionProps = (collReq) => {
  switch (collReq) {
    case "/clients":
      return ["clientName", "name"];
    case "/expenses":
      return ["name", "number", "date", "taxPercent", "totalAmount"];
    case "/sales":
      return [
        "date",
        "clientName",
        "number",
        "tax",
        "name",
        "price",
        "sale",
        "discount",
        "totalAmount",
      ];
    default:
      return false;
  }
};
