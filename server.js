const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 1000;
const filePath = path.join(__dirname, "students.json");

// Read students from file
function readStudents(callback) {
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, JSON.parse(data || "[]"));
    }
  });
}

// Write students to file
function writeStudents(students, callback) {
  fs.writeFile(
    filePath,
    JSON.stringify(students, null, 2),
    "utf-8",
    callback
  );
}

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  // ================= GET =================
  if (req.method === "GET" && req.url === "/students") {
    readStudents((err, students) => {
      if (err) {
        res.statusCode = 500;
        return res.end(JSON.stringify({ message: "Unable to read file" }));
      }

      res.statusCode = 200;
      res.end(JSON.stringify(students));
    });
    
  }

  // ================= POST =================
  else if (req.method === "POST" && req.url === "/students") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const newStudent = JSON.parse(body);

        readStudents((err, students) => {
          if (err) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ message: "Unable to read file" }));
          }

          const student = {
            id: students.length ? students[students.length - 1].id + 1 : 1,
            ...newStudent,
          };

          students.push(student);

          writeStudents(students, (err) => {
            if (err) {
              res.statusCode = 500;
              return res.end(
                JSON.stringify({ message: "Unable to save student" })
              );
            }

            res.statusCode = 201;
            res.end(
              JSON.stringify({
                message: "Student created successfully",
                student,
              })
            );
          });
        });
      } catch {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: "Invalid JSON" }));
      }
    });
  }

  // ================= PUT =================
  else if (req.method === "PUT" && req.url.startsWith("/students/")) {
    const id = Number(req.url.split("/")[2]);

    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const updatedData = JSON.parse(body);

        readStudents((err, students) => {
          if (err) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ message: "Unable to read file" }));
          }

          const index = students.findIndex((student) => student.id === id);

          if (index === -1) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ message: "Student not found" }));
          }

          students[index] = {
            ...students[index],
            ...updatedData,
          };

          writeStudents(students, (err) => {
            if (err) {
              res.statusCode = 500;
              return res.end(
                JSON.stringify({ message: "Unable to update student" })
              );
            }

            res.statusCode = 200;
            res.end(
              JSON.stringify({
                message: "Student updated successfully",
                student: students[index],
              })
            );
          });
        });
      } catch {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: "Invalid JSON" }));
      }
    });
  }

  // ================= DELETE =================
  else if (req.method === "DELETE" && req.url.startsWith("/students/")) {
    const id = Number(req.url.split("/")[2]);

    readStudents((err, students) => {
      if (err) {
        res.statusCode = 500;
        return res.end(JSON.stringify({ message: "Unable to read file" }));
      }

      const index = students.findIndex((student) => student.id === id);

      if (index === -1) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ message: "Student not found" }));
      }

      const deletedStudent = students.splice(index, 1);

      writeStudents(students, (err) => {
        if (err) {
          res.statusCode = 500;
          return res.end(
            JSON.stringify({ message: "Unable to delete student" })
          );
        }

        res.statusCode = 200;
        res.end(
          JSON.stringify({
            message: "Student deleted successfully",
            deletedStudent: deletedStudent[0],
          })
        );
      });
    });
  }

  // ================= 404 =================
  else {
    res.statusCode = 404;
    res.end(
      JSON.stringify({
        message: "Route not found",
      })
    );
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
