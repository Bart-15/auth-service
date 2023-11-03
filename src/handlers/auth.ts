/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Callback, Context } from 'aws-lambda';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import jwt from 'jsonwebtoken';

import config from '../config/envConfig';

// By default, API Gateway authorizations are cached (TTL) for 300 seconds.
// This policy will authorize all requests to the same API Gateway instance where the
// request is coming from, thus being efficient and optimising costs.
const generatePolicy = (principalId: unknown, methodArn: string) => {
  const apiGatewayWildcard = methodArn.split('/', 2).join('/') + '/*';

  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: apiGatewayWildcard,
        },
      ],
    },
  };
};

export const handler = (
  event: APIGatewayProxyEventV2 & { authorizationToken: string; methodArn: string },
  context: Context,
  callback: Callback
) => {
  if (!event.authorizationToken) {
    return callback('Unauthorized');
  }

  const tokenParts = event.authorizationToken.split(' ');
  const tokenValue = tokenParts[1];
  const options = { audience: config.AUTH0_CLIENT_ID };
  try {
    jwt.verify(tokenValue, config.AUTH0_PUBLIC_KEY, options, (verifyError, decoded) => {
      if (verifyError) {
        console.log('verifyError', verifyError);
        // 401 Unauthorized
        console.log(`Token invalid. ${verifyError}`);
        return callback('Unauthorized');
      }
      // is custom authorizer function
      console.log('valid from customAuthorizer', decoded);
      return callback(null, generatePolicy(decoded?.sub, event.methodArn));
    });
  } catch (error) {
    console.log('catch error. Invalid token', error);
    return callback('Unauthorized');
  }
};
