var Transmission = require('transmission'),
    transmission = new Transmission();

function doubleDigits(n)
{
    return (n < 10) ? '0' + n : n;
}

function timeLeft(sec)
{
    var min = sec / 60,
        hour = min / 60,
        day = hour / 24;

    if (day > 1)      return Math.round(day) + 'd';
    else if (min > 1) return Math.floor(hour) + ':' + doubleDigits(Math.ceil(min % 60));
    else              return Math.ceil(sec) + 's';
}

function torrents()
{
    var total           = 0,
        done            = 0,
        totalPercentage = 0,
        maxTimeLeft     = 0;

    transmission.get(function (err, data)
    {
        data.torrents.forEach(function (v, i)
        {
            total++;
            totalPercentage += v.percentDone;
            if (v.percentDone == 1) done++;
            maxTimeLeft = Math.max(maxTimeLeft, v.eta);
        });

        var avgPercentage = totalPercentage / total;

        var out = done + '/' + total
          + ' ' + '[!P:' + Math.floor(avgPercentage * 100) + ']'
          + ' ' + timeLeft(maxTimeLeft);

        process.send({
            slot:  10,
            color: '00afff',
            icon: 'down',
            text: out,
            popup: {
                lines: 30,
                cols: 120,
                command: 'transmission-remote-cli'
            }
        });

        setTimeout(torrents, 5000);
    });
}

if (transmission) torrents();
