const Redis = require('ioredis');

function initializeRedis() {
  const redis = new Redis({
    host: 'redis-10656.c252.ap-southeast-1-1.ec2.cloud.redislabs.com', // Địa chỉ IP hoặc tên miền của Redis server
    port: 10656,
    password: 'YyRAhniRFBzK12CyXWE9fBj9w25rEt4H', 
  });

  // Bắt sự kiện lỗi kết nối Redis
  redis.on('error', (err) => {
    console.error('Error connecting to Redis:', err);
  });

  // Bắt sự kiện kết nối thành công Redis
  redis.on('connect', () => {
    console.log('Connected to Redis successfully');
  });

  return redis;
}

module.exports = initializeRedis;