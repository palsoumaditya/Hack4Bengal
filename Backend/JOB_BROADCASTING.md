# Job Broadcasting System

This document explains how the job broadcasting system works to notify nearby workers about new job opportunities.

## Overview

The job broadcasting system uses Redis pub/sub for message queuing and Socket.IO for real-time communication to efficiently notify the closest available workers about new jobs.

## Architecture

```
User creates job → Job Controller → Redis Pub → Job Subscriber → Socket.IO → Workers
```

## Components

### 1. Job Controller (`src/controllers/job.controller.ts`)

**Function**: `createJob`

- Validates job data using Zod schema
- Creates job in database
- Publishes job to Redis channel "new-job"
- Returns job data to user

**Key Features**:

- Automatic job broadcasting through Redis pub/sub
- Error handling for broadcast failures
- User validation before job creation

### 2. Job Subscriber (`src/sockets/job.subscriber.ts`)

**Function**: `initJobSubscriber`

- Listens to Redis "new-job" channel
- Finds nearby workers using Haversine distance calculation
- Filters workers by specialization (if job category detected)
- Sorts workers by distance and experience
- Broadcasts job to top 10 closest workers via Socket.IO

**Worker Matching Logic**:

- **Distance Calculation**: Uses Haversine formula for accurate geographic distance
- **Progressive Radius**: Searches in 5km, 10km, 15km, 20km increments
- **Specialization Matching**: Filters by job category (plumber, electrician, etc.)
- **Smart Sorting**: Prioritizes distance, then experience years
- **Limit**: Maximum 10 workers notified to prevent spam

**Job Category Detection**:

```javascript
// Keyword-based category detection
if (description.includes('plumb') || description.includes('pipe')) → 'plumber'
if (description.includes('electr') || description.includes('wire')) → 'electrician'
if (description.includes('clean') || description.includes('housekeeping')) → 'cleaning'
// ... etc
```

### 3. Job Handler (`src/sockets/job.handler.ts`)

**Socket Events**:

- `accept_job`: Worker accepts a job
- `decline_job`: Worker declines a job
- `start_job`: Worker starts working on job
- `complete_job`: Worker completes the job

**Features**:

- Real-time status updates
- Validation of job ownership
- Notifications to both user and worker
- Automatic room management for job-specific updates

## API Endpoints

### Create Job

```http
POST /api/jobs
Content-Type: application/json

{
  "userId": "user-uuid",
  "description": "Need a plumber to fix leaking pipe",
  "location": "123 Main St, City",
  "lat": 12.9716,
  "lng": 77.5946,
  "bookedFor": "2024-01-15T10:00:00Z",
  "durationMinutes": 120
}
```

### Get Nearby Workers (Testing)

```http
GET /api/jobs/nearby-workers?lat=12.9716&lng=77.5946&radius=10&category=plumber
```

### Get Job Statistics

```http
GET /api/jobs/stats
```

## Socket Events

### Worker Events (Receive)

- `job_request`: New job available
- `job_unavailable`: Job taken by another worker
- `job_accepted_success`: Job acceptance confirmed
- `job_started_success`: Job start confirmed
- `job_completed_success`: Job completion confirmed
- `job_error`: Error occurred

### Worker Events (Send)

- `accept_job`: Accept a job
- `decline_job`: Decline a job
- `start_job`: Start working on job
- `complete_job`: Complete the job

### User Events (Receive)

- `job_status`: Job posting status
- `job_accepted`: Job accepted by worker
- `job_started`: Worker started the job
- `job_completed`: Job completed

## Database Schema

### Jobs Table

```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  worker_id UUID REFERENCES workers(id),
  description TEXT,
  location TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  status job_status DEFAULT 'pending',
  booked_for TIMESTAMP,
  duration_minutes INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Live Locations Table

```sql
CREATE TABLE live_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID REFERENCES workers(id) NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Distance Calculation

Uses Haversine formula for accurate geographic distance calculation:

```sql
6371 * acos(
  cos(radians(lat1)) *
  cos(radians(lat2)) *
  cos(radians(lng2) - radians(lng1)) +
  sin(radians(lat1)) * sin(radians(lat2))
) < radius_km
```

## Error Handling

- **Broadcast Failures**: Job creation continues even if broadcasting fails
- **Worker Validation**: Checks worker exists and is available
- **Job Status Validation**: Ensures proper status transitions
- **Socket Errors**: Graceful handling of connection issues

## Performance Optimizations

1. **Progressive Radius Search**: Start small, expand if needed
2. **Worker Limit**: Maximum 10 workers notified
3. **Specialization Filtering**: Reduce search space
4. **Indexed Queries**: Database indexes on location and specialization
5. **Connection Pooling**: Redis and database connection reuse

## Testing

### Test Job Creation

```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "your-user-id",
    "description": "Need electrician for wiring",
    "location": "Test Address",
    "lat": 12.9716,
    "lng": 77.5946,
    "bookedFor": "2024-01-15T10:00:00Z",
    "durationMinutes": 90
  }'
```

### Test Nearby Workers

```bash
curl "http://localhost:5000/api/jobs/nearby-workers?lat=12.9716&lng=77.5946&radius=10"
```

## Monitoring

- **Redis Connection**: Monitor pub/sub connectivity
- **Worker Count**: Track available workers in radius
- **Job Acceptance Rate**: Monitor job acceptance success
- **Response Times**: Track worker response times
- **Error Rates**: Monitor broadcast and socket errors

## Future Enhancements

1. **Machine Learning**: Better job-worker matching
2. **Worker Availability**: Real-time availability status
3. **Pricing Algorithm**: Dynamic pricing based on demand
4. **Push Notifications**: Mobile app notifications
5. **Analytics Dashboard**: Real-time system metrics
