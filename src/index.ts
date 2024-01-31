import type { AnalyticsInstance } from 'analytics';
import type { IntegrationFn } from '@sentry/types'
import { defineIntegration } from '@sentry/core';

const _integration = ((analytics: AnalyticsInstance) => {
  return {
    name: 'analytics',

    setupOnce: () => {},

    processEvent: (event) => {
      if (!analytics) {
        return event;
      }

      if (event.level !== 'error') {
        return event;
      }

      const exceptions = event.exception?.values || [];

      analytics.track('$exception', {
        message: exceptions[0]?.value,
        type: exceptions[0]?.type,
        sentry: {
          event_id: event.event_id,
          release: event.release,
          environment: event.environment,
          exception: event.exception,
          tags: event.tags,
        },
      });

      return event;
    },
  };
}) satisfies IntegrationFn;

export const integration = defineIntegration(_integration);
