(function()
{
    const chalk = require('chalk');

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
                let options = log.options;
                delete log.options;

                var color = '';
                if(options && options.color)
                {
                    color = options.color;
                }

                var logText = logForamt + '[' + log.timestamp + ']\n' + JSON.stringify(log, null, 4);
                // for(let key in log)
                // {
                //     if(key !== 'timestamp')
                //     {
                //         logText += '[' + key + ':' + log[key] + ']';
                //     }
                // }

                if(color)
                {
                    console.log(chalk[color](logText));
                }
                else
                {
                    console.log(logText);
                }
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