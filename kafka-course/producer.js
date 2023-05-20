import { Partitioners } from "kafkajs";
import kafka from "./kafka-config.js";

const producer = kafka.producer({
	createPartitioner: Partitioners.LegacyPartitioner,
});

async function produceMessage(topic) {
	try {
		await producer.connect();
		const number = Math.random();
		const partition = number < 0.33 ? 0 : number < 0.66 ? 1 : 2;

		const result = await producer.send({
			topic,
			messages: [{ value: "ID: " + number, partition }],
		});

		if (result && result.length > 0) {
			console.log("Message(s) sent successfully:");
			result.forEach((metadata) => {
				console.log(metadata);
			});
		} else {
			console.log("No errors, but no messages sent.");
		}
	} catch (error) {
		console.error("Error occurred while sending message:", error);
	} finally {
		await producer.disconnect();
	}
}

// Usage example
const topic = "Notifications";

produceMessage(topic);
