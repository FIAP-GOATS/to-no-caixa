//> This module defines flow handlers for various operations in the system.
export const createFlowHandlers = ({ productService, supplierService, salleService, chatService }) => ({
  "CADASTRAR PRODUTO": (message) => productService.process?.({ message }),
  "CADASTRAR FORNECEDOR": async (message, chat) => {
    chat = await chatService.changeState({ id: chat.id, newState: "WANTS TO ADD SUPPLIER" })
    supplierService.process?.({ message, chat })
  },
  "ABRIR CAIXA": () => salleService.open?.({ timestamp: Date.now() }),
  "ATUALIZAR ESTOQUE": () => {/* implementar */},
  "VENDER": (message) => salleService.process?.({ message }),
  "CANCELAR VENDA": () => salleService.cancel?.(),
  "FECHAR CAIXA": () => salleService.close?.({ timestamp: Date.now() }),
});
