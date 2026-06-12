import { describe, expect, it } from 'vitest'
import {
  isStrongPassword,
  isValidEmail,
  isValidPhone,
  validateCheckoutDetails
} from './validation'

describe('validation utilities', () => {
  it('validates email and phone basics', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('bad-email')).toBe(false)

    expect(isValidPhone('+371 20000000')).toBe(true)
    expect(isValidPhone('abc')).toBe(false)
  })

  it('validates strong password constraints', () => {
    expect(isStrongPassword('Weak1234').valid).toBe(false)
    expect(isStrongPassword('Strong!123').valid).toBe(true)
  })

  it('validates checkout details and reports reason', () => {
    const invalidEmail = validateCheckoutDetails({
      receiptEmail: 'not-an-email',
      country: 'LV',
      firstName: 'Jane',
      lastName: 'Doe',
      addressLine: 'Street 1',
      city: 'Riga',
      postalCode: 'LV-1010',
      phoneNumber: '+371 20000000'
    })
    expect(invalidEmail.valid).toBe(false)
    expect(invalidEmail.reason).toBe('email')

    const valid = validateCheckoutDetails({
      receiptEmail: 'jane@example.com',
      country: 'LV',
      firstName: 'Jane',
      lastName: 'Doe',
      addressLine: 'Street 1',
      city: 'Riga',
      postalCode: 'LV-1010',
      phoneNumber: '+371 20000000'
    })
    expect(valid.valid).toBe(true)
    expect(valid.reason).toBe(null)
  })
})
