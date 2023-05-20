import kafka from "./kafka-config.js";

async function checkKafkaHealth() {
	try {
		const admin = kafka.admin();
		await admin.connect();
		await admin.disconnect();
		console.log("Kafka is healthy");
	} catch (error) {
		console.error("Kafka is not healthy:", error);
	}
}

checkKafkaHealth();
