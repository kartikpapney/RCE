import redis from './db/redis.js'
import {FREE_HOSTS, SESSIONS, CONNECTION_EXPIRATION} from './constant.js';
import jwt from 'jsonwebtoken'
import {hostToConnection} from './db/mysql.js';

const generateTokenFromHost = async function(host) {
    return jwt.sign({
        'host': host,
        'time': Date.now()
    }, process.env.JWT_SECRET);      
}

const verifyTokenGetHost = async function(token) {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    if(data) {
        return data.host;
    } else {
        return null;
    }
}

const sessionIsInActive = function(timestamp) {
    timestamp = parseInt(timestamp);
    return timestamp+CONNECTION_EXPIRATION < Date.now();
}

const freeConnection = async function() {
    try {
        const freeHosts = JSON.parse(await redis.get(FREE_HOSTS));
        let sessions = JSON.parse(await redis.get(SESSIONS))||[];
        
        sessions = (await Promise.all(sessions.map(async(session) => {
            const timestamp = await redis.get(session);
            if(sessionIsInActive(timestamp)) {
                const host = await verifyTokenGetHost(session);
                freeHosts.push(host);
                return {
                    include: false,
                    value: session
                };
            } else {
                return  {
                    include: true,
                    value: session
                };
            }
        }))).filter(value => value.include).map(value => value.value);
        
        await redis.set(FREE_HOSTS, JSON.stringify(freeHosts));
        await redis.set(SESSIONS, JSON.stringify(sessions));
    } catch(e) {
        console.log({e})
    }
    
}


export {
    generateTokenFromHost,
    verifyTokenGetHost,
    sessionIsInActive,
    freeConnection
}