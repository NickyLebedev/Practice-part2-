<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page isErrorPage="true" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>Error!</title>
<body>
<style type= "text/css"><%@include file="/css/main.css"%></style>
<% switch (response.getStatus()) {
    case 404: %>
        <div class = "error"> Error 404: Not found :(</div>
        <div class = "errorMessage"> Sorry </div>
        <div id = "content404">
            <embed class = "crying" src="/Images/404.png" align = "center"></embed>
        </div>
    <%  break;
    case 400: %>
        <div class = "error"> Error 400: Bad request</div>
        <div class = "errorMessage"> Before <a href="/index.html">trying again listen a good music</a>, </div>
        <div id = "content400">
            <embed src="/Images/hippie.png" width = "130%" align = "center"></embed>
        </div>
        <script>setTimeout(function() {window.open("http://radio.qip.ru/streams/hippie-nation","_blank")}, 4000);</script>
    <%  break;
    case 500: %>
        <div class = "error"> Error 500: Internal Server Error</div>
        <div class = "errorMessage"> Just relax. But don't forget to come back to our <a href="/index.html">chatty <3</a> :) </div>
        <div id = "content500">
            <embed src="/Images/relax.png" width = "140%" align = "center"></embed>
        </div>
        <script>setTimeout(function() {window.open("http://www.donothingfor2minutes.com/","_blank")}, 4000);</script>
    <%  break;
}%>
</body>
</html>