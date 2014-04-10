var cp = require('child_process'),
    fs = require('fs'),
    net = require('net');

var settings = [
    '-bg', '#1d1f21', // Background color
    '-y' , '1058',    // Y position
    '-tw', '1100',    // Width
    '-h' , '24',      // Height
    '-ta', 'r',       // Text align
    '-fn', 'Droid Sans Mono:size=10'
];

var dzen_processes = [],
    screens        = 0,
    parts          = [],
    buffer         = [],
    popups         = [];


function write(data)
{
    dzen_processes.forEach(function (v)
    {
        v.stdin.write(data);
    });
}

function update()
{
    for (var i = buffer.length - 1; i >= 0; i--)
    {
        if (!buffer[i]) continue;

        write('^fg(#717171)\\\\ ');
        write(buffer[i]);
        write(' ');
    }
    write(" \n");
}


var server = net.createServer(function (c)
{
    c.on('data', function (data)
    {
        var part = data.toString().replace(/\n/g, '');
        
        if (popups[part])
        {
            var popup = popups[part];

            var w = popup.cols * 6 + 2,
                h = popup.lines * 13 + 2,
                x = 1920 - w,
                y = 1056 - h,
                geom = w +'x'+ h +'+'+ x +'+'+ y;

            cp.spawn('terminator', ['--geometry=' + geom, '-x', 'bash', '-c', popup.command]);
        }
    });
});

server.listen(1150);


cp.exec('xrandr | grep -c "*"', function (error, stdout, stderr)
{
    screens = Number(stdout);

    for (var i = 0; i < screens; i++)
    {
        var params = settings.slice();
        params.push('-x', 820 + i * 1920);

        dzen_processes[i] = cp.spawn('dzen2', params);

        dzen_processes[i].stderr.on('data', function (data)
        {
            console.error(data +'');
        });
    }

    var files = fs.readdirSync('parts');

    files.forEach(function (file)
    {
        parts[file] = cp.fork(__dirname + '/parts/' + file.match(/[^.]+/)[0]);
        
        parts[file].on('message', function (data)
        {
            switch (data.type)
            {
                case 'text':
                    buffer[data.slot] = (data.popup ? ('^ca(1,echo ' + data.slot + ' | nc localhost 1150)') : '')
                                      + '^fg(#' + data.color + ')'
                                      + ((data.icon) ? ('^i(/home/dark/projects/info-panel/icons/' + data.icon + '.xbm) ') : '')
                                      + data.text
                                      + (data.popup ? '^ca()' : '');
            }

            if (data.popup) popups[data.slot] = data.popup;
            else delete popups[data.slot];

            update();
        });
    });
});
