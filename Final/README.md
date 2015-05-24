# WebAppChat

* **front-end**: HTML5, css3, js
* **back-end**: Java Servlet Technology

## Remaks(!!!important)


1. Create DB `webchat`
2. Create Table `tasks` via **messages.sql** and **events.sql** script located in `src\main\db` folder
3. In [ConnectionManager.java](src/main/java/chat/db/ConnectionManager.java) change **USERNAME** & **PASSWORD** depending on your setup
4. Run the project on Tomcat Server
5. Newly created tasks will be saved in DB. 
6. [log4j.properties] change **USERNAME** & **PASSWORD** depending on your setup

## How to give it a go?

1. Clone the repositry
        
2. Import the project to IDE
        
3. Add Tomcat Server to IDE
        
4. Run the project on Tomcat Server from IDE

5. Open `http://localhost:8080/chat/` in browser


## How run the project without IDE?
        
1. Buid the project via maven
        
        mvn clean package
        
2. `WebAppChat.war` will be created under `target` folder
        
3. Put `WebAppChat.war` to the Tomcat's `webapps` folder
        
4. Run Tomcat from console (`startup.bat` or `startup.sh` depending on OS)

5. Open `http://localhost:8080/chat/` in browser
