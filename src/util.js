function toCamelCase(obj) {
    if (!obj || typeof obj !== 'object') return obj;

    const toCamel = (str) =>
        str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

    return Object.entries(obj).reduce((acc, [key, value]) => {
        acc[toCamel(key)] = value;
        return acc;
    }, {});
}

export {
    toCamelCase
}