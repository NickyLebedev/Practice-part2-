package chat.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public final class EventStorage {
	private static final List<Message> INSTANSE = Collections.synchronizedList(new ArrayList<Message>());

	private EventStorage() {}

	public static List<Message> getStorage() {
		return INSTANSE;
	}

	public static void addEvent(Message message) {
		INSTANSE.add(message);
	}

	public static void addAll(Message[] messages) {
		INSTANSE.addAll(Arrays.asList(messages));
	}

	public static void addAll(List<Message> messages) {
		INSTANSE.addAll(messages);
	}

	public static int getSize() {
		return INSTANSE.size();
	}

	public static List<Message> getSubEventByIndex(int index) {
		return INSTANSE.subList(index, INSTANSE.size());
	}

}