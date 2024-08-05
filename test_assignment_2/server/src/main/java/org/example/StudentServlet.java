package org.example;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDate;

public class StudentServlet extends HttpServlet {

    private static final String DB_URL = "jdbc:postgresql://localhost:5432/test";
    private static final String USER = "vladislavobedkov";
    private static final String PASS = "";

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setContentType("application/json");

        String firstName = req.getParameter("firstName");
        String lastName = req.getParameter("lastName");
        String middleName = req.getParameter("middleName");
        String birthDateStr = req.getParameter("birthDate");
        String groupName = req.getParameter("groupName");
        String uniqueNumber = req.getParameter("uniqueNumber");

        // Проверка года рождения
        Date birthDate = Date.valueOf(birthDateStr);
        LocalDate birthLocalDate = birthDate.toLocalDate();
        int birthYear = birthLocalDate.getYear();
        if (birthYear < 1920) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().println("{\"message\": \"Year of birth must be 1920 or later.\"}");
            return;
        }

        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASS)) {
            if (studentExists(conn, uniqueNumber)) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().println("{\"message\": \"Student with uniqueNumber " + uniqueNumber + " already exists.\"}");
                return;
            }

            String sql = "INSERT INTO students (first_name, last_name, middle_name, birth_date, group_name, unique_number) VALUES (?, ?, ?, ?, ?, ?)";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setString(1, firstName);
                stmt.setString(2, lastName);
                stmt.setString(3, middleName);
                stmt.setDate(4, Date.valueOf(birthDateStr));
                stmt.setString(5, groupName);
                stmt.setString(6, uniqueNumber);
                stmt.executeUpdate();
            }
        } catch (SQLException e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().println("{\"message\": \"An error occurred while adding the student.\"}");
        }
    }

    private boolean studentExists(Connection conn, String uniqueNumber) throws SQLException {
        String sql = "SELECT COUNT(*) FROM students WHERE unique_number = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, uniqueNumber);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    int count = rs.getInt(1);
                    return count > 0;
                }
            }
        }
        return false;
    }


    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setHeader("Access-Control-Allow-Origin", "*");

        List<Student> students = new ArrayList<>();

        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASS)) {
            String sql = "SELECT * FROM students";
            try (Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery(sql)) {
                while (rs.next()) {
                    Student student = new Student(
                            rs.getString("first_name"),
                            rs.getString("last_name"),
                            rs.getString("middle_name"),
                            rs.getDate("birth_date").toString(),
                            rs.getString("group_name"),
                            rs.getString("unique_number")
                    );
                    students.add(student);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        ObjectMapper mapper = new ObjectMapper();
        String jsonResponse = mapper.writeValueAsString(students);

        resp.setContentType("application/json");
        resp.getWriter().println(jsonResponse);
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setContentType("application/json");

        String uniqueNumber = req.getParameter("uniqueNumber");

        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASS)) {
            if (!studentExists(conn, uniqueNumber)) {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                resp.getWriter().println("{\"message\": \"Student with uniqueNumber " + uniqueNumber + " does not exist.\"}");
                return;
            }

            String sql = "DELETE FROM students WHERE unique_number = ?";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setString(1, uniqueNumber);
                int rowsAffected = stmt.executeUpdate();
                if (rowsAffected > 0) {
                    resp.setStatus(HttpServletResponse.SC_OK);
                    resp.getWriter().println("{\"message\": \"Student deleted successfully.\"}");
                } else {
                    resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    resp.getWriter().println("{\"message\": \"An error occurred while deleting the student.\"}");
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().println("{\"message\": \"An error occurred while accessing the database.\"}");
        }
    }

}
