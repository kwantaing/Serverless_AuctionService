import AWS from "aws-sdk";
import commonMiddleWare from "../lib/commonMiddleWare";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getAuctionById(id) {
	let auction;
	try {
		const result = await dynamodb
			.get({
				TableName: process.env.AUCTIONS_TABLE_NAME,
				Key: { id }, // same as Key: {id:id}
			})
			.promise();
		auction = result.Item;
	} catch (error) {
		console.error(error);
		throw new createError.InternalServerError(error);
	}
	if (!auction) {
		throw new createError.NotFound(`Auction with ID "${id}" not found.`);
	}
	return auction;
}

async function getAuction(event, context) {
	let auction;
	const { id } = event.pathParameters;
	try {
		const result = await dynamodb
			.get({
				TableName: process.env.AUCTIONS_TABLE_NAME,
				Key: { id }, // same as Key: {id:id}
			})
			.promise();
		auction = result.Item;
	} catch (error) {
		console.error(error);
		throw new createError.InternalServerError(error);
	}
	if (!auction) {
		throw new createError.NotFound(`Auction with ID "${id}" not found.`);
	}
	return {
		statusCode: 200, // 200 means OK or SUCCESS. 201 means resource is created.
		body: JSON.stringify(auction), // need to return stringified object
	};
}

export const handler = commonMiddleWare(getAuction);
