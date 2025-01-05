# Request Caching Implementation

The request caching system has been improved with the following changes:

1. Created a new `utils.ts` file with centralized request handling and caching configuration
2. Implemented default cache duration of 5 minutes for GET requests
3. Added dynamic (no-cache) options for mutations and real-time data
4. Standardized error handling and response processing
5. Added TypeScript support with generic response types

## Cache Configuration

- Default cache duration: 5 minutes (300 seconds)
- Dynamic data (like game state): No caching
- POST/PUT/DELETE requests: No caching

## Usage

```typescript
// GET request with default caching (5 minutes)
const profile = await makeRequest<User>("/users/123/profile");

// POST request (automatically uses no-cache)
const game = await makeRequest<Game>("/games", {
  method: "POST",
  body: JSON.stringify(data),
});

// GET request with custom cache duration
const data = await makeRequest<Data>("/endpoint", { maxAge: 60 }); // 1 minute cache

// Force no caching for GET request
const realTimeData = await makeRequest<Data>("/endpoint", { maxAge: 0 });
```
