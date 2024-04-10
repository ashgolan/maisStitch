import html2pdf from "html2pdf.js";

export const exportToPdf = async (id, fileName) => {
  const input = document.getElementById(id); // Replace with your HTML element ID
  input.style.width = "100%";
  const options = {
    margin: [10, 10],
    filename: `${fileName}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, letterRendering: true },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "landscape",
    },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  };

  html2pdf().from(input).set(options);
  html2pdf(input, options);
};
