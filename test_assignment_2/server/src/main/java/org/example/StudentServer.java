package org.example;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.example.StudentServlet;

public class StudentServer {
    public static void main(String[] args) throws Exception {
        Server server = new Server(8080);

        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
        context.setContextPath("/");

        server.setHandler(context);

        ServletHolder servletHolder = new ServletHolder(StudentServlet.class);
        context.addServlet(servletHolder, "/students/*");

        server.start();
        server.join();
    }
}
