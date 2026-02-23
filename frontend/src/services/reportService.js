import reportApi from "./httpClients/reportApi";

export const reportService = {
  // Método para crear un reporte
  createReport: (reportData) => reportApi.post("/reports/", reportData),

  // Método para obtener todos los reportes
  getAllReports: () => reportApi.get("/reports/public"),

  // Método para obtener un reporte específico por ID
  getReportById: (reportId) => reportApi.get(`/reports/public/${reportId}`),

  // Método para actualizar un reporte
  updateReport: (reportId, reportData) =>
    reportApi.put(`/reports/${reportId}`, reportData),

  // Método para eliminar un reporte
  deleteReport: (reportId) => reportApi.delete(`/reports/${reportId}`),

  markAsClosed: (reportId) => reportApi.put(`/reports/${reportId}/close`),
};