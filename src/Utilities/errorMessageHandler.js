import toast from 'react-hot-toast';

export function errorMessageHandler(actionData, successMessage, errorMessage) {
  if (actionData && actionData.error) {

    toast.error(actionData.error.response.data.message || errorMessage);
  }
}

// Utility function to perform redirectio
