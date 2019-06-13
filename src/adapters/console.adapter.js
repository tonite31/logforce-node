(function()
{
    const ConsoleAdapter = function(level)
    {
        this.name = 'console';
        this.level = level || 'log';
    };

    ConsoleAdapter.prototype.publish = function(logger)
    {
        let json = logger.json();

        console.log('header', json.header);

        for(let i=0; i<json.logs.length; i++)
        {
            if(!this.level || this.level === json.logs[i].level)
            {
                let level = json.logs[i].level;
                delete json.logs[i].level;

                console[level](json.logs[i]);
            }
        }
    };

    module.exports = ConsoleAdapter;
})();