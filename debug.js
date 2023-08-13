export default function debug(val) {
    if(process.env.NODE_ENV == 'dev') {
        console.log(val);
    }
}