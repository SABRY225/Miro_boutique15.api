const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const { processPayment} = require("../../helpers/paymob");

const createOrder = async (req, res) => {
  try {
    const { cartItems, addressInfo, totalAmount, cartId } = req.body;

    // التحقق من صحة البيانات
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "لم يتم العثور على عناصر في السلة.",
      });
    }
    if (!addressInfo || !addressInfo.address || !addressInfo.city || !addressInfo.phone || !addressInfo.name) {
      return res.status(400).json({
        success: false,
        message: "تفاصيل العنوان غير مكتملة.",
      });
    }
    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "المبلغ الإجمالي غير صالح.",
      });
    }

    // إنشاء الطلب
    const newlyCreatedOrder = new Order({
      cartItems,
      addressInfo,
      totalAmount,
      orderStatus: "طلب جديد",
      orderDate: new Date(),
    });

    // حفظ الطلب
    await newlyCreatedOrder.save();

    // حذف السلة
    if (cartId) {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "لم يتم العثور على السلة المرتبطة.",
        });
      }
      await Cart.findByIdAndDelete(cartId);
    }else{
      res.status(200).json({
        success: true,
        message: "تم تأكيد الطلب بنجاح.",
        orderId: newlyCreatedOrder._id,
      });
    }

  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء معالجة الطلب.",
    });
  }
};


const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${product.title}`,
        });
      }

      product.totalStock -= item.quantity;

      await product.save();
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
