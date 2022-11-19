# question-maker

## The purpose
The purpose of the question maker is to create questions for your courses as a teacher. We would like to make it an amazing productivity tool for you.
Create your questions and save/export them however you want.

# How to run
To run in developer mode:

1. Install dependencies 
```bash
npm install, use node v18
```

2. Start MongoDb via docker
```bash
docker-compose -f start-local-db.yml
```
#### or

2. Start MongoDb via command-line
```bash
sudo systemctl start mongodb
```

3. Run app
```bash
npm run dev
```

# Tests
Run tests:
```bash
npm run test
```
Run a specific test:
```bash
npm run test /path/
```
