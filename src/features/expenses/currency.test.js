import test from 'node:test'
import assert from 'node:assert/strict'
import { currencyToDecimal, formatCurrencyInput } from './currency.js'

test('formata centavos e converte sem usar ponto flutuante', () => {
  assert.equal(formatCurrencyInput('1'), '0,01')
  assert.equal(formatCurrencyInput('1234'), '12,34')
  assert.equal(formatCurrencyInput('123456'), '1.234,56')
  assert.equal(formatCurrencyInput('45.90'), '45,90')
  assert.equal(formatCurrencyInput('0'), '0,00')
  assert.equal(formatCurrencyInput(''), '')
  assert.equal(formatCurrencyInput('9999999999999'), '9.999.999.999,99')
  assert.equal(currencyToDecimal('1.234,56'), '1234.56')
})
