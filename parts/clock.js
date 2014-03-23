var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    dowNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function format(n)
{
    return (n < 10) ? '0' + n : n;
}

function clock()
{
    var now  = new Date(),
        sec  = now.getSeconds(),
        min  = now.getMinutes(),
        hour = now.getHours(),
        dow  = now.getDay(),
        date = now.getDate(),
        mon  = now.getMonth(),

        str = dowNames[dow] + ' '
            + monthNames[mon] + ' '
            + date + ' '
            + format(hour) + ':'
            + format(min) + ':'
            + format(sec);

    process.send({
        type: 'text',
        slot:  1,
        color: 'ffaf00',
        // icon: 'clock',
        text: str
    });

    setTimeout(clock, 1000 - (new Date()).getMilliseconds());
}

clock();
