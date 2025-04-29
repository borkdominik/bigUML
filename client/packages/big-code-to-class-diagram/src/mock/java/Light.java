package mock.java;

public class Light extends Device implements IControllable {
    private int brightness;

    public Light(String id, String name) {
        super(id, name);
        this.brightness = 0;
    }

    @Override
    public void turnOn() {
        isOn = true;
        brightness = 100;
    }

    @Override
    public void turnOff() {
        isOn = false;
        brightness = 0;
    }

    @Override
    public boolean isOn() {
        return isOn;
    }

    public void setBrightness(int brightness) {
        this.brightness = brightness;
    }
}
