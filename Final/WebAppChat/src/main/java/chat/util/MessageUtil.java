package chat.util;

import chat.model.Message;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public final class MessageUtil {
	public static final String TOKEN = "token";
	public static final String MESSAGES = "messages";
	public static final String EVENTS = "events";
	private static final String TN = "TN";
	private static final String K = "K";
	private static final String EN = "EN";
	private static final String ID = "id";
	private static final String AUTHOR = "author";
	private static final String TEXT = "text";

	private MessageUtil() {
	}

	public static String getToken(int index, int eventIndex) {
		Integer number = index * 8 + 11;
		Integer eventNum = eventIndex * 8 + 11;
		return TN + number + K + eventNum + EN;
	}

	public static int getIndex(String token) {
		return (Integer.valueOf(token.substring(2, token.indexOf("K"))) - 11) / 8;
	}

	public static int getEventIndex(String token) {
		return (Integer.valueOf(token.substring(token.indexOf("K") + 1, token.length() - 2)) - 11) / 8;
	}

	public static JSONObject stringToJson(String data) throws ParseException {
		JSONParser parser = new JSONParser();
		return (JSONObject) parser.parse(data.trim());
	}

	public static Message jsonToMessage(JSONObject json) {

		Object id = json.get(ID);
		Object author = json.get(AUTHOR);
		Object text = json.get(TEXT);

		if (id != null && author != null && text != null) {
			return new Message((String)id, (String) author, (String) text);
		}
		return null;
	}
}
