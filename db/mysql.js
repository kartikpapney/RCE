import * as mysql from 'mysql2'
import redis from './redis.js';
import {FREE_HOSTS, SESSIONS} from '../constant.js';
import dotenv from 'dotenv';
dotenv.config();


const freeHosts = [
    process.env.MYSQL_HOST_1
    , process.env.MYSQL_HOST_2
    , process.env.MYSQL_HOST_3
    , process.env.MYSQL_HOST_4]
const credentials = [
    {
        MYSQL_HOST: process.env.MYSQL_HOST_1,
        MYSQL_USER: process.env.MYSQL_USER_1,
        MYSQL_PASSWORD: process.env.MYSQL_PASSWORD_1,
        MYSQL_DATABASE: process.env.MYSQL_DATABASE_1,
        MYSQL_PORT: process.env.MYSQL_PORT_1
    },
    {
        MYSQL_HOST: process.env.MYSQL_HOST_2,
        MYSQL_USER: process.env.MYSQL_USER_2,
        MYSQL_PASSWORD: process.env.MYSQL_PASSWORD_2,
        MYSQL_DATABASE: process.env.MYSQL_DATABASE_2,
        MYSQL_PORT: process.env.MYSQL_PORT_2
    },
    {
        MYSQL_HOST: process.env.MYSQL_HOST_3,
        MYSQL_USER: process.env.MYSQL_USER_3,
        MYSQL_PASSWORD: process.env.MYSQL_PASSWORD_3,
        MYSQL_DATABASE: process.env.MYSQL_DATABASE_3,
        MYSQL_PORT: process.env.MYSQL_PORT_3
    },
    {
        MYSQL_HOST: process.env.MYSQL_HOST_4,
        MYSQL_USER: process.env.MYSQL_USER_4,
        MYSQL_PASSWORD: process.env.MYSQL_PASSWORD_4,
        MYSQL_DATABASE: process.env.MYSQL_DATABASE_4,
        MYSQL_PORT: process.env.MYSQL_PORT_4
    }
]

const hostToConnectionMapping = freeHosts.map((value, idx) => {
    var connection = mysql.createPool({
        connectionLimit: 1,
        host: credentials[idx].MYSQL_HOST,
        port: credentials[idx].MYSQL_PORT,
        user: credentials[idx].MYSQL_USER,
        password: credentials[idx].MYSQL_PASSWORD,
        database: credentials[idx].MYSQL_DATABASE,
    });
    return {
        host: process.env[`MYSQL_HOST_${(idx+1)}`],
        connection: connection
    }
}).reduce((acc, cur) => ({ ...acc, [cur.host]: cur.connection }), {})

await redis.set(FREE_HOSTS, JSON.stringify(freeHosts));
await redis.set(SESSIONS, JSON.stringify([]));

const hostToConnection = function(host) {
    return hostToConnectionMapping[host];
}

export {
    hostToConnection
};