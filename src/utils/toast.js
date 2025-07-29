// utils/toast.js
import { toast } from 'react-toastify';

// Success toast
export const showSuccessToast = (message) => toast.success(message);

// Error toast
export const showErrorToast = (message) => toast.error(message);

// Info toast
export const showInfoToast = (message) => toast.info(message);

// Warning toast
export const showWarnToast = (message) => toast.warn(message);
