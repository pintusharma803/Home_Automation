import { createContext, useContext, useState, useEffect } from 'react';
import { socket } from '../socket/socket';
const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {

    const [devices, setDevices] = useState([]);
    // const [selectedDevice, setSelectedDevice] = useState(null);

    useEffect(() => {
        const handleStatus = (data) => {
            setDevices(prev =>
                prev.map(device => {
                    if (device.deviceId !== data.deviceId) {
                        return device;
                    }
                    console.log("Socket data device", device);
                    return { ...device, status: data.status, lastSeenAt: data.lastSeenAt };
                })
            )
        }
        socket.on("deviceStatusChanged", handleStatus);
        return () => {
            socket.off("deviceStatusChanged", handleStatus);
        }
    }, []);

    const value = {
        devices,
        setDevices,
        // selectedDevice,
        // setSelectedDevice
    }
    return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
}

export const useDevice = () => {
    return useContext(DeviceContext);
};