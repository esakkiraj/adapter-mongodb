# micro-analytics-adapter-mongodb

This is an [mongodb](https://www.mongodb.com/) adapter for [micro-analytics](https://github.com/micro-analytics).

## Usage

```
npm install micro-analytics-cli micro-analytics-adapter-mongodb
DB_ADAPTER=mongodb micro-analytics
```

## Configuration

### Connection

```
npm install micro-analytics-cli micro-analytics-adapter-mongodb
DB_ADAPTER=mongodb MAA_MONGODB_URL=mongodb://mongodb-instance2.test.site:27017/analyticsdb micro-analytics
```

Provide the mongodb [connection string](https://docs.mongodb.com/manual/reference/connection-string/#standard-connection-string-format) via MAA_MONGODB_URL environment variable while starting micro-analytics. Defaults to localhost with port 27017 when connection string is not provided.


## Testing

Run

```
MAA_MONGODB_URL=mongodb://localhost:27017/analyticsdb-test npm test
```
