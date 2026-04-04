import reportApi from "./httpClients/reportApi";

export const reportService = {
  // Método para crear un reporte
  createReport: (reportData) => reportApi.post("/reports/", reportData),

  // Método para obtener todos los reportes
  getAllReports: (lat, lng, radius, limit = 12, offset = 0, pet_type = null) =>
    reportApi.get("/reports", {
      params: {
        lat,
        lng,
        radius,
        limit,
        offset,
        pet_type,
      },
    }),

  // Método para obtener un reporte específico por ID
  getReportById: (reportId) => reportApi.get(`/reports/${reportId}`),

  // Método para actualizar un reporte
  updateReport: (reportId, reportData) =>
    reportApi.patch(`/reports/${reportId}`, reportData),

  // Método para eliminar un reporte
  deleteReport: (reportId) => reportApi.delete(`/reports/${reportId}`),

  markAsClosed: (reportId) => reportApi.post(`/reports/${reportId}/close`),
};