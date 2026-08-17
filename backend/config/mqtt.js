const mqtt = require('mqtt');
const Device = require('../models/DeviceModel');
const { getIO } = require('../socket/socket');

const options = {
    host: process.env.MQTT_HOST,
    port: process.env.MQTT_PORT,
    protocol: 'mqtt'
    // username:'username'
    // password: 'your password'
}

const mqttClient = mqtt.connect(options);

mqttClient.on('connect', () => {
    console.log("Connected to MQTT broker");
    mqttClient.subscribe("pintu/#");
})

// const devices = await Device.find({}, "deviceId status");
const deviceStates = new Map();

mqttClient.on('message', async (topic, message) => {
    // console.log("Received message : ", message.toString()

    const status = message.toString().trim().toLowerCase();

    const parts = topic.split("/");
    const deviceId = parts[1];
    if (topic === `pintu/${deviceId}/status`) {
        try {
            // if (parts.length < 2) return;
            const current = deviceStates.get(deviceId);
            deviceStates.set(deviceId, {
                status,
                lastSeen: new Date()
            });

            if (!current || current.status !== status) {
                const updatedDevice = await Device.findOneAndUpdate(
                    {
                        deviceId: deviceId,
                        // topic: topic
                    },
                    {
                        $set: {
                            status: status,
                            lastSeenAt: new Date()
                        }
                    },
                    {
                        new: true,
                        // ursert:true,
                    }
                );
                if (updatedDevice) {
                    getIO().emit("deviceStatusChanged", updatedDevice);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
});


mqttClient.on('error', (error) => {
    console.log(error);
});


setInterval(async () => {

    const now = Date.now();
    for (const [deviceId, state] of deviceStates) {
        try {
            if (
                state.status === "active" &&
                now - state.lastSeen > 15000
            ) {
                state.status = "inactive";
                const updatedDevice = await Device.findOneAndUpdate(
                    { deviceId },
                    {
                        $set: {
                            status: "inactive",
                            lastSeenAt: new Date()
                        }
                    },
                    { new: true }
                );
                if (updatedDevice) {
                    getIO().emit("deviceStatusChanged", updatedDevice);
                }
            }
        } catch (error) {
            console.log(error)
        }
    }



}, 3000);

module.exports = { mqttClient, deviceStates };