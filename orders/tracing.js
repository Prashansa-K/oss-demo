const process = require('process'),
  opentelemetry = require('@opentelemetry/sdk-node'),
  { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node'),
  { Resource } = require('@opentelemetry/resources'),
  { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions'),
  { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto'),
  { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base'),
  { MongoDBInstrumentation } = require('@opentelemetry/instrumentation-mongodb'),


  // Step 1. Declare the resource to be used.
  //    A resource represents a collection of attributes describing the
  //    service. This collection of attributes will be associated with all
  //    telemetry generated from this service (traces, metrics, logs).
  resource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'order-service',
  }),

  // Step 2: Enable auto-instrumentation from the meta package.
  instrumentations = [getNodeAutoInstrumentations(), 
    new MongoDBInstrumentation({
        enhancedDatabaseReporting: true,
    })
  ],

  // Step 3: Create a trace exporter
  traceExporter = new OTLPTraceExporter({}),

  // Step 4: Configure the OpenTelemetry NodeSDK to export traces.
  sdk = new opentelemetry.NodeSDK({
    resource,
    traceExporter,
    instrumentations,
    spanProcessor: new BatchSpanProcessor(traceExporter)
  });

// Step 5: Initialize the SDK and register with the OpenTelemetry API:
//    this enables the API to record telemetry
sdk
  .start()
  .then(() => { return console.log('Tracing <http> initialized'); })
  .catch((error) => { return console.log('Error initializing tracing', error); });

// Step 6: Gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => { return console.log('Tracing terminated'); })
    .catch((error) => { return console.log('Error terminating tracing', error); })
    .finally(() => { return process.exit(0); });
});
