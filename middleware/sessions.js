import redis from '../db/redis.js';
import {generateTokenFromHost, verifyTokenGetHost, sessionIsInActive} from '../utils.js'
import {FREE_HOSTS, SESSIONS, COOKIE_NAME} from '../constant.js';
import {hostToConnection} from '../db/mysql.js';


export default async function(req, res, next) {
    try {
        const freeHosts = JSON.parse(await redis.get(FREE_HOSTS));
        const sessions = JSON.parse(await redis.get(SESSIONS))||[];
        
        var session = await req.cookies[COOKIE_NAME];
        var createConnection = true;
        if(sessions.includes(session)) {
            const host = await verifyTokenGetHost(session);
            const timestamp = await redis.get(session);
            if(sessionIsInActive(timestamp) == false) {
                req.db = hostToConnection(host)
                createConnection = false;
            }
        }
        if(createConnection && freeHosts.length != 0) {
            const host = freeHosts.shift();
            session = await generateTokenFromHost(host);
            await res.cookie(COOKIE_NAME, session, {
                sameSite: "none",
                secure: false
            });
            req.db = hostToConnection(host)
        }

        sessions.push(session);
        await redis.set(SESSIONS, JSON.stringify(sessions));
        await redis.set(session, `${Date.now()}`)
        await redis.set(FREE_HOSTS, JSON.stringify(freeHosts));
    } catch(e) {
        console.log({e}) 
    }
    next();
}
