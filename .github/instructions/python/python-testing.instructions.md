---
applyTo: '**/*.py'
---

# Python Testing & Edge Cases

## Coverage Expectations
- Add unit coverage for core paths and document which behavior is under test so intent stays obvious.
- Exercise empty inputs, invalid types, and large datasets in both implementation and tests to prevent silent regressions.

## Test Hygiene
- Keep tests deterministic by isolating external dependencies behind fakes, fixtures, or dependency injection.
- Clean up resources (temporary files, environment tweaks, network handles) after each test so suites remain reliable in CI.

## Example Structure
- Prefer descriptive test names such as `test_calculate_area_rejects_negative_radius` to communicate expectations.
- Place example usage in tests rather than production code comments so documentation and verification stay in sync.
