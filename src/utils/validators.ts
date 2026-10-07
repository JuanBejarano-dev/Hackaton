const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isBlank = (value: string): boolean => value.trim().length === 0;

export const isValidEmail = (value: string): boolean => EMAIL_PATTERN.test(value.trim());

/** Al menos 8 caracteres, una mayúscula, una minúscula y un número. */
export const isStrongPassword = (value: string): boolean =>
  value.length >= 8 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value);
