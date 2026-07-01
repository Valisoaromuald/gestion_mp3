// config.js
require('dotenv').config({ path: '../.env' });
console.log(process.env.LOG_FILE_PATH)
module.exports = {
    rabbitmq: {
        host    : process.env.RABBITMQ_HOST,
        port    : process.env.RABBITMQ_PORT,
        login   : process.env.RABBITMQ_LOGIN,
        password: process.env.RABBITMQ_MOT_DE_PASSE,
        queue   : process.env.RABBITMQ_QUEUE_METADATA
    },
    api: {
        url: process.env.API_URL  // ex: http://localhost:8080
    },
    logs : {
        log_file_path: process.env.LOG_FILE_PATH
    },
    blacklist:{
        file_path: process.env.BLACKLIST_FILE_PATH
    }
};