import reputationApi from "./httpClients/reputationApi";

export const reputationService = {
  // rating para avistamientos puede ser {useful,not_useful}
  // rating para hallazgos puede ser {useful,false_finding}
  rateResponse: (reportId, responseId, rating) =>
    reputationApi.post(`/api/rate-response/${reportId}/${responseId}`, {
      rating,
    }),
};
