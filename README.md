# Election Provisioner & Voter Registry

## Running services

```bash
$ docker compose up -d
```

### Seed the database with sample data

```bash
$ ./db-init.sh # seed data
```

### Set the current election

```bash
$ curl -XPOST http://0.0.0.0:3009/setCurrentElection -H 'Content-Type: application/json' -d '{"electionId": "0c7a901a-e8fe-4601-8417-5d0823159d42"}'
```

## Taking a peek at the data

```bash
$ aws dynamodb scan --table-name abc_voters_local --endpoint-url http://localhost:8000
```
