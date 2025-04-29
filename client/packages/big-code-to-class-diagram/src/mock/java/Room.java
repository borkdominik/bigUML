package mock.java;

import java.util.ArrayList;
import java.util.List;

public class Room {
    private String name;
    private List<Light> lights;
    private List<TemperatureSensor> sensors;

    public Room(String name) {
        this.name = name;
        this.lights = new ArrayList<>();
        this.sensors = new ArrayList<>();
    }

    public void addLight(Light light) {
        lights.add(light);
    }

    public void addSensors(List<TemperatureSensor> sensors) {
        sensors.addAll(sensors);
    }

    public String getName() {
        return name;
    }

    public List<Light> getLights() {
        return lights;
    }

    public List<TemperatureSensor> getSensors() {
        return sensors;
    }
}
