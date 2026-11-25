import { describe, it, expect } from 'vitest'
import { INITIAL_PROPOSALS, RELEASE_GATES } from './data'
import { dispatchSDLCEvent } from './services/eventBus'

describe('Lokatalenta Approval Portal Core Domain', () => {
  it('loads all 6 official SDLC proposals', () => {
    expect(INITIAL_PROPOSALS.length).toBe(6)
    const ids = INITIAL_PROPOSALS.map(p => p.id)
    expect(ids).toContain('PRP-2101')
    expect(ids).toContain('PRP-2102')
    expect(ids).toContain('PRP-2104')
    expect(ids).toContain('PRP-2106')
  })

  it('contains correctly mapped authors and divisions', () => {
    const prp2102 = INITIAL_PROPOSALS.find(p => p.id === 'PRP-2102')
    expect(prp2102).toBeDefined()
    expect(prp2102?.author).toBe('#1 Raka Mahendra')
    expect(prp2102?.status).toBe('approved')
    expect(prp2102?.approvedBy).toBe('#0 Rizco Renova')
  })

  it('validates release gates criteria', () => {
    expect(RELEASE_GATES.length).toBeGreaterThanOrEqual(5)
    const requiredKeys = ['RG-01', 'RG-02', 'RG-03', 'RG-04', 'RG-05']
    const gateIds = RELEASE_GATES.map(g => g.id)
    requiredKeys.forEach(key => expect(gateIds).toContain(key))
  })

  it('dispatches cross-portal SDLC events reliably without throwing', () => {
    expect(() => {
      dispatchSDLCEvent({
        type: 'proposal_approved',
        proposalId: 'PRP-2101',
        proposalTitle: 'LMS Hexagonal Theme Token Engine',
        notes: 'Disetujui penuh oleh Team Lead.',
        timestamp: '19:00',
      })
    }).not.toThrow()
  })
})
