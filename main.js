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
    parts          = [];


function write(data)
{
    dzen_processes.forEach(function (v)
    {
        v.stdin.write(data);
    });
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
        
        parts[file].on("message", function (msg)
        {
            write(msg.text + "\n");
        });
    });
});
