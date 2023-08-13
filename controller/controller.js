export default async function(req, res) {
    const {query} = req.body;
    try {
        if(!req.db) {
            res.status(503).send('Service is not available');
        } else {
            const connection = req.db;
            connection.query(query, function (error, results, fields) {
                if (error) {
                    res.status(404).send({res: 'Error'})
                } else {
                    res.status(200).send({res: results})
                }
            });
        }
        
    } catch (e) {
        res.status(200).send({res: e});
    }
}