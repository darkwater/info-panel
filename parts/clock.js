setInterval(function ()
{
    process.send({
        type: 'text',
        order: 0,
        color: 'ffaf00',
        icon: 'test',
        text: 'world greets'
    });
}, 1000);
