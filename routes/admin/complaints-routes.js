const express = require("express");
const { createComplaint, getAllComplaints } = require("../../controllers/admin/complaints-controller");

const router = express.Router();

router.post("/", createComplaint); // إرسال شكوى جديدة
router.get("/", getAllComplaints); // جلب كل الشكاوى

module.exports = router;
