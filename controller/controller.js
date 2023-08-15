export default async function(req, res) {
    const {query} = req.body;
    try {
        if(!req.db) {
            res.status(503).send({res: 'Service is not available'});
        } else {
            const connection = req.db;
            connection.query(query, function (error, results, fields) {
                if (error) {
                    res.status(422).send({res: error.sqlMessage})
                } else {
                    res.status(200).send({res: results})
                }
            });
        }
        
    } catch (e) {
        res.status(500).send({res: 'Unexpected Error'});
    }
}