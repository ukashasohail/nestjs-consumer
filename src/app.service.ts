import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Consumer } from 'sqs-consumer';
import { createSqsConsumer } from './utils/sqs-consumer';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  private consumer: Consumer;

  constructor(private readonly logger: Logger) {
    /* initilize schedule service */
    this.init();
  }

  onModuleInit() {
    /* start consumer */
    this.start();
  }

  onModuleDestroy() {
    /* stop consumer */
    this.stop();
  }

  private start() {
    this.consumer.start();
  }

  private stop() {
    this.consumer.stop();
  }

  private init() {
    const region = 'us-west-1';
    const queueUrl = 'sqs-url';

    /* create sqs consumer */
    const consumer = createSqsConsumer(
      region,
      queueUrl,
      this.handleMessage.bind(this),
      this.logger,
    );

    /* bind event handlers */
    consumer.on('error', (err) => this.onError(err));
    consumer.on('processing_error', (err) => this.onProcessingError(err));
    consumer.on('timeout_error', (err) => this.onTimeoutError(err));
    consumer.on('stopped', () => this.onStopped());

    this.consumer = consumer;
  }

  private async handleMessage(message) {
    //handle message
  }

  private onError(err: Error) {
    this.logger.error(`Error: ${err.message}`, err.stack);
  }

  private onProcessingError(err: Error) {
    this.logger.error(`Processing Error: ${err.message}`, err.stack);
  }

  private onTimeoutError(err: Error) {
    this.logger.warn(`Timeout Error: ${err.message}`, err.stack);
  }

  private onStopped() {
    this.logger.warn('SQS Consumer Stopped');
  }
}
