import kafka from "./kafka-config.js";

async function increasePartitions(topicName, numPartitions) {
	const admin = kafka.admin();
	await admin.connect();

	try {
		await admin.createPartitions({
			topicPartitions: [
				{
					topic: topicName,
					count: numPartitions,
				},
			],
		});
		console.log(
			`Number of partitions for topic "${topicName}" increased to ${numPartitions}`
		);
	} catch (error) {
		console.error(
			`Failed to increase partitions for topic "${topicName}":`,
			error
		);
	} finally {
		await admin.disconnect();
	}
}

// Usage example
const topicName = "Notifications";
const numPartitions = 3;

increasePartitions(topicName, numPartitions);
