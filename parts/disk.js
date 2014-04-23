var child_process = require('child_process');

function disk_space()
{
    child_process.exec("df -kh '/' '/data' '/home/'", function(error, stdout, stderr)
    {
        var lines = stdout.trim().split("\n").slice(1),
            disks = [];

        lines.forEach(function (line, k)
        {
            var arr = line.replace(/[\s\n\r]+/g, ' ').split(' ');
            disks.push(arr[3]);
        });

        process.send({
            slot:  2,
            color: 'ffd700',
            // icon: 'disk',
            text: disks.join(' \\ ')
        });
    });

    setTimeout(disk_space, 30000);
}

disk_space();
