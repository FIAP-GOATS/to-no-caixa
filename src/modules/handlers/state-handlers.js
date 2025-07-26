//> This module defines state handlers for different user actions in the system.
export const createStateHandlers = ({ signupService, productService, supplierService }) => ({
  "WANTS TO SIGNUP": (message) => signupService.process?.({ message }),
  "WANTS TO ADD PRODUCT": (message) => productService.process?.({ message }),
  "WANTS TO ADD SUPPLIER": (message) => supplierService.process?.({ message }),
});
