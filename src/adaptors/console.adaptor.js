(function()
{
    function logToConsole(logForamt, logs)
    {
        for(var i=0, l=logs.length; i<l; i++)
        {
            let log = logs[i];
            if(Array.isArray(log))
            {
                logToConsole('\t' + logForamt, log);
            }
            else
            {
                var logText = logForamt + '[' + log.timestamp + ']';
                for(let key in log)
                {
                    if(key !== 'timestamp')
                    {
                        logText += '[' + key + ':' + log[key] + ']';
                    }
                }

                console.log(logText);
            }
        }
    }

    module.exports = { name: 'console', exec: function(logger)
    {
        var logForamt = '[ns:' + logger.ns + ']';
        for(let key in logger.tags)
        {
            logForamt += '[' + key + ':' + logger.tags[key] + ']';
        }

        logToConsole(logForamt, logger.logs);
    }};
})();