import kafka from "./kafka-config.js";

// Function to list topics
async function listTopics() {
	const admin = kafka.admin();

	try {
		// Connect to the Kafka cluster
		await admin.connect();

		// Retrieve the list of topics
		const topicMetadata = await admin.listTopics();

		console.log("Topics:");
		topicMetadata.forEach((topic) => {
			console.log(topic);
		});
	} catch (error) {
		console.error("Error listing topics:", error);
	} finally {
		// Disconnect from the Kafka cluster
		await admin.disconnect();
	}
}

// Call the listTopics function
listTopics();
