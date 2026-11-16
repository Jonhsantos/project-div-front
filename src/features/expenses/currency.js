export function formatCurrencyInput(value) {
  const digits = value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 12)
  if (!digits) return value.replace(/\D/g, '') ? '0,00' : ''
  const padded = digits.padStart(3, '0')
  const whole = padded.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${whole},${padded.slice(-2)}`
}

export function currencyToDecimal(value) {
  return value.replace(/\./g, '').replace(',', '.')
}
