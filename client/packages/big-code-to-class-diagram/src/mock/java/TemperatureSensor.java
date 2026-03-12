package mock.java;

public class TemperatureSensor extends Device implements IControllable, ISensor {
    private double temperature;

    public TemperatureSensor(String id, String name) {
        super(id, name);
        this.temperature = 20.0;
    }

    @Override
    public void turnOn() {
        isOn = true;
    }

    @Override
    public void turnOff() {
        isOn = false;
    }

    @Override
    public boolean isOn() {
        return isOn;
    }

    @Override
    public double getValue() {
        return temperature;
    }

    @Override
    public String getUnit() {
        return "°C";
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }
}
