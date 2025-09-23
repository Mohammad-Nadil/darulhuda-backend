import e from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  addStudent,
  deleteStudent,
  findStudentById,
  getStudents,
  updateStudent,
} from "../controllers/student.controller.js";
import {
  addClass,
  deleteClass,
  findClass,
  getClass,
  updateClass,
} from "../controllers/class.controller.js";
import {
  getTeacher,
  findTeacher,
  addTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacher.controller.js";
import {
  getAnnouncements,
  findAnnouncement,
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcement.controller.js";
import {
  getEvents,
  findEvent,
  addEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";
const router = e.Router();

// Student Routes
router.get("/student/all", getStudents);
router.get("/student/find/:id", findStudentById);
router.post("/student/add", upload.single("image"), addStudent);
router.put("/student/update/:id", upload.single("image"), updateStudent);
router.delete("/student/delete/:id", deleteStudent);

// Teacher Routes
router.get("/teacher/all", getTeacher);
router.get("/teacher/find/:id", findTeacher);
router.post("/teacher/add", upload.single("image"), addTeacher);
router.put("/teacher/update/:id", upload.single("image"), updateTeacher);
router.delete("/teacher/delete/:id", deleteTeacher);

// Class Routes
router.get("/class/all", getClass);
router.get("/class/find/:id", findClass);
router.post("/class/add",upload.none(), addClass);
router.put("/class/update/:id",upload.none(), updateClass);
router.delete("/class/delete/:id", deleteClass);

// Announcement Routes
router.get("/announcement/all", getAnnouncements);
router.get("/announcement/find/:id", findAnnouncement);
router.post("/announcement/add", upload.single("file"), addAnnouncement);
router.put("/announcement/update/:id", upload.single("file"), updateAnnouncement);
router.delete("/announcement/delete/:id", deleteAnnouncement);

// Event Routes
router.get("/event/all", getEvents);
router.get("/event/find/:id", findEvent);
router.post("/event/add", upload.single("image"), addEvent);
router.put("/event/update/:id", upload.single("image"), updateEvent);
router.delete("/event/delete/:id", deleteEvent);

export default router;
