import kafka from "./kafka-config.js";

const consumer = kafka.consumer({ groupId: "my-consumer-group" });

async function consumeMessages(topic) {
	try {
		await consumer.connect();
		await consumer.subscribe({ topic });

		await consumer.run({
			eachMessage: async ({ topic, partition, message }) => {
				console.log(
					`Received message from topic "${topic}", partition ${partition}: ${message.value}`
				);
			},
		});
	} catch (error) {
		console.error("Error occurred while consuming messages:", error);
	}
}

// Usage example
const topic = "Notifications";

consumeMessages(topic);
