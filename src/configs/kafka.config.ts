export const kafkaConfig = {
  brokers: [`${process.env.KAFKA_HOST}:9092`],
  sasl: {
    mechanism: 'scram-sha-256',
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  },
  ssl: true,
};
