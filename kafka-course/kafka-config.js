import dotenv from "dotenv";
import { Kafka } from "kafkajs";

dotenv.config();

const { KAFKA_CLIENT_ID, KAFKA_HOSTNAME, KAFKA_CONTAINER_IP_ADDRESS } =
	process.env;

const kafka = new Kafka({
	clientId: KAFKA_CLIENT_ID,
	brokers: [KAFKA_HOSTNAME + ":" + KAFKA_CONTAINER_IP_ADDRESS],
});

export default kafka;
