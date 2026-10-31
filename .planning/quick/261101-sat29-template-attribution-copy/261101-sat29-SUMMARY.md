# SAT-29: Template attribution explanation summary

## Delivered

- Admin Templates now states that new transactions use the template snapshot selected at checkout.
- Historical payments without a snapshot are described as falling back to the invitation's current template.
- The page states that funnel, cohort, and device attribution are not available in these metrics.
- Legacy template price remains labeled as metadata that does not determine checkout billing.

## Validation

- `CI=1 npm run build`: passed; existing large-chunk warning remains.
- `git diff --check`: passed.
- Tests were not run.

## Deployment

- Not pushed yet. Change is intended for `development` only.
- Production was not touched.
