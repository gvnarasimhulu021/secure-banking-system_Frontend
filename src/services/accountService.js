import api from "./apiService";

// balance
export const getBalance = () => api.get("/api/account/balance");

// deposit
export const deposit = (amount) =>
    api.post(`/api/account/deposit?amount=${amount}`);

// withdraw
export const withdraw = (amount) =>
    api.post(`/api/account/withdraw?amount=${amount}`);

// transfer
export const transfer = (toEmail, amount) =>
    api.post(`/api/account/transfer?toEmail=${toEmail}&amount=${amount}`);

// details
export const getDetails = () => api.get("/api/account/details");