### Data Collector

The data collector is deployed on AWS and functioning in production. It is collecting data every night and persisting the data in the data store.

The architecture of the Data Collector is as follows:

- Data Store:
  - DynamoDB (no SQL/schema-less database)
- Runtime:
  - AWS Lambda (serverless)
  - Typescript/Node
- Trigger:
  - AWS Event Bridge scheduled event (10pm MT every evening)

### Datastore

The datastore for the data collector is created in `lib/congressional-app-backend-stack.ts` (code excerpted below). There is no schema other than a requirement to set up a partition and sort key:

```
    const rawVotesTable = new dynamo.Table(
      this,
      "congressDataCollectorRawVotes",
      {
        partitionKey: { name: "part", type: dynamo.AttributeType.STRING },
        sortKey: { name: "sort", type: dynamo.AttributeType.STRING },
        tableName: "congressDataCollectorRaw",
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        // change below to billingMode: dynamo.BillingMode.PAY_PER_REQUEST
        readCapacity: 25,
        writeCapacity: 25,
      }
    );
```

This table is used to persist two types of data:

1. a marker of the last vote processed so I know where to "end" on the following day
2. raw vote data for processing by the data analyzer (not built yet)

Again, there is no schema for a dynamoDB table, so the best that I can show is the shape of the data I am inserting. See `backend/src/data-collector/adapters/dynamo-raw-data-repository.ts`

The shape of the data for #1 above is:

```
  part: string,
  sort: string,
  rollCall: number,
  date: string
  batchId: string
```

THe shape of the data for #2 above is:

```
  part: string,
  sort: string,
  raw: string
```

### API for Data collection

The API for data collection is ProPublica's Congressional API. This requires an API key that I am not exposing (it is saved in AWS Secrets Manager).

The data fetcher is: `backend/src/data-collector/adapters/propublica-vote-fetcher.ts`

And the service that orchestrates the fetching and saving of the data is: `backend/src/data-collector/services/data-collection-service.ts`
