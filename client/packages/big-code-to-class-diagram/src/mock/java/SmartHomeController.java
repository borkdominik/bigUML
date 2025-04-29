package mock.java;

import java.util.ArrayList;
import java.util.List;

public class SmartHomeController {
    private String name;
    private List<Device> devices;
    private List<Room> rooms;

    public SmartHomeController(String name) {
        this.name = name;
        this.devices = new ArrayList<>();
        this.rooms = new ArrayList<>();
    }

    public void addDevice(Device device) {
        devices.add(device);
    }

    public void addRoom(Room room) {
        rooms.add(room);
    }

    public void turnOnAllLights() {
        for (Device device : devices) {
            if (device instanceof Light) {
                device.turnOn();
            }
        }
    }

    public String getName() {
        return name;
    }

    public List<Device> getDevices() {
        return devices;
    }

    public List<Room> getRooms() {
        return rooms;
    }
}
