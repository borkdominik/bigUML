package mock.java;

public class RemoteControl {
    private Device device;

    public RemoteControl(Device device) {
        this.device = device;
    }

    public Device getDevice() {
        return device;
    }
}