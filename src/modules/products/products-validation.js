/// :: Validations to avoid emojis or other kind of unwanted characters in product fields.

export default {
  isValidName(name) {
    if (typeof name !== "string") return false;
    const regex = /^[\p{L}\p{N}\s]+$/u;
    return regex.test(name) && name.trim().length > 0;
  },

  isValidInventory(inventory) {
    if (typeof inventory !== "string") return false;
    const num = Number(inventory);
    return Number.isInteger(num) && num >= 0;
  },

  isValidCostPrice(costPrice) {
    // accept string like "5,00" or "5.00" or numeric values
    if (typeof costPrice !== "string" && typeof costPrice !== 'number') return false;
    const normalized = String(costPrice).replace(',', '.').trim();
    const num = Number(normalized);
    return Number.isFinite(num) && num >= 0;
  },

  isValidSalePrice(salePrice) {
    // accept string like "5,00" or "5.00" or numeric values
    if (typeof salePrice !== "string" && typeof salePrice !== 'number') return false;
    const normalized = String(salePrice).replace(',', '.').trim();
    const num = Number(normalized);
    return Number.isFinite(num) && num >= 0;
  },

  isValidSupplierName(supplierName) {
    if (typeof supplierName !== "string") return false;
    return this.isValidName(supplierName);
  },

  isValidProduct(product) {
    return (
      this.isValidName(product.name) &&
      this.isValidInventory(product.inventory) &&
      this.isValidCostPrice(product.cost_price) &&
      this.isValidSalePrice(product.sale_price) &&
      (product.supplier_name
        ? this.isValidSupplierName(product.supplier_name)
        : true)
    );
  },
};
