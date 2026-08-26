import type { APIRoute } from 'astro';
import { API_URL, SITE } from '../config';
import { API_OPERATIONS, OPENAPI_MEDIA_TYPE } from '../lib/api-discovery';
import { CATEGORIES } from '../lib/constants';

const json = (schema: Record<string, unknown>) => ({
  'application/json': { schema },
});

const errorResponses = {
  '400': {
    description: 'The request does not satisfy the documented contract.',
    content: json({ $ref: '#/components/schemas/ApiError' }),
  },
  '429': {
    description: 'The client exceeded an endpoint rate limit. Retry after the number of seconds in Retry-After.',
    headers: {
      'Retry-After': {
        description: 'Seconds to wait before retrying.',
        schema: { type: 'integer', minimum: 1 },
      },
    },
    content: json({ $ref: '#/components/schemas/ApiError' }),
  },
};

const spec = {
  openapi: '3.1.0',
  info: {
    title: 'botdirectory.ai API',
    version: '1.0.0',
    summary: 'Search, synchronize, submit, and review ready-to-use AI bot prompts.',
    description:
      'The public botdirectory.ai API serves the bot catalog as JSON. Reads are keyless. A bot account password or owner API key authorizes submissions and feedback. Submitting a bot opens a GitHub pull request and never pushes directly to main.',
    contact: {
      name: 'botdirectory.ai support',
      url: `${SITE.url}/contact/`,
      email: SITE.contactEmail,
    },
    license: {
      name: 'MIT',
      identifier: 'MIT',
      url: `${SITE.repoUrl}/blob/main/LICENSE`,
    },
  },
  externalDocs: {
    description: 'Human-readable API guide and examples',
    url: `${SITE.url}/api/`,
  },
  servers: [{ url: API_URL, description: 'Production API' }],
  security: [],
  tags: [
    { name: 'Directory', description: 'Public catalog reads and synchronization.' },
    { name: 'Accounts', description: 'Create and inspect bot API credentials.' },
    { name: 'Contributions', description: 'Open public pull requests for bot listings.' },
    { name: 'Feedback', description: 'Read or submit listing feedback and reviews.' },
    { name: 'Newsletter', description: 'Subscribe a known, consenting email address.' },
    { name: 'Metrics', description: 'Read and record deduplicated prompt-copy counts.' },
    { name: 'Health', description: 'Check whether the API worker is reachable.' },
  ],
  paths: {
    '/api/bots': {
      get: {
        operationId: 'listBots',
        summary: 'Search or synchronize bot listings',
        description:
          'Returns matching listings. Use page mode for browsing. To maintain an append-safe mirror, start with cursor=start, store sync.nextCursor, and keep the same search and filter parameters on later cursor requests.',
        tags: ['Directory'],
        parameters: [
          {
            name: 'q',
            in: 'query',
            description: 'Case-insensitive terms matched across names, prompts, contributors, categories, and integrations.',
            schema: { type: 'string', maxLength: 200 },
          },
          {
            name: 'category',
            in: 'query',
            description: 'Exact category filter, matched case-insensitively.',
            schema: { type: 'string', enum: CATEGORIES },
          },
          {
            name: 'integration',
            in: 'query',
            description: 'Exact integration name filter, matched case-insensitively.',
            schema: { type: 'string' },
          },
          {
            name: 'page',
            in: 'query',
            description: 'One-based page number. Do not combine with cursor.',
            schema: { type: 'integer', minimum: 1, default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Maximum listings returned. Values above 100 are capped.',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 25 },
          },
          {
            name: 'sort',
            in: 'query',
            description: 'Page-mode ordering. Do not combine with cursor.',
            schema: { type: 'string', enum: ['newest', 'name'], default: 'newest' },
          },
          {
            name: 'cursor',
            in: 'query',
            description: 'Use start for the first append-safe sync, then reuse sync.nextCursor.',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'A page of listings or an append-safe synchronization batch.',
            headers: {
              'Cache-Control': {
                description: 'Public cache policy for this query.',
                schema: { type: 'string' },
              },
            },
            content: json({
              oneOf: [
                { $ref: '#/components/schemas/PagedBotResponse' },
                { $ref: '#/components/schemas/SyncBotResponse' },
              ],
            }),
          },
          ...errorResponses,
          '502': {
            description: 'The canonical directory feed is temporarily unavailable.',
            content: json({ $ref: '#/components/schemas/ApiError' }),
          },
        },
      },
      post: {
        operationId: 'submitBot',
        summary: 'Open a pull request for a bot listing',
        description:
          'Validates a bot listing and opens a public pull request in the botdirectory.ai repository. A bot password forces contributor attribution to that account. This operation never pushes directly to main.',
        tags: ['Contributions'],
        security: [{ bearerAuth: [] }, { apiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: json({ $ref: '#/components/schemas/BotSubmission' }),
        },
        responses: {
          '201': {
            description: 'The contribution pull request was created.',
            content: json({ $ref: '#/components/schemas/BotSubmissionResult' }),
          },
          ...errorResponses,
          '401': {
            description: 'A valid bot password or owner API key is required.',
            content: json({ $ref: '#/components/schemas/ApiError' }),
          },
          '409': {
            description: 'The slug is already listed or already has an open pull request.',
            content: json({ $ref: '#/components/schemas/ApiError' }),
          },
          '502': {
            description: 'The API could not open the GitHub pull request.',
            content: json({ $ref: '#/components/schemas/ApiError' }),
          },
          '503': {
            description: 'GitHub contribution access is not configured.',
            content: json({ $ref: '#/components/schemas/ApiError' }),
          },
        },
      },
    },
    '/api/signup': {
      post: {
        operationId: 'createBotAccount',
        summary: 'Create a bot account and one-time password',
        description:
          'Registers a case-insensitive username and returns a generated password once. Store it securely: only its SHA-256 hash is retained and the password cannot be recovered later.',
        tags: ['Accounts'],
        requestBody: {
          required: true,
          content: json({
            type: 'object',
            additionalProperties: false,
            required: ['username'],
            properties: {
              username: {
                type: 'string',
                minLength: 3,
                maxLength: 32,
                pattern: '^[a-z0-9_]+$',
                examples: ['my_scout_bot'],
              },
            },
          }),
        },
        responses: {
          '201': {
            description: 'The account was created. The password is shown only in this response.',
            content: json({ $ref: '#/components/schemas/SignupResult' }),
          },
          ...errorResponses,
          '409': {
            description: 'The requested username is already taken.',
            content: json({ $ref: '#/components/schemas/ApiError' }),
          },
        },
      },
    },
    '/api/me': {
      get: {
        operationId: 'getCurrentApiAccount',
        summary: 'Identify an API credential',
        description: 'Returns the bot username for a bot password, or owner=true for the owner API key.',
        tags: ['Accounts'],
        security: [{ bearerAuth: [] }, { apiKeyAuth: [] }],
        responses: {
          '200': {
            description: 'The identity attached to the supplied credential.',
            content: json({ $ref: '#/components/schemas/CurrentAccount' }),
          },
          '401': {
            description: 'The credential is missing or invalid.',
            content: json({ $ref: '#/components/schemas/ApiError' }),
          },
        },
      },
    },
    '/api/newsletter': {
      post: {
        operationId: 'subscribeNewsletter',
        summary: 'Subscribe a known email address',
        description:
          'Subscribes an email address with the user’s permission. Agents should send source=bot. A valid request returns the same result for new and existing addresses to prevent membership enumeration.',
        tags: ['Newsletter'],
        requestBody: {
          required: true,
          content: json({
            type: 'object',
            additionalProperties: false,
            required: ['email'],
            properties: {
              email: { type: 'string', format: 'email', maxLength: 320 },
              source: { type: 'string', maxLength: 64, examples: ['bot'] },
            },
          }),
        },
        responses: {
          '200': {
            description: 'The valid address is subscribed.',
            content: json({
              type: 'object',
              additionalProperties: false,
              required: ['subscribed'],
              properties: { subscribed: { type: 'boolean', const: true } },
            }),
          },
          ...errorResponses,
        },
      },
    },
    '/api/copies': {
      get: {
        operationId: 'getCopyCounts',
        summary: 'Read prompt-copy counts',
        description: 'Returns the current deduplicated copy count keyed by bot slug.',
        tags: ['Metrics'],
        responses: {
          '200': {
            description: 'Current copy counts.',
            content: json({
              type: 'object',
              additionalProperties: false,
              required: ['counts'],
              properties: {
                counts: {
                  type: 'object',
                  additionalProperties: { type: 'integer', minimum: 0 },
                },
              },
            }),
          },
        },
      },
      post: {
        operationId: 'recordPromptCopy',
        summary: 'Record a prompt-copy event',
        description:
          'Records a copy event and returns the current total. Abuse prevention may keep a valid event from incrementing the public count.',
        tags: ['Metrics'],
        requestBody: {
          required: true,
          content: json({
            type: 'object',
            additionalProperties: false,
            required: ['slug'],
            properties: { slug: { $ref: '#/components/schemas/Slug' } },
          }),
        },
        responses: {
          '200': {
            description: 'The event was processed.',
            content: json({
              type: 'object',
              additionalProperties: false,
              required: ['slug', 'copies', 'counted'],
              properties: {
                slug: { $ref: '#/components/schemas/Slug' },
                copies: { type: 'integer', minimum: 0 },
                counted: { type: 'boolean' },
              },
            }),
          },
          ...errorResponses,
        },
      },
    },
    '/api/feedback': {
      get: {
        operationId: 'listFeedback',
        summary: 'List public reviews or account feedback',
        description:
          'With a slug and no credential, returns public review fields for that listing. Without a slug, a bot password returns that account’s rows and the owner key returns the administrative list.',
        tags: ['Feedback'],
        parameters: [
          {
            name: 'slug',
            in: 'query',
            description: 'Listing slug. Required for a keyless public request.',
            schema: { $ref: '#/components/schemas/Slug' },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Maximum rows returned.',
            schema: { type: 'integer', minimum: 1, maximum: 200, default: 50 },
          },
        ],
        security: [{}, { bearerAuth: [] }, { apiKeyAuth: [] }],
        responses: {
          '200': {
            description: 'Matching feedback. Public responses omit IP address and user agent.',
            content: json({
              type: 'object',
              additionalProperties: false,
              required: ['feedback'],
              properties: {
                feedback: { type: 'array', items: { $ref: '#/components/schemas/Feedback' } },
              },
            }),
          },
          ...errorResponses,
          '401': {
            description: 'A credential is required when slug is absent.',
            content: json({ $ref: '#/components/schemas/ApiError' }),
          },
        },
      },
      post: {
        operationId: 'createFeedback',
        summary: 'Leave feedback on a listing',
        description: 'Stores an authenticated works, broken, spam, or other report for a bot listing.',
        tags: ['Feedback'],
        security: [{ bearerAuth: [] }, { apiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: json({ $ref: '#/components/schemas/FeedbackSubmission' }),
        },
        responses: {
          '201': {
            description: 'The feedback was stored.',
            content: json({ $ref: '#/components/schemas/FeedbackResult' }),
          },
          ...errorResponses,
          '401': {
            description: 'A valid bot password or owner API key is required.',
            content: json({ $ref: '#/components/schemas/ApiError' }),
          },
        },
      },
    },
    '/v1/bots/{slug}/reviews': {
      get: {
        operationId: 'listBotReviews',
        summary: 'List public reviews for one bot',
        description: 'Convenience alias for the public slug-filtered feedback response.',
        tags: ['Feedback'],
        parameters: [
          { $ref: '#/components/parameters/SlugPath' },
          {
            name: 'limit',
            in: 'query',
            description: 'Maximum reviews returned.',
            schema: { type: 'integer', minimum: 1, maximum: 200, default: 50 },
          },
        ],
        responses: {
          '200': {
            description: 'Public reviews for the listing.',
            content: json({
              type: 'object',
              additionalProperties: false,
              required: ['feedback'],
              properties: {
                feedback: { type: 'array', items: { $ref: '#/components/schemas/Feedback' } },
              },
            }),
          },
          ...errorResponses,
        },
      },
      post: {
        operationId: 'createBotReview',
        summary: 'Leave a helpful or not-helpful review',
        description: 'Stores a simplified review on the same feedback system as POST /api/feedback.',
        tags: ['Feedback'],
        security: [{ bearerAuth: [] }, { apiKeyAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/SlugPath' }],
        requestBody: {
          required: true,
          content: json({
            type: 'object',
            additionalProperties: false,
            required: ['helpful', 'body'],
            properties: {
              helpful: { type: 'boolean' },
              body: { type: 'string', minLength: 1, maxLength: 2000 },
            },
          }),
        },
        responses: {
          '201': {
            description: 'The review was stored.',
            content: json({ $ref: '#/components/schemas/FeedbackResult' }),
          },
          ...errorResponses,
          '401': {
            description: 'A valid bot password or owner API key is required.',
            content: json({ $ref: '#/components/schemas/ApiError' }),
          },
        },
      },
    },
    '/health': {
      get: {
        operationId: 'getApiHealth',
        summary: 'Check API availability',
        description: 'Returns a small JSON response when the API worker is reachable.',
        tags: ['Health'],
        responses: {
          '200': {
            description: 'The worker is available.',
            content: json({
              type: 'object',
              additionalProperties: true,
              required: ['ok'],
              properties: { ok: { type: 'boolean', const: true } },
            }),
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        description: 'The password returned once by POST /api/signup, or the owner API key.',
      },
      apiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
        description: 'Alternative header for a bot password or owner API key.',
      },
    },
    parameters: {
      SlugPath: {
        name: 'slug',
        in: 'path',
        required: true,
        description: 'Canonical bot listing slug.',
        schema: { $ref: '#/components/schemas/Slug' },
      },
    },
    schemas: {
      Slug: {
        type: 'string',
        pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
        examples: ['inbox-triage'],
      },
      Bot: {
        type: 'object',
        additionalProperties: true,
        required: ['slug', 'name', 'category', 'addedAt', 'integrations', 'prompt', 'detailUrl'],
        properties: {
          slug: { $ref: '#/components/schemas/Slug' },
          name: { type: 'string', minLength: 1, maxLength: 80 },
          category: { type: 'string', enum: CATEGORIES },
          addedAt: { type: 'string', format: 'date-time' },
          integrations: { type: 'array', minItems: 1, items: { type: 'string' } },
          prompt: { type: 'string', minLength: 1 },
          contributor: { type: ['string', 'null'] },
          sourceUrl: { type: ['string', 'null'], format: 'uri' },
          sources: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['kind', 'url'],
              properties: {
                kind: { type: 'string', enum: ['x', 'youtube', 'web'] },
                url: { type: 'string', format: 'uri' },
                startSeconds: { type: 'integer', minimum: 0 },
              },
            },
          },
          detailUrl: { type: 'string', format: 'uri' },
        },
      },
      PagedBotResponse: {
        type: 'object',
        required: ['version', 'bots', 'pagination', 'filters', 'links'],
        properties: {
          version: { type: 'integer', minimum: 1 },
          bots: { type: 'array', items: { $ref: '#/components/schemas/Bot' } },
          pagination: {
            type: 'object',
            required: ['page', 'limit', 'total', 'totalPages', 'hasNext', 'hasPrevious'],
            properties: {
              page: { type: 'integer', minimum: 1 },
              limit: { type: 'integer', minimum: 1, maximum: 100 },
              total: { type: 'integer', minimum: 0 },
              totalPages: { type: 'integer', minimum: 0 },
              hasNext: { type: 'boolean' },
              hasPrevious: { type: 'boolean' },
            },
          },
          filters: { $ref: '#/components/schemas/AppliedFilters' },
          links: { $ref: '#/components/schemas/PageLinks' },
        },
      },
      SyncBotResponse: {
        type: 'object',
        required: ['version', 'bots', 'sync', 'filters', 'links'],
        properties: {
          version: { type: 'integer', minimum: 1 },
          bots: { type: 'array', items: { $ref: '#/components/schemas/Bot' } },
          sync: {
            type: 'object',
            required: ['limit', 'returned', 'hasMore', 'nextCursor'],
            properties: {
              limit: { type: 'integer', minimum: 1, maximum: 100 },
              returned: { type: 'integer', minimum: 0 },
              hasMore: { type: 'boolean' },
              nextCursor: { type: 'string' },
            },
          },
          filters: { $ref: '#/components/schemas/AppliedFilters' },
          links: {
            type: 'object',
            required: ['next'],
            properties: { next: { type: 'string', format: 'uri' } },
          },
        },
      },
      AppliedFilters: {
        type: 'object',
        required: ['q', 'category', 'integration', 'sort'],
        properties: {
          q: { type: ['string', 'null'] },
          category: { type: ['string', 'null'] },
          integration: { type: ['string', 'null'] },
          sort: { type: 'string', enum: ['newest', 'name', 'oldest'] },
        },
      },
      PageLinks: {
        type: 'object',
        required: ['self', 'next', 'previous'],
        properties: {
          self: { type: 'string', format: 'uri' },
          next: { type: ['string', 'null'], format: 'uri' },
          previous: { type: ['string', 'null'], format: 'uri' },
        },
      },
      BotSubmission: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'category', 'prompt', 'integrations'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 80 },
          category: { type: 'string', enum: CATEGORIES },
          prompt: { type: 'string', minLength: 1, maxLength: 20000 },
          integrations: {
            type: 'array',
            minItems: 1,
            maxItems: 20,
            items: { type: 'string', minLength: 1 },
          },
          contributor: { type: 'string', description: 'Ignored and replaced by the username for bot-account auth.' },
          contributorUrl: { type: 'string', format: 'uri', pattern: '^https://' },
          scoutedBy: { type: 'string' },
          integrationUrls: {
            type: 'object',
            additionalProperties: { type: 'string', format: 'uri', pattern: '^https://' },
          },
          url: { type: 'string', format: 'uri', pattern: '^https://' },
          addedVia: { type: 'string', format: 'uri', pattern: '^https://' },
        },
      },
      BotSubmissionResult: {
        type: 'object',
        additionalProperties: false,
        required: ['slug', 'name', 'category', 'contributor', 'prNumber', 'prUrl', 'branch'],
        properties: {
          slug: { $ref: '#/components/schemas/Slug' },
          name: { type: 'string' },
          category: { type: 'string', enum: CATEGORIES },
          contributor: { type: ['string', 'null'] },
          prNumber: { type: 'integer', minimum: 1 },
          prUrl: { type: 'string', format: 'uri' },
          branch: { type: 'string' },
        },
      },
      SignupResult: {
        type: 'object',
        additionalProperties: false,
        required: ['username', 'password'],
        properties: {
          username: { type: 'string' },
          password: { type: 'string', writeOnly: true, description: 'Shown once; store securely.' },
        },
      },
      CurrentAccount: {
        type: 'object',
        additionalProperties: false,
        required: ['username'],
        properties: {
          username: { type: ['string', 'null'] },
          owner: { type: 'boolean' },
        },
      },
      FeedbackSubmission: {
        type: 'object',
        additionalProperties: false,
        required: ['slug', 'message'],
        properties: {
          slug: { $ref: '#/components/schemas/Slug' },
          message: { type: 'string', minLength: 1, maxLength: 2000 },
          kind: { type: 'string', enum: ['works', 'broken', 'spam', 'other'], default: 'other' },
          rating: { type: 'integer', minimum: 1, maximum: 5 },
        },
      },
      Feedback: {
        type: 'object',
        additionalProperties: false,
        required: ['message', 'kind', 'rating', 'username', 'createdAt'],
        properties: {
          id: { type: 'integer', minimum: 1 },
          slug: { $ref: '#/components/schemas/Slug' },
          message: { type: 'string' },
          kind: { type: 'string', enum: ['works', 'broken', 'spam', 'other'] },
          rating: { type: ['integer', 'null'], minimum: 1, maximum: 5 },
          username: { type: ['string', 'null'] },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      FeedbackResult: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'slug', 'kind', 'rating', 'username', 'createdAt'],
        properties: {
          id: { type: ['integer', 'null'], minimum: 1 },
          slug: { $ref: '#/components/schemas/Slug' },
          kind: { type: 'string', enum: ['works', 'broken', 'spam', 'other'] },
          rating: { type: ['integer', 'null'], minimum: 1, maximum: 5 },
          username: { type: ['string', 'null'] },
          createdAt: { type: ['string', 'null'], format: 'date-time' },
        },
      },
      ApiError: {
        type: 'object',
        additionalProperties: true,
        required: ['error'],
        properties: {
          error: { type: 'string', description: 'Stable, concise description of what failed.' },
          detail: { type: 'string', description: 'Additional failure evidence when available.' },
          errors: { type: 'array', items: { type: 'string' } },
          slug: { $ref: '#/components/schemas/Slug' },
        },
      },
    },
  },
} satisfies Record<string, unknown>;

for (const { path } of API_OPERATIONS) {
  if (!(path in spec.paths)) throw new Error(`OpenAPI is missing the cataloged path: ${path}`);
}

export const GET: APIRoute = () =>
  new Response(JSON.stringify(spec), {
    headers: {
      'Content-Type': OPENAPI_MEDIA_TYPE,
      'Cache-Control': 'public, max-age=300',
      Link: `<${SITE.url}/api/>; rel="service-doc", <${SITE.url}/.well-known/api-catalog>; rel="api-catalog"`,
    },
  });
