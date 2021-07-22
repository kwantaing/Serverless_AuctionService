import AWS from "aws-sdk";
import commonMiddleWare from "../lib/commonMiddleWare";
import validator from "@middy/validator";
import getAuctionsSchema from "../lib/schemas/getAuctionsSchema";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
	const { status } = event.queryStringParameters;
	let auctions;
	const params = {
		TableName: process.env.AUCTIONS_TABLE_NAME,
		IndexName: "statusAndEndDate",
		KeyConditionExpression: "#status = :status",
		ExpressionAttributeValues: {
			":status": status,
		},
		ExpressionAttributeNames: {
			"#status": "status",
		},
	};
	try {
		const result = await dynamodb.query(params).promise();
		auctions = result.Items;
	} catch (error) {
		console.error(error);
		throw new createError.InternalServerError(error);
	}
	return {
		statusCode: 200, // 200 means OK or SUCCESS. 201 means resource is created.
		body: JSON.stringify(auctions), // need to return stringified object
	};
}

export const handler = commonMiddleWare(getAuctions).use(
	validator({
		inputSchema: getAuctionsSchema,
		ajvOptions: {
			useDefaults: true,
			strict: false,
		},
	})
);
