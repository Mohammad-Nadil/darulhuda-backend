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
  getClassForTeacher,
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
router.get("/student", getStudents);
router.get("/student/:id", findStudentById);
router.post("/student", upload.single("image"), addStudent);
router.put("/student/:id", upload.single("image"), updateStudent);
router.delete("/student/:id", deleteStudent);

// Teacher Routes
router.get("/teacher", getClassForTeacher);
router.get("/teacher/:id", findTeacher);
router.post("/teacher", upload.single("image"), addTeacher);
router.put("/teacher/:id", upload.single("image"), updateTeacher);
router.delete("/teacher/:id", deleteTeacher);

// Class Routes
router.get("/class", getClass);
router.get("/class/:id", findClass);
router.post("/class",upload.none(), addClass);
router.put("/class/:id",upload.none(), updateClass);
router.delete("/class/:id", deleteClass);

// Announcement Routes
router.get("/announcement", getAnnouncements);
router.get("/announcement/:id", findAnnouncement);
router.post("/announcement", upload.single("file"), addAnnouncement);
router.put("/announcement/:id", upload.single("file"), updateAnnouncement);
router.delete("/announcement/:id", deleteAnnouncement);

// Event Routes
router.get("/event", getEvents);
router.get("/event/:id", findEvent);
router.post("/event", upload.single("image"), addEvent);
router.put("/event/:id", upload.single("image"), updateEvent);
router.delete("/event/:id", deleteEvent);

export default router;
