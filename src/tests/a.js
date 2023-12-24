const orders = [
    {
        "_id": "65644d599e9f03d593d82c98",
        "order_userId": 1,
        "order_checkout": {
            "totalCheckout": 10501615,
            "feeShip": 0
        },
        "order_shipping": {
            "district": "GL",
            "wards": "Phường Quang Trung",
            "city": "GL3",
            "phone": "11767",
            "recipientName": "Cuong456",
            "note": "Address test...TY"
        },
        "order_payment": "COD",
        "order_type_payment": "COD",
        "order_products": [
            {
                "shopId": "6510f4fcc3c5c7f4e85838e1",
                "item_products": [
                    {
                        "price": 500000,
                        "quantity": 5,
                        "name": "san pham 2",
                        "productId": "65643a802cf8059430155762"
                    }
                ]
            }
        ],
        "order_trackingNumber": "#BBWIN3MAF",
        "createOn": "2023-11-27T08:03:37.144Z"
    },
    {
        "_id": "656450f5ec725b9e142d0223",
        "order_userId": 1,
        "order_checkout": {
            "feeShip": 0,
            "totalDiscount": 161.5,
            "totalCheckout": 2501453.5
        },
        "order_shipping": {
            "district": "GL",
            "wards": "Xã Ia Boòng",
            "city": "GL3",
            "phone": "11767",
            "recipientName": "Thi Oanh",
            "note": "Address test..."
        },
        "order_payment": "COD",
        "order_type_payment": "COD",
        "order_products": [
            {
                "shopId": "6510f4fcc3c5c7f4e85838e1",
                "item_products": [
                    {
                        "price": 500000,
                        "quantity": 5,
                        "name": "san pham 2",
                        "productId": "65643a802cf8059430155762"
                    }
                ]
            }
        ],
        "order_trackingNumber": "#Y4C7309UJ",
        "createOn": "2023-11-27T08:19:01.772Z"
    },
    {
        "_id": "6564babaec725b9e142d0238",
        "order_userId": 1,
        "order_checkout": {
            "totalCheckout": 4000000,
            "feeShip": 0
        },
        "order_shipping": {
            "district": "GL",
            "wards": "Phường Quang Trung",
            "city": "GL3",
            "phone": "11767",
            "recipientName": "Manh Cuong",
            "note": "Address "
        },
        "order_payment": "COD",
        "order_type_payment": "COD",
        "order_products": [
            {
                "shopId": "6510f4fcc3c5c7f4e85838e1",
                "item_products": [
                    {
                        "price": 500000,
                        "quantity": 8,
                        "name": "san pham 3",
                        "productId": "65643a802cf805943015576b"
                    }
                ]
            }
        ],
        "order_trackingNumber": "#DGN09IB9S",
        "createOn": "2023-06-27T15:50:18.090Z"
    }
]

const productSales = {};

// Lặp qua từng đơn hàng và tính toán số lượng bán của từng sản phẩm
orders.forEach(order => {
    order.order_products.forEach(product => {
        const productId = product.item_products[0].productId;
        const quantity = product.item_products[0].quantity;

        if (productSales[productId]) {
            productSales[productId] += quantity;
        } else {
            productSales[productId] = quantity;
        }
    });
});

// Tìm sản phẩm có số lượng bán nhiều nhất
const bestSellingProduct = Object.keys(productSales).reduce((a, b) => productSales[a] > productSales[b] ? a : b);

console.log("Sản phẩm bán chạy nhất có ID là:", bestSellingProduct);