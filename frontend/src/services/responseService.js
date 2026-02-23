import reportApi from "./httpClients/reportApi";

export const responseService = {
  // Método para crear una respuesta a un reporte
  createResponse: (reportId, responseData) =>
    reportApi.post(`/responses/${reportId}`, responseData),

  // Método para obtener todas las respuestas de un reporte
  getResponsesByReportId: (reportId) =>
    reportApi.get(`/responses/${reportId}/allResponses`),

  // Método para obtener solo una respuesta de las respuestas de un reporte
  getResponseById: (reportId, responseId) =>
    reportApi.get(`/responses/${reportId}/${responseId}`),

  // Método para actualizar una respuesta
  updateResponse: (reportId, responseId, responseData) =>
    reportApi.put(`/responses/${reportId}/${responseId}/put`, responseData),

  // Método para eliminar una respuesta
  deleteResponse: (reportId, responseId) =>
    reportApi.delete(`/responses/${reportId}/${responseId}/delete`),
};