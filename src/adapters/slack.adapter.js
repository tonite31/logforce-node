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
        this.slack.webhook({
            channel: this.options.channel,
            username: this.options.username,
            text: '```' + JSON.stringify(logger.json(), null, 4) + '```'
        }, function(err, response) {
        });
    };

    module.exports = SlackAdapter;
})();