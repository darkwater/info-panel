setInterval(function ()
{
    process.send({
        type: 'text',
        slot:  1,
        color: 'ffaf00',
        icon: 'clock',
        text: 'world greets'
    });
}, 1000);
