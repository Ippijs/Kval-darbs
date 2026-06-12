export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PHONE_REGEX = /^[0-9+\-()\s]{7,20}$/

export function isValidEmail(value) {
  return EMAIL_REGEX.test(String(value || '').trim())
}

export function isValidPhone(value) {
  return PHONE_REGEX.test(String(value || '').trim())
}

export function isStrongPassword(value) {
  const password = String(value || '')
  const hasUpperCase = /[A-Z]/.test(password)
  const hasSpecialChar = /[@!#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password)
  const isLongEnough = password.length >= 8
  const noSpaces = password.trim() === password

  return {
    valid: hasUpperCase && hasSpecialChar && isLongEnough && noSpaces,
    hasUpperCase,
    hasSpecialChar,
    isLongEnough,
    noSpaces
  }
}

export function validateCheckoutDetails(details) {
  const normalized = {
    receiptEmail: String(details?.receiptEmail || '').trim(),
    country: String(details?.country || '').trim(),
    firstName: String(details?.firstName || '').trim(),
    lastName: String(details?.lastName || '').trim(),
    addressLine: String(details?.addressLine || '').trim(),
    city: String(details?.city || '').trim(),
    postalCode: String(details?.postalCode || '').trim(),
    phoneNumber: String(details?.phoneNumber || '').trim()
  }

  const missingField = Object.values(normalized).some((value) => !value)
  if (missingField) {
    return { valid: false, reason: 'required' }
  }

  if (!isValidEmail(normalized.receiptEmail)) {
    return { valid: false, reason: 'email' }
  }

  if (!isValidPhone(normalized.phoneNumber)) {
    return { valid: false, reason: 'phone' }
  }

  return { valid: true, reason: null }
}
