import axiosInstance from "../services/axiosInstance";
import { setError, activateLoading, closeLoading } from "./actionsSlice";

const methodMap = {
  get: axiosInstance.get,
  post: axiosInstance.post,
  put: axiosInstance.put,
  delete: axiosInstance.delete,
};

export default async function FetchApi(url, dispatch, errorLabel = "Не предвиденная ошибка", type = "get", data = {}) {
  dispatch(activateLoading());
  try {
    const response = await methodMap[type](url, data);
    return response.data;
  } catch (error) {
    dispatch(setError(`${errorLabel}: ${error.message}`));
    throw error;
  } finally {
    dispatch(closeLoading());
  }
}
