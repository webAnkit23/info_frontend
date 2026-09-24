import api from "./api";


// =========================================
// GET ALL EVENTS
// PUBLIC
// Login is NOT required
// =========================================

export const getEvents = async () => {
  const response = await api.get("/events");

  return response.data;
};


// =========================================
// GET SINGLE EVENT
// PUBLIC
// =========================================

export const getEventById = async (id) => {
  const response =
    await api.get(`/events/${id}`);

  return response.data;
};


// =========================================
// GET MY REGISTRATIONS
// PROTECTED
// Login IS required
// =========================================

export const getMyRegistrations = async () => {

  const { data } =
    await api.get(
      "/registerEvent/my-registrations"
    );

  return data.registrations;
};