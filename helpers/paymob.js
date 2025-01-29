
const API = process.env.API_KRY;  // your API here
const integrationID = process.env.INTGERATION_ID;

async function processPayment(orderData) {
    try {
        // Step 1: Get token
        let tokenResponse = await fetch('https://accept.paymob.com/api/auth/tokens', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ "api_key": API })
        });

        let tokenData = await tokenResponse.json();
        let token = tokenData.token;

        // Step 2: Create order
        let orderResponse = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "auth_token": token,
                "delivery_needed": "false",
                "amount_cents": (orderData.totalAmount * 100).toString(),
                "currency": "EGP",
                "items": [],
            })
        });

        let orderDataResponse = await orderResponse.json();
        let orderId = orderDataResponse.id;

        // Step 3: Create payment key
        let paymentResponse = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "auth_token": token,
                "amount_cents": (orderData.totalAmount * 100).toString(),
                "expiration": 3600,
                "order_id": orderId,
                "billing_data": {
                    "apartment": "803",
                    "email": "claudette09@exa.com",
                    "floor": "42",
                    "first_name": "Clifford",
                    "street": "Ethan Land",
                    "building": "8028",
                    "phone_number": "+86(8)9135210487",
                    "shipping_method": "PKG",
                    "postal_code": "01898",
                    "city": "Jaskolskiburgh",
                    "country": "CR",
                    "last_name": "Nicolas",
                    "state": "Utah"
                },
                "currency": "EGP",
                "integration_id": integrationID
            })
        });

        let paymentData = await paymentResponse.json();
        return paymentData.token;
    } catch (error) {
        console.error("Error processing payment:", error);
        throw error;
    }
}

module.exports = { processPayment};
