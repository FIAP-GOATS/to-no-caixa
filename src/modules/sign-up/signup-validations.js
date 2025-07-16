export default {
  isValidName(name) {
    // Ensure name is a string, blocked for emojis.
    if (typeof name !== "string") return false;

    // Regex to allow letters, numbers, and spaces
    const regex = /^[\p{L}\p{N}\s]+$/u;

    // Check if the name matches the regex and is not empty
    return regex.test(name) && name.trim().length > 0;
  },
  isValidEmail(email) {
    // Ensure email is a string
    if (typeof email !== "string") return false;

    // This regex checks for a basic email format: local-part@domain
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if the email matches the regex and trim any whitespace.
    return regex.test(email.trim());
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
  isValidText(text) {
    // Ensure text is a string
    if (typeof text !== "string") return false;

    // Regex to allow letters, numbers, spaces, and some punctuation
    const regex = /^[\p{L}\p{N}\s.,!?'"()\-]+$/u;

    // Check if the text matches the regex and is not empty
    return regex.test(text.trim()) && text.trim().length > 0;
  },
  isValidState(uf) {
    // Ensure uf is a string.
    if (typeof uf !== "string") return false;

    // List of valid Brazilian state abbreviations.
    const validUFs = [
      "AC",
      "AL",
      "AP",
      "AM",
      "BA",
      "CE",
      "DF",
      "ES",
      "GO",
      "MA",
      "MT",
      "MS",
      "MG",
      "PA",
      "PB",
      "PR",
      "PE",
      "PI",
      "RJ",
      "RN",
      "RS",
      "RO",
      "RR",
      "SC",
      "SP",
      "SE",
      "TO",
    ];

    // Check if the uf is in the list of valid UFs.
    return validUFs.includes(uf.trim().toUpperCase());
  },
  isValidCep(cep) {
    // Ensure cep is a string.
    if (typeof cep !== "string") return false;

    // Remove spaces and dashes.
    const cleaned = cep.trim();

    // Regex to validate Brazilian CEP format (5 digits, optional dash, 3 digits)
    const regex = /^\d{5}-?\d{3}$/;

    // Check if the cleaned CEP matches the regex
    return regex.test(cleaned);
  },
};
