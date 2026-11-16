import test from 'node:test'
import assert from 'node:assert/strict'
import { reportFilename } from './filename.js'

test('gera nome legível e seguro para o relatório', () => {
  assert.equal(reportFilename('Instalação', 'São Paulo'), 'Instalação São Paulo relatório.pdf')
  assert.equal(reportFilename('Visita/obra', 'São Paulo: SP'), 'Visita obra São Paulo SP relatório.pdf')
  assert.equal(reportFilename('..', ' / '), 'viagem viagem relatório.pdf')
  assert.ok(new TextEncoder().encode(reportFilename('🚀'.repeat(100), '📍'.repeat(100))).length < 255)
})
