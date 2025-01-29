const User = require("../../models/User");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "لا يوجد حاليا مستخدمين",
      });
    }

    // حساب عدد المستخدمين بناءً على الدور
    const totalUsers = users.length;
    const adminCount = users.filter((user) => user.role === "admin").length;
    const userCount = users.filter((user) => user.role === "user").length;

    res.status(200).json({
      success: true,
      data: {users,adminCount,userCount},
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "حدث خطأ ما!",
    });
  }
};

module.exports = {
  getUsers,
};
