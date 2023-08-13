export default function debug(val) {
    if(process.env.ENVIRONMENT == 'dev') {
        console.log(val);
    }
}