# Election Provisioner & Voter Registry

## Running services

```bash
$ docker compose up -d
```

### Seed the database with sample data

```bash
$ ./bin/seed
```

### Example Request

```bash
$ curl -X POST http://provisioner-api:3009/setCurrentElection --data '{"electionId": "0c7a901a-e8fe-4601-8417-5d0823159d42"}'
$ curl -X POST http://provisioner-api:3009/lookupVoterEmail --data '{"VIDN":"B00000000001"}'
$ curl -X POST http://provisioner-api:3009/getElection
$ curl -X POST http://provisioner-api:3009/getCurrentElection
```

## Taking a peek at the data

```bash
$ aws dynamodb scan --table-name abc_voters_local --endpoint-url http://provisioner-db:8000
```
