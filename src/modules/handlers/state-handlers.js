//> This module defines state handlers for different user actions in the system.
export const createStateHandlers = ({ signupService, productService, supplierService }) => ({
  "WANTS TO SIGNUP": (message) => signupService.process?.({ message }),
  "WANTS TO ADD PRODUCT": (message, chat) => productService.process?.({ message, chat }),
  "WANTS TO ADD SUPPLIER": (message, chat) => supplierService.process?.({ message, chat }),
});
