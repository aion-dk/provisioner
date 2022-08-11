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
$ curl -XPOST http://provisioner:3009/setCurrentElection -H 'Content-Type: application/json' -d '{"electionId": "0c7a901a-e8fe-4601-8417-5d0823159d42"}'
```

## Taking a peek at the data

```bash
$ aws dynamodb scan --table-name abc_voters_local --endpoint-url http://provisioner-db:8000
```
