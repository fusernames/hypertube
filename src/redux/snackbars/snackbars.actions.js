export function enqueueSnackbar(message, variant) {
  return {
    type: 'ENQUEUE_SNACKBAR',
    notification: {
      key: new Date().getTime() + Math.random(),
      message: message,
      options: {
        variant: variant
      }
    }
  }
}

export const removeSnackbar = key => ({
  type: 'REMOVE_SNACKBAR',
  key,
});
