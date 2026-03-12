package mock.java;

import java.util.ArrayList;
import java.util.List;

public class Building {
    private final List<Room> rooms;

    public Building(List<String> roomNames) {
        this.rooms = new ArrayList<>();
        for (String name : roomNames) {
            this.rooms.add(new Room(name));
        }
    }

    public List<Room> getRooms() {
        return rooms;
    }
}