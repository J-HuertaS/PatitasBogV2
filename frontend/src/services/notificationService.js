import notificationApi from "./httpClients/notificationApi";

export const notificationService = {
  getCurrentUserNotifications: () => notificationApi.get("/notifications"),

  markAllAsRead: () => notificationApi.patch("/notifications/read-all"),

  getUnreadNotificationsCount: () =>
    notificationApi.get("/notifications/unread-count"),

  createNotification: (notificationData) =>
    notificationApi.post("/notifications/webhook", notificationData),

  getNotificationById: (notificationId) =>
    notificationApi.get(`/notifications/${notificationId}`),

  markNotificationAsRead: (notificationId) =>
    notificationApi.patch(`/notifications/${notificationId}/read`),
};
