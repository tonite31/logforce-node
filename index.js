(function()
{
    const uuidv4 = require('uuid/v4');
    const Manager = require('./src/manager.js');
    const Logger = require('./src/logger.js');

    module.exports.initialize = function(options)
    {
        let manager = new Manager(options);

        return function(req, res, next)
        {
            if(req.method)
            {
                req.requestId = uuidv4();
                let logger = req.logger = new Logger(req.requestId);

                var logData = { type: 'REQ', url: req.url, method: req.method };
                if(req.method === 'GET')
                {
                    logData.query = req.query;
                }
                else
                {
                    logData.body = req.body;
                }

                logData.headers = req.headers;

                logger.json(logData);

                let send = res.send;
                res.send = function()
                {
                    let body = arguments.length === 1 ? arguments[0] : arguments;
                    logger.json({ status: this.statusCode, body: body });

                    manager.publish(logger);
                    return send.apply(this, arguments);
                }.bind(res);
            }

            next();
        };
    };
})();