var cp = require('child_process'),
    fs = require('fs');

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
    buffer         = [];


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
                    buffer[data.slot] = '^fg(#' + data.color + ')'
                                      + ((data.icon) ? ('^i(/home/dark/projects/info-panel/icons/' + data.icon + '.xbm) ') : '')
                                      + data.text;
            }

            update();
        });
    });
});
