import { Company, Provider, User } from './types';
import {
  DefaultBodyType,
  ResponseComposition,
  RestContext,
  RestRequest,
  rest,
  setupWorker,
} from 'msw';

const handleRequest = <T extends DefaultBodyType>(
  successResponse: T,
  {
    req,
    res,
    ctx,
  }: {
    req: RestRequest<never, {}>;
    res: ResponseComposition<T>;
    ctx: RestContext;
  },
) => {
  const delaySeconds = +(req.url.searchParams.get('delaySeconds') ?? '0');
  const responseCode = +(req.url.searchParams.get('responseCode') ?? '200');

  ctx.delay(delaySeconds * 1000);

  if (responseCode === 200) {
    return res(ctx.status(responseCode), ctx.json(successResponse));
  }

  return res(ctx.status(responseCode));
};

const getEndpointFor = <T extends DefaultBodyType>(path: string, successResponse: T) =>
  rest.get<{}, {}, T>(path, (req, res, ctx) => {
    return handleRequest(successResponse, { req, res, ctx });
  });

/**
 * Supported test purpose query params for all endpoints
 * - delaySeconds: number
 * - responseCode: 200 | 400 | 500
 */
export const worker = setupWorker(
  getEndpointFor<User>('/api/users/1', {
    id: 101,
    username: 'michalczukm',
  }),
  getEndpointFor<User>('/api/users/2', {
    id: 102,
    username: 'kowalskaa',
  }),
  getEndpointFor<User>('/api/users/3', {
    id: 103,
    username: 'nowakk',
  }),
  getEndpointFor<Company>('/api/company', {
    id: 111,
    name: 'Big Corp.',
  }),
  getEndpointFor<Provider>('/api/provider', {
    id: 121,
    globalName: 'Provider Alphabet',
  }),
);
