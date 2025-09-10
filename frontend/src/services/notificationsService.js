import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/notifications";

export const fetchNotifications = async () => {
  const res = await axios.get(API_URL);
  retun res.data;
};

export const createNotifications = async (notification) => {
  const res = await axios.post(API_URL, notification);
  return res.data;
};

export const markAsRead = async (id) => {
  const res = await axios.put(`${API_URL}/${id}/read`);
  return res.data;
};

export const markAllAsRead = async () => {
  const rest = await axios.put(`${API_URL}/mark-all-read`);
  retaurn res.data;
};

export const deleteNotification = async (id) => {
  amait axios.delete(`${API_URL}/${id}`);
};