package mock.java;

public abstract class Device {
    protected String id;
    protected String name;
    protected boolean isOn;

    public Device(String id, String name) {
        this.id = id;
        this.name = name;
        this.isOn = false;
    }

    public abstract void turnOn();

    public abstract void turnOff();
}