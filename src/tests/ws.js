
const input = [
    {
        "shopId": "6516851253891feb771ff003",
        "item_products": [
            {
                "price": 2000000,
                "quantity": 4,
                "productId": "6554d28326b26b3e96ca6ab3",
                "thumb": "http://res.cloudinary.com/datnecommerce2023/image/upload/h_269,w_269/v1/product/thumb/6516851253891feb771ff003/thumb.jpg",
                "name": "San pham 2"
            },

        ]
    },
    {
        "shopId": "6516851253891feb771ff003",
        "item_products": [
            {
                "price": 323,
                "quantity": 5,
                "productId": "653bef6030a7d95b4294ef85",
                "thumb": "https://res.cloudinary.com/datnecommerce2023/image/upload/v1698550900/product/thumb/6516851253891feb771ff003/thumb.png",
                "name": "reactjs"
            }
        ]
    },
    {
        "shopId": "6510f4fcc3c5c7f4e85838e1",
        "item_products": [
            {
                "price": 500000,
                "quantity": 5,
                "productId": "65643a802cf805943015576b",
                "thumb": "https://res.cloudinary.com/datnecommerce2023/image/upload/v1698550900/product/thumb/6516851253891feb771ff003/thumb.png",
                "name": "san pham 3"
            }
        ]
    }
]


const resultArray = input.reduce((acc, curr) => {
    const existingShop = acc.find(item => item.shopId === curr.shopId);
  
    if (existingShop) {
      existingShop.item_products.push(...curr.item_products);
    } else {
      acc.push({ ...curr });
    }
  
    return acc;
  }, []);
  
  console.log(resultArray);