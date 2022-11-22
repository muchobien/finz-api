import { print } from 'graphql';
import { AttributeValue, diag, DiagConsoleLogger, DiagLogLevel, trace } from '@opentelemetry/api';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { AttributeNames, SpanNames } from '@pothos/tracing-opentelemetry';
import type { Plugin } from 'graphql-yoga';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { Resource } from '@opentelemetry/resources';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { env } from '@app/config/env.js';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';

export const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: env.APP_NAME,
    [SemanticResourceAttributes.SERVICE_VERSION]: env.VERSION,
  }),
});
provider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter()));
provider.register();

registerInstrumentations({
  // Automatically create spans for http requests
  instrumentations: [
    new PinoInstrumentation({
      logHook: (_, record, _level) => {
        record['resource.service.name'] = provider.resource.attributes['service.name'];
      },
    }),
    new HttpInstrumentation({}),
    new PrismaInstrumentation(),
  ],
});

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

export const tracer = trace.getTracer('graphql');

export const tracingPlugin: Plugin = {
  onExecute: ({ setExecuteFn, executeFn }) => {
    setExecuteFn(options =>
      tracer.startActiveSpan(
        SpanNames.EXECUTE,
        {
          attributes: {
            [AttributeNames.OPERATION_NAME]: options.operationName ?? undefined,
            [AttributeNames.SOURCE]: print(options.document),
          },
        },
        async span => {
          try {
            const result = await executeFn(options);

            return result;
          } catch (error: unknown) {
            span.recordException(error as Error);
            throw error;
          } finally {
            span.end();
          }
        },
      ),
    );
  },
};

export type TracingOptions = boolean | { attributes?: Record<string, AttributeValue> };
