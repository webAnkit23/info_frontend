import api from "./api";

export const getEvents = async () => {
  const response = await api.get("/events");
  return response.data;
};

export const getEventById = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};




export const getMyRegistrations = async () => {
  const { data } = await api.get("/registerEvent/my-registrations");
  return data.registrations;
};