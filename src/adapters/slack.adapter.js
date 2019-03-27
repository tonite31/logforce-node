(function()
{
    const Slack = require('slack-node');

    const SlackAdapter = function(options, level)
    {
        this.name = 'slack';
        this.options = options || {};
        this.slack = new Slack();
        this.slack.setWebhook(this.options.webhookUrl);
        this.level = level;
    };

    SlackAdapter.prototype.publish = function(logger)
    {
        var logFormat = '[ns:' + logger.ns + ']';
        for(let key in logger.tags)
        {
            logFormat += '[' + key + ':' + logger.tags[key] + ']';
        }

        let logText = this.log(logFormat, logger.logs);

        if(logText)
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
                let level = log.level;
                if(this.level)
                {
                    if(Array.isArray(this.level))
                    {
                        var check = false;
                        for(let i=0; i<this.level.length; i++)
                        {
                            if(this.level[i] === level)
                            {
                                check = true;
                                break;
                            }
                        }

                        if(!check)
                        {
                            continue;
                        }
                    }
                    else if(typeof this.level === 'string' && this.level !== level)
                    {
                        continue;
                    }
                }

                delete log.options;

                let timestamp = log.timestamp;
                delete log.timestamp;

                delete log.level;
                delete log.color;

                logText += '\n[' + level + ']' + logFormat + '[ts:' + timestamp + ']\n' + JSON.stringify(log, null, 4).replace(/\\n/gi, '\n').replace(/\\t/gi, '\t');
            }
        }

        return logText;
    };

    module.exports = SlackAdapter;
})();