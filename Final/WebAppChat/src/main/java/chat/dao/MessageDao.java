package chat.dao;

import java.util.List;
import chat.model.Message;

public interface MessageDao {
    void add(Message message);

    void addEvent(Message message);

    void update(Message message);

    void delete(int id);

    Message selectById(Message message);

    List<Message> selectAll();

    List<Message> selectAllEvents();
}