const { Kafka } = require("kafkajs");
const converter = require("../../middleware/timeConverter");
const temperatureLogger = require("../../models/temperatureLog");
const errorHandler = require("../../controllers/error/error");

const kafka = new Kafka({
  clientId: "kafka_start",
  brokers: ["192.168.0.16:9092"],
});

const consumer = kafka.consumer({
  groupId: "consumer_group_start",
});

async function createConsumerTemperature() {
  try {
    console.log("Temperature-sensor is connecting...");
    await consumer.connect();
    console.log("Connection is successfully...");
    await consumer.subscribe({
      topic: "Temperature-sensor",
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ message }) => {
        const { id, sensor_data, time_stamp } = JSON.parse(
          message.value.toString()
        );
        
        await temperatureLogger(1, 1, id, sensor_data, converter(time_stamp));
        
      },
    });
  } catch (error) {
    console.log(
      "[ERROR] An error occurred while read to message from Temperature-sensor..."
    );
    const errData = {
      pwd: "./app/adapters/queue/consumerTemp.js",
      topic: "Temperature-sensor",
      err_func: "createConsumerTemperature",
      content_err: error,
      created_at: converter(Date.now())
    };
    errorHandler(errData);
  }
}

module.exports = createConsumerTemperature;
