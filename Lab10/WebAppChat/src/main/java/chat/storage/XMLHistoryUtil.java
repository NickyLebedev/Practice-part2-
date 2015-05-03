package chat.storage;

import chat.model.Message;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.*;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public final class XMLHistoryUtil {
	private static final String STORAGE_LOCATION = /*System.getProperty("user.home") +  File.separator + */"D:\\history.xml"; // history.xml will be located in the home directory
	private static final String MESSAGES = "messages";
	private static final String MESSAGE = "message";
	private static final String AUTHOR = "author";
	private static final String TEXT = "text";

	private XMLHistoryUtil() {
	}

	public static synchronized void createStorage() throws ParserConfigurationException, TransformerException {
		DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder docBuilder = docFactory.newDocumentBuilder();

		Document doc = docBuilder.newDocument();
		Element rootElement = doc.createElement(MESSAGES);
		doc.appendChild(rootElement);

		Transformer transformer = getTransformer();

		DOMSource source = new DOMSource(doc);
		StreamResult result = new StreamResult(new File(STORAGE_LOCATION));
		transformer.transform(source, result);
	}

	public static synchronized void addData(Message message) throws ParserConfigurationException, SAXException, IOException, TransformerException {
		DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder();
		Document document = documentBuilder.parse(STORAGE_LOCATION);
		document.getDocumentElement().normalize();
		
		Element root = document.getDocumentElement();

		Element messageElement = document.createElement(MESSAGE);
		root.appendChild(messageElement);

		messageElement.setAttribute(AUTHOR, message.getAuthor());

		Element text = document.createElement(TEXT);
		text.appendChild(document.createTextNode(message.getText()));
		messageElement.appendChild(text);

		DOMSource source = new DOMSource(document);

		Transformer transformer = getTransformer();

		StreamResult result = new StreamResult(STORAGE_LOCATION);
		transformer.transform(source, result);
	}

	public static synchronized boolean doesStorageExist() {
		File file = new File(STORAGE_LOCATION);
		return file.exists();
	}

	public static synchronized List<Message> getMessages() throws SAXException, IOException, ParserConfigurationException {
		List<Message> messages = new ArrayList<Message>();
		DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder();
		Document document = documentBuilder.parse(STORAGE_LOCATION);
		document.getDocumentElement().normalize();
		Element root = document.getDocumentElement(); // Root <tasks> element
		NodeList messageList = root.getElementsByTagName(MESSAGE);
		for (int i = 0; i < messageList.getLength(); i++) {
			Element messageElement = (Element) messageList.item(i);
			String author = messageElement.getAttribute(AUTHOR);
			String text = messageElement.getElementsByTagName(TEXT).item(0).getTextContent();
			messages.add(new Message(author, text));
		}
		return messages;
	}

	public static synchronized int getStorageSize() throws SAXException, IOException, ParserConfigurationException {
		DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder();
		Document document = documentBuilder.parse(STORAGE_LOCATION);
		document.getDocumentElement().normalize();
		Element root = document.getDocumentElement();
		return root.getElementsByTagName(MESSAGE).getLength();
	}

	private static Transformer getTransformer() throws TransformerConfigurationException {
		TransformerFactory transformerFactory = TransformerFactory.newInstance();
		Transformer transformer = transformerFactory.newTransformer();
		// Formatting XML properly
		transformer.setOutputProperty(OutputKeys.INDENT, "yes");
		return transformer;
	}

}
