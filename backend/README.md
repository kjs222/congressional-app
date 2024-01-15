### Manual Backend Deploy

```
cd backend
npx cdk deploy
```

### DEPRECATED: running locally with localstack

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

NOTE: this no longer works because of the use of API Gateway V2 HTTP API - this is only supported with the paid
localstack pro version. Maintaining this documentation in case that changes.

in one terminal (note: docker-compose file was renamed deprecated-localstack-docker-compose)

```
cd backend
docker-compose up
```

in another terminal

```
cdklocal bootstrap
cdklocal deploy CongressionalAppBackendStack
```

^^ note to enhance - set to autoapprove

make sure it's all connected

```
awslocal dynamodb list-tables
```

should see output of tables from our cdk

to invoke lambda

```
sam local invoke -t cdk.out/CongressionalAppBackendStack.template.json
```

not sure how it knows what lambda to invoke if there are many

if i wanted to pass an event i could do sam local invoke -t cdk.out/CongressionalAppBackendStack.template.json -e <path to json even file>

```
npx cdk synth CongressionalAppBackendStack
sam local invoke -t cdk.out/CongressionalAppBackendStack.template.json
```
