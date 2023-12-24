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

- confirm event bridge triggers event - may move it to once every 5 mins to test
- confirm lambda can read/write to ddb tables
- try to set up local stack for ddb access - and document y
