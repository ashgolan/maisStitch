const allCategories = [
  {
    name: "כללי",
  },
  {
    name: "חלון 1300",
  },
  {
    name: "חלון 1700",
  },
  {
    name: "חלון 4500",
  },
  {
    name: "חלון 7000",
  },
  {
    name: "חלון 7300",
  },
  {
    name: "חלון 9000",
  },
  {
    name: "בלגי 4300",
  },
  {
    name: "פרופילים 2000",
  },
  {
    name: "דלת קליפס ודלת רשת",
  },
];

export const allCategoriesSelect = allCategories?.map((item) => {
  return { value: item.name, label: item.name };
});
