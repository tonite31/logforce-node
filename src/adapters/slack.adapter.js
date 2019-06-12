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
        let json = logger.json();

        for(let i=0; i<json.logs.length; i++)
        {
            if(!this.level || this.level === json.logs[i].level)
            {
                delete json.logs[i].level;

                let log = { header: json.header, logs: json.logs[i] };

                this.slack.webhook({
                    channel: this.options.channel,
                    username: this.options.username,
                    text: '```' + JSON.stringify(log, null, 4) + '```'
                }, function(err, response) {
                });
            }
        }
    };

    module.exports = SlackAdapter;
})();