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
        slot:  1,
        color: 'ffaf00',
        // icon: 'clock',
        text: str,
        popup: {
            cols: 71,
            lines: 35,
            command: 'echo -e "\\e[?1000h\\e[?25l"; cal -my --color=always | head -n -2 | sed "s/^/  /"; read -sn 12'
        }
    });

    setTimeout(clock, 1000 - (new Date()).getMilliseconds());
}

clock();
