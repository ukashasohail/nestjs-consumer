import { Logger } from '@nestjs/common';
import { Consumer, ConsumerOptions } from 'sqs-consumer';

export const createSqsConsumer = (
	region: string,
	queueUrl: string,
	handleMessage: (mgs: any) => Promise<void>,
	logger: Logger,
	attributeNames?: string[],
	messageAttributeNames?: string[],
): Consumer => {
	try {
		const consumerConfig: ConsumerOptions = {
			queueUrl,
			region,
			attributeNames,
			messageAttributeNames,
			handleMessage,
			visibilityTimeout: 600,
			heartbeatInterval: 590,
		};
		return Consumer.create(consumerConfig);
	} catch (err) {
		logger.error(
			`Error creating a consumer to SQS queue => ${queueUrl} :${err.message}`,
			err.stack,
			'sqs-consumer',
		);
		throw err; /* re-throw error */
	}
};
