var child_process = require("child_process"),
    spawn         = child_process.spawn,
    exec          = child_process.exec;

var settings = {
    bg: "#1d1f21", // Background color
    tw: 1100,      // Width
    h:  24,        // Height
    ta: "r",       // Text align
    fn: "Droid Sans Mono:size=10"
};

var dzen_processes = [],
    screens        = 0;

exec("xrandr | grep -c '*'", function (error, stdout, stderr)
{
    screens = Number(stdout);


});
