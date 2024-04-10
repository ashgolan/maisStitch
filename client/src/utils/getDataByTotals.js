export const getDataByTotals = (data,isWorkers=false) => {
  const fetchingData = data?.sort((a, b) => (a.date > b.date ? 1 : -1));
  const dataByTotal = {};
  for (let i = 0; i < fetchingData.length; i++) {
    const year = new Date(fetchingData[i]?.date).getFullYear();
    const month =
      new Date(fetchingData[i]?.date).getMonth() + 1 < 10
        ? `0${new Date(fetchingData[i]?.date).getMonth() + 1}`
        : `${new Date(fetchingData[i]?.date).getMonth() + 1}`;
    const day = new Date(fetchingData[i].date).getDate();
    if (!dataByTotal.hasOwnProperty(year)) {
      const monthObj = { month: month, totalAmount: 0, dayInTheMonth: {} };
      if (!monthObj.dayInTheMonth.hasOwnProperty(day))
        monthObj.dayInTheMonth[`${day}/${month}`] =
          +fetchingData[i]?.totalAmount;
      monthObj.totalAmount += +fetchingData[i]?.totalAmount;
      dataByTotal[year] = [];
      dataByTotal[year].push(monthObj);
    } else {
      const findMonthObj = dataByTotal[year]?.find(
        (obj) => obj.month === month
      );
      if (!findMonthObj) {
        const monthObj = { month: month, totalAmount: 0, dayInTheMonth: {} };
        monthObj.dayInTheMonth[`${day}/${month}`] =
          +fetchingData[i]?.totalAmount;
        monthObj.totalAmount += +fetchingData[i]?.totalAmount;
        dataByTotal[year].push(monthObj);
      } else {
        dataByTotal[year].forEach((element) => {
          if (element.month === month) {
            if (element.dayInTheMonth.hasOwnProperty(`${day}/${month}`)) {
              element.dayInTheMonth[`${day}/${month}`] +=
                +fetchingData[i]?.totalAmount;
            } else {
              element.dayInTheMonth[`${day}/${month}`] =
                +fetchingData[i]?.totalAmount;
            }
            element.totalAmount += +fetchingData[i]?.totalAmount;
          }
        });
      }
    }
  }
  return dataByTotal;
};
