import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import commonMiddleWare from "../lib/commonMiddleWare";
import validator from "@middy/validator";
import createAuctionSchema from "../lib/schemas/createAuctionSchema";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
	const { title } = event.body;
	const now = new Date();
	const endDate = new Date();
	endDate.setHours(now.getHours() + 1);
	const auction = {
		id: uuid(),
		title, //title: title
		status: "OPEN",
		createdAt: now.toISOString(),
		highestBid: {
			amount: 0,
		},
		endingAt: endDate.toISOString(),
	};

	try {
		await dynamodb
			.put({
				TableName: process.env.AUCTIONS_TABLE_NAME,
				Item: auction,
			})
			.promise();
	} catch (error) {
		console.error(error);
		throw new createError.InternalServerError(error);
	}
	return {
		statusCode: 201, // 200 means OK or SUCCESS. 201 means resource is created.
		body: JSON.stringify(auction), // need to return stringified object
	};
}

export const handler = commonMiddleWare(createAuction).use(
	validator({
		inputSchema: createAuctionSchema,
	})
);
