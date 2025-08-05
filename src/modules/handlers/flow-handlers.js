//> This module defines flow handlers for various operations in the system.
export const createFlowHandlers = ({ productService, supplierService, salleService, chatService }) => ({
  "CADASTRAR PRODUTO": async (message, chat) => {
    chat = await chatService.changeState({id: chat.id, newState:"WANTS TO ADD PRODUCT"})
    productService.process?.({ message, chat })},
  "CADASTRAR FORNECEDOR": async (message, chat) => {
    chat = await chatService.changeState({ id: chat.id, newState: "WANTS TO ADD SUPPLIER" })
    supplierService.process?.({ message, chat })
  },
  "ATUALIZAR ESTOQUE": () => {/* implementar */},
  "VENDER": (message) => salleService.process?.({ message }),
  "CANCELAR VENDA": () => salleService.cancel?.(),
});
