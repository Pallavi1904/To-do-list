const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || 'Todos';

exports.handler = async (event) => {
  const method = event.httpMethod;

  if (method === 'GET') {
    const result = await dynamo.scan({ TableName: TABLE_NAME }).promise();
    return { statusCode: 200, body: JSON.stringify(result.Items) };
  }

  if (method === 'POST') {
    const item = JSON.parse(event.body);
    await dynamo.put({ TableName: TABLE_NAME, Item: item }).promise();
    return { statusCode: 200, body: JSON.stringify({ message: 'Added' }) };
  }

  if (method === 'DELETE') {
    const { id } = JSON.parse(event.body);
    await dynamo.delete({ TableName: TABLE_NAME, Key: { id } }).promise();
    return { statusCode: 200, body: JSON.stringify({ message: 'Deleted' }) };
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};
