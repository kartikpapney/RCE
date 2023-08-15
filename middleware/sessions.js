import redis from '../db/redis.js';
import {generateTokenFromHost} from '../utils.js'
import {FREE_HOSTS, SESSIONS, COOKIE_NAME} from '../constant.js';
import {hostToConnection} from '../db/mysql.js';


export default async function(req, res, next) {
    try {
        const freeHosts = JSON.parse(await redis.get(FREE_HOSTS));
        const sessions = JSON.parse(await redis.get(SESSIONS))||[];
        var session = await req.cookies[COOKIE_NAME];
        const containsSession = sessions.find(item => item.token === session);
        if(containsSession) {
            req.db = hostToConnection(containsSession.host);
            containsSession.timestamp = Date.now();
        } else if(freeHosts.length != 0) {
            const host = freeHosts.shift();
            session = await generateTokenFromHost(host);
            await res.cookie(COOKIE_NAME, session, {
                sameSite: "none",
                secure: true
            });
            req.db = hostToConnection(host);
            sessions.push({
                token: session,
                timestamp: Date.now(),
                host: host
            })
        }
        await redis.set(SESSIONS, JSON.stringify(sessions));
        await redis.set(FREE_HOSTS, JSON.stringify(freeHosts));
    } catch(e) {
        console.log({e}) 
    }
    next();
}
