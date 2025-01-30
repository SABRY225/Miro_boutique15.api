const Complaints = require("../../models/Complaints");

// إنشاء شكوى جديدة
const createComplaint = async (req, res) => {
  try {
    const { name, phone, email, notes } = req.body;

    const newComplaint = new Complaints({ name, phone, email, notes });
    await newComplaint.save();

    res.status(201).json({
      success: true,
      message: "تم إرسال الشكوى بنجاح!",
      data: newComplaint,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء إرسال الشكوى.",
    });
  }
};

// جلب كل الشكاوى
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaints.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء جلب الشكاوى.",
    });
  }
};

module.exports = { createComplaint, getAllComplaints };
