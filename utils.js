import redis from './db/redis.js'
import {FREE_HOSTS, SESSIONS} from './constant.js';
import jwt from 'jsonwebtoken'
import {hostToConnection} from './db/mysql.js';
import dotenv from 'dotenv';
dotenv.config();
const CONNECTION_EXPIRATION = process.env.CONNECTION_EXPIRATION;
const generateTokenFromHost = async function(host) {
    return jwt.sign({
        'host': host,
        'time': Date.now()
    }, process.env.JWT_SECRET);      
}

const sessionIsInActive = function(timestamp) {
    timestamp = parseInt(timestamp);
    return timestamp+parseInt(CONNECTION_EXPIRATION) < Date.now();
}

const freeConnection = async function() {
    try {
        const freeHosts = JSON.parse(await redis.get(FREE_HOSTS));
        let sessions = JSON.parse(await redis.get(SESSIONS)) || [];
        sessions = (await Promise.all(sessions.map(async(session) => {
            try {
                const timestamp = session.timestamp;
                if (sessionIsInActive(timestamp)) {
                    const host = session.host;
                    freeHosts.push(host);
                    return {
                        include: false,
                        value: session
                    };
                } else {
                    return {
                        include: true,
                        value: session
                    };
                }
            } catch (innerError) {
                console.error("Error in session processing:", innerError);
                return {
                    include: true,
                    value: session
                };
            }
        }))).filter(value => value.include).map(value => value.value);
        
        await redis.set(FREE_HOSTS, JSON.stringify(freeHosts));
        await redis.set(SESSIONS, JSON.stringify(sessions));
    } catch (e) {
        console.error("Top-level error:", e);
    }
}


export {
    generateTokenFromHost,
    sessionIsInActive,
    freeConnection
}