import kafka from "./kafka-config.js";

async function deleteTopic(topic) {
	try {
		const admin = kafka.admin();
		await admin.connect();

		//Not working. Use kafka-topics.sh --zookeeper localhost:2181 --delete --topic topicName instead
		await admin
			.deleteTopics({
				topics: [topic],
			})
			.then(() => console.log(`Topic "${topic}" deleted successfully`));

		await admin.disconnect();
	} catch (error) {
		console.error("Error occurred while deleting topic:", error);
	}
}

// Usage example
const topicToDelete = "Notifications";

deleteTopic(topicToDelete);
