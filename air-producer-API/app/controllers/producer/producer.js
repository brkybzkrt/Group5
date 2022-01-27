const { Kafka } = require("kafkajs");
const converter = require("../../middleware/timeConverter");
const errorHandler = require("../../controllers/error/error");

const kafka = new Kafka({
  clientId: "kafka_start",
  brokers: ["192.168.0.16:9092"],
});

const producer = kafka.producer();

let incomingMessage = "";
let is_producer_conn = false;


async function createProducerAir(data) {
  try {
    if (!is_producer_conn) {
      console.log("Producer is  connecting...");
      await producer.connect();
      console.log("Producer connect successful!");
      is_producer_conn = true;
    } else {
      const message_res = await producer.send({
        topic: "Air-sensor",
        messages: [
          {
            value: JSON.stringify(data),
            partition: 0,
          },
        ],
      });
    }
  } catch (error) {
    console.log("[ERROR] : ", error);
    const errData = {
      pwd: "./app/controllers/producer/producer.js",
      topic: "Air-sensor",
      req_path: "/air",
      err_func: "createProducerAir",
      content_err: error,
      created_at: converter(Date.now())
    };
    errorHandler(errData);
  }
}

createProducerAir();

const airDataGet = async (req, res) => {
  await createProducerAir("-> ").then(async () => {
    try {
      res.send(JSON.stringify(incomingMessage));
    } catch (error) {
      console.log("[ERROR] : ", error);
      const errData = {
        pwd: "./app/controllers/producer/producer.js",
        topic: "Air-sensor",
        req_path: "/air",
        err_func: "airDataGet",
        content_err: error,
        created_at: converter(Date.now())
      };
      errorHandler(errData);
    }
  });
  res.end();
};

const airDataPost = async (req, res) => {
  try {
    const obj = req.body;
    if (!obj) {
      console.log("400 -> Bad request");
    } else {
      console.log("Temp-Data -> ", obj);
      await createProducerAir(obj).then(async () => {
        res.send(JSON.stringify(incomingMessage));
      });
    }
    res.end();
  } catch (error) {
    console.log("[ERROR] : ", error);
    const errData = {
      pwd: "./app/controllers/producer/producer.js",
      topic: "Air-sensor",
      req_path: "/air",
      err_func: "airDataPost",
      content_err: error,
      created_at: converter(Date.now())
    };
    errorHandler(errData);
  }
};

module.exports = {
  airDataGet,
  airDataPost,
};