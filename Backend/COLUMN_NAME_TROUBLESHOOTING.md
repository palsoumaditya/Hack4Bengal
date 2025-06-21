# Column Name Troubleshooting Guide

## Issue Summary

The job broadcasting system is failing due to column name mismatches between the Drizzle schema definition and the actual PostgreSQL database columns.

## Root Cause

PostgreSQL is case-sensitive for column names when they contain mixed case. The schema defines:

- `firstName: text("firstName")` - This creates a column named `firstName` (camelCase)
- `phoneNumber: varchar("phone_number")` - This creates a column named `phone_number` (snake_case)

## Error Messages

```
error: column w.firstname does not exist
hint: Perhaps you meant to reference the column "w.firstName".
```

## Solutions Applied

### 1. Use Double Quotes for Case-Sensitive Columns

For camelCase column names, use double quotes:

```sql
-- ❌ Wrong
SELECT w.firstName FROM workers w

-- ✅ Correct
SELECT w."firstName" FROM workers w
```

### 2. Updated Files

- `src/sockets/job.subscriber.ts` - Fixed worker search queries
- `src/controllers/job.controller.ts` - Fixed nearby workers endpoint
- `test-db-schema.js` - Updated test queries

### 3. Column Name Mapping

Based on the schema definition:

| Schema Field      | Database Column    | Query Usage          |
| ----------------- | ------------------ | -------------------- |
| `firstName`       | `firstName`        | `w."firstName"`      |
| `lastName`        | `lastName`         | `w."lastName"`       |
| `phoneNumber`     | `phone_number`     | `w.phone_number`     |
| `experienceYears` | `experience_years` | `w.experience_years` |
| `workerId`        | `worker_id`        | `s.worker_id`        |
| `subCategory`     | `sub_category`     | `s.sub_category`     |

## Testing

### 1. Database Connection Test

```bash
cd Backend
node test-simple.js
```

### 2. Schema Validation Test

```bash
cd Backend
node test-db-schema.js
```

### 3. Manual Query Test

Connect to PostgreSQL and run:

```sql
-- Check column names
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'workers'
ORDER BY column_name;

-- Test query with correct column names
SELECT id, "firstName", "lastName", phone_number
FROM workers
LIMIT 1;
```

## Prevention

1. Always use consistent naming conventions in schema definitions
2. Use explicit column names in Drizzle schema for clarity
3. Test queries with actual database before deployment
4. Use double quotes for case-sensitive column names

## Common Patterns

```sql
-- For camelCase columns
SELECT w."firstName", w."lastName" FROM workers w

-- For snake_case columns
SELECT w.phone_number, w.experience_years FROM workers w

-- Mixed usage
SELECT
  w.id,
  w."firstName",
  w."lastName",
  w.phone_number,
  w.experience_years
FROM workers w
```

## Next Steps

1. Ensure PostgreSQL is running
2. Run the test scripts to verify column names
3. Test the job broadcasting system
4. Monitor logs for any remaining column name issues
