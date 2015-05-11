package chat.model;

public class Message {
	private String id;
	private String author;
	private String text;


	public Message(String id, String author, String text) {
		this.id = id;
		this.author = author;
		this.text = text;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}


	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String toString() {
		return "{\"id\":\"" + this.id + "\",\"author\":\"" + this.author + "\",\"text\":\"" + this.text + "\"}";
	}
}
