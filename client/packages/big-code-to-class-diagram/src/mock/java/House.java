package mock.java;

public class House {
    private final Room room;

    public House(String roomName) {
        this.room = new Room(roomName);
    }

    public Room getRoom() {
        return room;
    }
}