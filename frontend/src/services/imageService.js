import reportApi from "./httpClients/reportApi"

export const imageService = {
  // Método para cargar una imagen. imageData debe ser un objeto FormData.
  uploadImage: (imageData) =>
    reportApi.post("/images/upload", imageData, {
      headers: {
        "Content-Type": "multipart/form-data", // Importante para el envío de archivos
      },
    }),
}
