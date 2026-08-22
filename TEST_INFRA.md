# E2E Test Infra: Academic Lab CMS & Live Public Sync

## Test Philosophy
- Opaque-box, requirement-driven testing. Derived strictly from `ORIGINAL_REQUEST.md`.
- Methodology: Category-Partition + Boundary Value Analysis (BVA) + Pairwise Interaction + Real-World Workload Testing.

## Feature Inventory
| # | Feature | Source (Requirement) | Tier 1 | Tier 2 | Tier 3 |
|---|---------|----------------------|:------:|:------:|:------:|
| 1 | Static Data Seeding & Migration | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ |
| 2 | Model Schemas & Validation | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ |
| 3 | Admin Auth & Protection | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ |
| 4 | Admin REST CRUD APIs | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ |
| 5 | Admin CMS Interfaces (Forms & Tables)| ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ |
| 6 | Public Pages Dynamic SSR | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ |
| 7 | Real-time Admin-to-Public Sync | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ |
| 8 | Resilience & Fallback Handling | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ |

## Test Architecture
- Test Runner: Node.js / Jest or standalone runner script (`tests/e2e-runner.js`).
- Pass/Fail Semantics: Exit code 0 on all tests passing, detailed JSON/console assertion reporting on failure.
- Directory Layout: `tests/e2e/` (tier1-feature, tier2-boundary, tier3-integration, tier4-scenarios, tier5-adversarial).

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Full Seeding & Admin Bootstrap | Database seeding, Admin user login, Model verification | Medium |
| 2 | New Publication Lifecycle | Admin login -> Create Publication with BibTeX -> Verify in Admin Table -> Verify on Public `/publications` page | High |
| 3 | Lab Profile & Settings Update | Update PI bio, credentials, pillars -> Verify updates on Public `/about` and Header/Footer | High |
| 4 | Team Member & Alumni Management | Add PG researcher & Alumni -> Filter in Admin -> Verify on Public `/team` under correct tabs | High |
| 5 | Research Domain & FYP Sync | Add Research Domain & FYP Project -> Verify on Public `/research` and `/supervision` | High |
| 6 | Fallback Resilience Under Database Fault | Disconnect DB / simulate error -> Verify all public pages render static fallback without crash | High |

## Coverage Thresholds
- Tier 1: ≥5 per feature (Total ≥ 40 tests)
- Tier 2: ≥5 per feature boundary (Total ≥ 40 tests)
- Tier 3: Pairwise combinations of major workflows (Total ≥ 15 tests)
- Tier 4: ≥6 realistic end-to-end user scenarios
- **Total Minimum Test Count: ~100+ assertions / test cases**
