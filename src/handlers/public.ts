import { ProxyHandler } from '../types/handler.types';
export const handler: ProxyHandler = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    headers: {
      /* Required for CORS support to work */
      'Access-Control-Allow-Origin': '*',
      /* Required for cookies, authorization headers with HTTPS */
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      message: 'Hi ⊂◉‿◉つ from Public API',
    }),
  });
};
