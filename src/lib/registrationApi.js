import api from "@/lib/api";

// ==========================================
// REGISTER FOR EVENT
// ==========================================

export const registerForEvent = async (data) => {
  const { data: response } = await api.post(
    "/registerEvent",
    data
  );

  return response;
};


// ==========================================
// FIND USER BY PUBLIC USER ID
// ==========================================

export const findUserByUserId = async (userId) => {
  const { data } = await api.get(
    `/auth/user/${userId}`
  );

  return data.user;
};


// ==========================================
// GET MY REGISTRATIONS
// ==========================================

export const getMyRegistrations = async () => {
  const { data } = await api.get(
    "/registerEvent/my-registrations"
  );

  return data.registrations;
};