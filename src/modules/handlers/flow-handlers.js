//> This module defines flow handlers for various operations in the system.
export const createFlowHandlers = ({ productService, supplierService, salleService }) => ({
  "CADASTRAR PRODUTO": (message) => productService.process?.({ message }),
  "CADASTRAR FORNECEDOR": (message) => supplierService.process?.({ message }),
  "ABRIR CAIXA": () => salleService.open?.({ timestamp: Date.now() }),
  "ATUALIZAR ESTOQUE": () => {/* implementar */},
  "VENDER": (message) => salleService.process?.({ message }),
  "CANCELAR VENDA": () => salleService.cancel?.(),
  "FECHAR CAIXA": () => salleService.close?.({ timestamp: Date.now() }),
});
