import {
  DynamoDBClient,
  UpdateItemCommand,
  GetItemCommand,
} from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});
const TABLE = process.env.TABLE_NAME;

const headers = {
  "content-type": "application/json",
  "cache-control": "no-store",
};

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,127}$/i;

export const handler = async (event) => {
  const method = event.requestContext?.http?.method ?? "GET";
  const slug = event.queryStringParameters?.slug;

  if (!slug || !SLUG_RE.test(slug)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "invalid slug" }),
    };
  }

  try {
    if (method === "POST") {
      const r = await client.send(
        new UpdateItemCommand({
          TableName: TABLE,
          Key: { slug: { S: slug } },
          UpdateExpression: "ADD #v :one",
          ExpressionAttributeNames: { "#v": "views" },
          ExpressionAttributeValues: { ":one": { N: "1" } },
          ReturnValues: "UPDATED_NEW",
        })
      );
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ views: Number(r.Attributes.views.N) }),
      };
    }
    if (method === "GET") {
      const r = await client.send(
        new GetItemCommand({
          TableName: TABLE,
          Key: { slug: { S: slug } },
        })
      );
      const v = Number(r.Item?.views?.N ?? 0);
      return { statusCode: 200, headers, body: JSON.stringify({ views: v }) };
    }
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "method not allowed" }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "internal" }),
    };
  }
};
