/* eslint-disable @typescript-eslint/no-explicit-any */
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
  event: APIGatewayProxyEventV2 & { authorizationToken: string; methodArn: string }
) => {
  if (!event.authorizationToken) {
    throw 'Unauthorized';
  }

  const token = event.authorizationToken.replace('Bearer ', '');

  try {
    const claims = jwt.verify(token, config.AUTH0_PUBLIC_KEY);
    const policy = generatePolicy(claims.sub, event.methodArn);

    return {
      ...policy,
      context: claims,
    };
  } catch (error) {
    throw 'Unauthorized';
  }
};
