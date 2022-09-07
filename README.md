## Introduction

This repository has three microservices - Books, Customers, Orders. They interact with a common MongoDB instance.

With the code present in this repository, I would like to show how OpenTelemetry can be used to instrument our code. This is one step towards `Observability Driven Development`. The tracing module present with each service helps to create traces for every incoming request and sending it to a OTEL compatible traces exporter, like Jaegar.

## Set up

For ease of demonstration, docker containers are used for spinning up a MongoDB instance and Jaegar instance.


#### Setting up Mongo DB
<br/>

```
$ docker run -d -p 27017:27017 mongo:4.0.4

$ docker exec -it <containerId> bash
    $ mongo
    > use testdb

```

After this, set the following variable:
```
export MONGO_URI=mongodb://localhost:27017/testdb
```

#### Setting up Jaegar
<br/>

```
$ docker run -d --name jaeger \
  -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 \
  -e COLLECTOR_OTLP_ENABLED=true \
  -p 6831:6831/udp \
  -p 6832:6832/udp \
  -p 5778:5778 \
  -p 16686:16686 \
  -p 4317:4317 \
  -p 4318:4318 \
  -p 14250:14250 \
  -p 14268:14268 \
  -p 14269:14269 \
  -p 9411:9411 \
  jaegertracing/all-in-one:1.37
```

Jaegar UI would be accessible at: `http://localhost:16686`

Set the following environment variable:

```
$ export env OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces
```

For an application with http-type traffic, port 4318 is used to export the traces. For grpc-type traffic, port 4317 is used in general.

Once you clone this repository, run the following to install the require node_modules:

```
npm i
```

Now, run all services one by one. Tracing should be initialised first.

For running the Books service, run this command from the root of the repository:

```
node -r ./books/tracing.js books/books.js
```

If the command is successful, you will get an output like this:
```
Up and Running on port 3000 - This is Book service
Tracing <http> initialized
Database Connection successfull!
```

Similary, run all the other services.

If there are any collisions with the port numbers, change them to a free port.

## Demo

Send requests to the book, customer and order service and check the incoming traces and system architecture DAG formed in the Jaegar UI.

For sending the GET and POST requests, Postman can be used for ease and convenience.