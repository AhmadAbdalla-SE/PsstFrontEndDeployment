export const Gender = {
  MALE: 0,
  FEMALE: 1,
};

export const GenderLabel = {
  [Gender.MALE]: "Male",
  [Gender.FEMALE]: "Female",
};

export const Role = {
  USER: 0,
  ADMIN: 1,
};

export const Provider = {
  SYSTEM: 0,
  GOOGLE: 1,
};

export const LoginType = {
  REGULAR: 0,
  TWO_STEP: 1,
};

export const LogoutAction = {
  THIS_DEVICE: 0,
  ALL_DEVICES: 1,
};

export const RequestStatus = {
  REJECTED: 0,
  ACCEPTED: 1,
  PENDING: 2,
};

export const RequestStatusLabel = {
  [RequestStatus.REJECTED]: "Declined",
  [RequestStatus.ACCEPTED]: "Revealed",
  [RequestStatus.PENDING]: "Waiting",
};

export const MessageFeed = {
  RECEIVED: "0",
  SENT: "1",
  ALL: "2",
};

export const RequestFeed = {
  INCOMING: "0",
  OUTGOING: "1",
  BOTH: "2",
};
