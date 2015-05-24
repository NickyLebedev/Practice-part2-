package chat.controller;

import chat.model.EventStorage;
import org.apache.log4j.Logger;
import chat.model.Message;
import chat.model.MessageStorage;
import chat.storage.XMLHistoryUtil;
import chat.util.ServletUtil;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;
import org.xml.sax.SAXException;
import chat.dao.MessageDao;
import chat.dao.MessageDaoImpl;


import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;
import java.io.IOException;
import java.io.PrintWriter;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import static chat.util.MessageUtil.*;

@WebServlet("/chat")
public class MessageServlet extends HttpServlet {
	private final Lock lock = new ReentrantLock(true);
	private static final long serialVersionUID = 1L;
	private static Logger logger = Logger.getLogger(MessageServlet.class.getName());
	private MessageDao messageDao;

	@Override
	public void init() throws ServletException {
		try {
			messageDao = new MessageDaoImpl();
			loadHistory();

		} catch (SAXException e) {
			logger.error(e);
		}
		catch (IOException e) {
			logger.error(e);
		}
		catch (ParserConfigurationException e) {
			logger.error(e);
		}
		catch (TransformerException e) {
			logger.error(e);
		}
	}

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		logger.info("doGet");
		String token = request.getParameter(TOKEN);
		logger.info("Token " + token);

		if (token != null && !"".equals(token)) {
			int index = getIndex(token);
			int eventIndex = getEventIndex(token);
			logger.info("Index " + index);
			if(index < MessageStorage.getSize() || eventIndex < EventStorage.getSize()) {
				String messages = formResponse(index, eventIndex);
				logger.info("response messages: " + messages);
				response.setCharacterEncoding(ServletUtil.UTF_8);
				response.setContentType(ServletUtil.APPLICATION_JSON);
				logger.info("response status: " + 200);
				PrintWriter out = response.getWriter();
				out.print(messages);
				out.flush();
			}
			else {
				logger.info("response status: " + 304);
				response.sendError(HttpServletResponse.SC_NOT_MODIFIED, "no new messages");
			}
		} else {
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "'token' parameter needed");
		}
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		logger.info("doPost");
		String data = ServletUtil.getMessageBody(request);
		logger.info(data);
		try {
			JSONObject json = stringToJson(data);
			Message message = jsonToMessage(json);
			MessageStorage.addMessage(message);

			lock.lock();
			XMLHistoryUtil.addData(message);
			messageDao.add(message);
			lock.unlock();

			logger.info("response status: " + 200);
			response.setStatus(HttpServletResponse.SC_OK);
		} catch (ParseException e) {
			logger.error(e);
			response.sendError(HttpServletResponse.SC_BAD_REQUEST);
		}
		catch (ParserConfigurationException e) {
			logger.error(e);
			response.sendError(HttpServletResponse.SC_BAD_REQUEST);
		}
		catch (SAXException e) {
			logger.error(e);
			response.sendError(HttpServletResponse.SC_BAD_REQUEST);
		}
		catch (TransformerException e) {
			logger.error(e);
			response.sendError(HttpServletResponse.SC_BAD_REQUEST);
		}
	}

	@Override
	protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		logger.info("doPut");
		String data = ServletUtil.getMessageBody(request);
		logger.info(data);
		try {
			JSONObject json = stringToJson(data);
			Message message = jsonToMessage(json);

			EventStorage.addEvent(message);

			lock.lock();
			XMLHistoryUtil.addEventData(message);
			messageDao.addEvent(message);
			lock.unlock();

			logger.info("response status: " + 200);
			response.setStatus(HttpServletResponse.SC_OK);
		} catch (ParseException e) {
			logger.error(e);
			response.sendError(HttpServletResponse.SC_BAD_REQUEST);
		}
		catch (ParserConfigurationException e) {
			logger.error(e);
			response.sendError(HttpServletResponse.SC_BAD_REQUEST);
		}
		catch (SAXException e) {
			logger.error(e);
			response.sendError(HttpServletResponse.SC_BAD_REQUEST);
		}
		catch (TransformerException e) {
			logger.error(e);
			response.sendError(HttpServletResponse.SC_BAD_REQUEST);
		}
	}

	@Override
	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		logger.info("doDelete");
		String data = ServletUtil.getMessageBody(request);
		logger.info(data);
		try {
			JSONObject json = stringToJson(data);
			Message message = jsonToMessage(json);

			message.setAuthor("System message: ");
			message.setText("Message was deleted");

			EventStorage.addEvent(message);

			lock.lock();
			XMLHistoryUtil.addEventData(message);
			messageDao.addEvent(message);
			lock.unlock();

			logger.info("response status: " + 200);
			response.setStatus(HttpServletResponse.SC_OK);
		} catch (ParseException e) {
			logger.error(e);
			response.sendError(HttpServletResponse.SC_BAD_REQUEST);
		}
		catch (ParserConfigurationException e) {
			logger.error(e);
			response.sendError(HttpServletResponse.SC_BAD_REQUEST);
		}
		catch (SAXException e) {
			logger.error(e);
			response.sendError(HttpServletResponse.SC_BAD_REQUEST);
		}
		catch (TransformerException e) {
			logger.error(e);
			response.sendError(HttpServletResponse.SC_BAD_REQUEST);
		}
	}

	@SuppressWarnings("unchecked")
	private String formResponse(int index, int eventIndex) {
		JSONObject jsonObject = new JSONObject();
		jsonObject.put(MESSAGES, MessageStorage.getSubMessageByIndex(index));
		jsonObject.put(EVENTS, EventStorage.getSubEventByIndex(eventIndex));
		jsonObject.put(TOKEN, getToken(MessageStorage.getSize(), EventStorage.getSize()));
		return jsonObject.toJSONString();
	}

	private void loadHistory() throws SAXException, IOException, ParserConfigurationException, TransformerException  {
		if (!(XMLHistoryUtil.doesStorageExist())) {
			//MessageStorage.addAll(XMLHistoryUtil.getMessages());
			XMLHistoryUtil.createStorage();
			XMLHistoryUtil.createEventStorage();
		}

		MessageStorage.addAll(messageDao.selectAll());
		EventStorage.addAll(messageDao.selectAllEvents());
	}
	
	private void addStubData() throws ParserConfigurationException, TransformerException {
		Message [] stubTasks = {
				new Message ("1", "User 1:", "Hi!"),
				new Message("2", "User 2:", "What's up?"),
				 };
		MessageStorage.addAll(stubTasks);
		for (Message message : stubTasks) {
			try {
				XMLHistoryUtil.addData(message);
			} catch (ParserConfigurationException e) {
				logger.error(e);
			}
			catch (SAXException e) {
				logger.error(e);
			}
			catch (IOException e) {
				logger.error(e);
			}
			catch (TransformerException e) {
				logger.error(e);
			}
		}
	}

}
