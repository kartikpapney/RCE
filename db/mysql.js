import * as mysql from 'mysql2'
import redis from './redis.js';
import {FREE_HOSTS} from '../constant.js';

const freeHosts = [
    process.env.MYSQL_HOST1
    , process.env.MYSQL_HOST2
    , process.env.MYSQL_HOST3
    , process.env.MYSQL_HOST4]

const hostToConnectionMapping = freeHosts.map((host) => {
    var connection = mysql.createPool({
        connectionLimit: 1,
        host: host,
        user: process.env.MYSQL_USER || "root",
        password: process.env.MYSQL_PASSWORD || "password",
        database: process.env.MYSQL_DATABASE || "test",
      });
    return {
        host: host,
        connection: connection
    }
}).reduce((acc, cur) => ({ ...acc, [cur.host]: cur.connection }), {})

await redis.set(FREE_HOSTS, JSON.stringify(freeHosts));

const hostToConnection = function(host) {
    return hostToConnectionMapping[host];
}

export {
    hostToConnection
};