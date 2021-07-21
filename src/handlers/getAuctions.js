import AWS from "aws-sdk";
import commonMiddleWare from "../lib/commonMiddleWare";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
	let auctions;

	try {
		const result = await dynamodb
			.scan({
				TableName: process.env.AUCTIONS_TABLE_NAME,
			})
			.promise();
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

export const handler = commonMiddleWare(getAuctions);
