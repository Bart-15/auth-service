import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Handler } from 'aws-lambda';

export type ProxyHandler = Handler<APIGatewayProxyEventV2, APIGatewayProxyResultV2>;
