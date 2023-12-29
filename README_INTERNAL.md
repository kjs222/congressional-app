# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template

### Manual Frontend Deploy

```
cd frontend
npm run build
cd ..
npx cdk deploy CongressionalAppFrontendStack
```

front end accessible at: http://kjs222-congressional-application.s3-website-us-east-1.amazonaws.com/

### Manual Backend Deploy

```
npx cdk deploy CongressionalAppBackendStack
```

### Todo

- test datafetcher api (use zod create random)
- add typing to the DB in/out layer
- test db repository
- write service layer for data collector

### To run locally

#### dependencies

install awscli-local:

```
brew install awscli-local
```

```
npm install -g aws-cdk-local aws-cdk
```

install sam
https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html

### running locally

in one terminal

```
cd backend
docker-compose up
```

in another terminal, back at root

```
cdklocal deploy CongressionalAppBackendStack
```

The first time that runs, you will get an error
Deployment failed: Error: CongressionalAppBackendStack: SSM parameter /cdk-bootstrap/hnb659fds/version not found...

if you get that

```
cdklocal bootstrap
```

run this again

```
cdklocal deploy CongressionalAppBackendStack
```

to make sure it's all connected

```
awslocal dynamodb list-tables
```

should see output of tables from our cdk

to invoke lambdal

```
sam local invoke -t cdk.out/CongressionalAppBackendStack.template.json
```

not sure how it knows what lambda to invoke if there are many

if i wanted to pass an event i could do sam local invoke -t cdk.out/CongressionalAppBackendStack.template.json -e <path to json even file>

```
npx cdk synth CongressionalAppBackendStack
sam local invoke -t cdk.out/CongressionalAppBackendStack.template.json
```
