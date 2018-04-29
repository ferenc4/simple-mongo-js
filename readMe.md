# Specifications
The specifications of the project can be found under specifications.pdf

# Dependencies
NodeJS
MongoDB

to install the node dependencies run
```
npm install
```

The database needs to have two collections (cache, messages) in the current db which can be created by
```
db.createCollection('<insert collection name here>')
```

# Running the project
To start the database server, run

```
mongod
```

Note: you may need to run it from the specific folder if you have many mongo db versions installed

To run the server app
```
node app
```

# API Usage
The project was tested using postman, and the sample values for each endpoint are indicated (as exported from postman) in
```
endpoints.json
```
