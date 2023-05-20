import kafka from "./kafka-config.js";

const admin = kafka.admin();

async function createTopic(topicName, numPartitions) {
	try {
		await admin.connect();
		await admin
			.createTopics({
				topics: [
					{
						topic: topicName,
						numPartitions,
					},
				],
			})
			.then(() =>
				console.log(`Topic ${topicName} created successfully.`)
			);
	} catch (error) {
		console.error(`Failed to create topic ${topicName}:`, error);
	} finally {
		await admin.disconnect();
	}
}

// Usage example
const topicName = "Notifications";
const numPartitions = 3;

createTopic(topicName, numPartitions);
