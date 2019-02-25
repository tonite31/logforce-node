(function()
{
    const Slack = require('slack-node');

    const SlackAdapter = function(options)
    {
        this.name = 'slack';
        this.options = options || {};
        this.slack = new Slack();
        this.slack.setWebhook(this.options.webhookUrl);
    };

    SlackAdapter.prototype.publish = function(logger)
    {
        if(logger.logs[logger.logs.length-1])

        var logFormat = '[ns:' + logger.ns + ']';
        for(let key in logger.tags)
        {
            logFormat += '[' + key + ':' + logger.tags[key] + ']';
        }

        let logText = this.log(logFormat, logger.logs);

        if(this.options.env === 'prod')
        {
            this.slack.webhook({
                channel: this.options.channel,
                username: this.options.username,
                text: '```' + logText + '```'
            }, function(err, response) {
            });
        }
    };

    SlackAdapter.prototype.log = function(logFormat, logs)
    {
        var logText = '';
        for(var i=0, l=logs.length; i<l; i++)
        {
            if(logs[i] === 'child')
            {
                continue;
            }

            let log = JSON.parse(JSON.stringify(logs[i]));
            if(Array.isArray(log))
            {
                logText += '\n' + this.log('\t' + logFormat, log);
            }
            else
            {
                delete log.options;

                let timestamp = log.timestamp;
                delete log.timestamp;

                let level = log.level;
                delete log.level;
                delete log.color;

                logText += '\n[' + level + ']' + logFormat + '[ts:' + timestamp + ']\n' + JSON.stringify(log, null, 4).replace(/\\n/gi, '\n').replace(/\\t/gi, '\t');
            }
        }

        return logText;
    };

    module.exports = SlackAdapter;
})();