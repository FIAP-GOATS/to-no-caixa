export default {
  isValidName(name) {
    // Ensure name is a string, blocked for emojis.
    if (typeof name !== "string") return false;

    // Regex to allow letters, numbers, and spaces
    const regex = /^[\p{L}\p{N}\s]+$/u;

    // Check if the name matches the regex and is not empty
    return regex.test(name) && name.trim().length > 0;
  },
  isValidCNPJ(cnpj) {
    // Ensure CNPJ is a string
    if (typeof cnpj !== "string") return false;

    // Remove non-numeric characters
    const cleaned = cnpj.replace(/\D/g, "");
    if (cleaned.length !== 14 || /^(\d)\1+$/.test(cleaned)) return false;

    // Validate CNPJ using the check digits
    const calcCheckDigit = (digits, positions) => {
      let sum = 0;
      for (let i = 0; i < positions.length; i++) {
        sum += parseInt(digits.charAt(i)) * positions[i];
      }

      // Calculate the check digit
      const remainder = sum % 11;

      // If remainder is less than 2, check digit is 0, otherwise it's 11 - remainder
      return remainder < 2 ? 0 : 11 - remainder;
    };

    // Calculate the first and second check digits
    const base = cleaned.slice(0, 12);

    // The first 12 digits are the base for the check digits
    const digit1 = calcCheckDigit(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

    // The second check digit is calculated using the first 13 digits
    const digit2 = calcCheckDigit(
      base + digit1,
      [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    );

    // Check if the cleaned CNPJ matches the base + check digits
    return cleaned === base + digit1.toString() + digit2.toString();
  },
  isValidCPF(cpf) {
    // Ensure CPF is a string
    if (typeof cpf !== "string") return false;

    // Remove non-numeric characters
    const cleaned = cpf.replace(/\D/g, "");
    if (cleaned.length !== 11 || /^(\d)\1+$/.test(cleaned)) return false;

    // Validate CPF using the check digits
    const calcCheckDigit = (digits, positions) => {
      let sum = 0;
      for (let i = 0; i < positions.length; i++) {
        sum += parseInt(digits.charAt(i)) * positions[i];
      }

      // Calculate the check digit
      const remainder = sum % 11;

      // If remainder is less than 2, check digit is 0, otherwise it's 11 - remainder
      return remainder < 2 ? 0 : 11 - remainder;
    };

    // Calculate the first and second check digits
    const base = cleaned.slice(0, 9);
    const digit1 = calcCheckDigit(base, [10, 9, 8, 7, 6, 5, 4, 3, 2]);
    const digit2 = calcCheckDigit(base + digit1, [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);

    // Check if the cleaned CPF matches the base + check digits
    return cleaned === base + digit1.toString() + digit2.toString();
  },

  isValidCPForCNPJ(cpfOrCnpj) {
    // Check if the input is a valid CNPJ
    if (this.isValidCNPJ(cpfOrCnpj)) {
      return true;
    }
    // Check if the input is a valid CPF
    if (this.isValidCPF(cpfOrCnpj)) {
      return true;
    }
    // If neither, return false
    return false;
  }
};
