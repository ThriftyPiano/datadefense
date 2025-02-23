function helperFn(proc, xScale, yScale) {
    return {
        lineWidth: 1,
        colorSchemes: [],
        colorScheme: 0,
        startingDifficulty: 35,
        difficulty: this.startingDifficulty,
        hexagon: function (x, y, r, d) {
            for (var k = r; k < r + 360; k += 60) {
                proc.line(x + proc.cos(k) * d / 2, y + proc.sin(k) * d / 2, x + proc.cos(k + 60) * d / 2, y + proc.sin(k + 60) * d / 2);
            }
        },
        modulo: function (n, m) {
            return ((n % m) + m) % m;
        },
        hexDist: function (angle) {
            angle = this.modulo(angle, 60);
            return proc.sin(60) / proc.sin(120 - angle);
        },
        checkHover: function (button) {
            var angle = proc.atan2(proc.mouseY * yScale - button.y, proc.mouseX * xScale - button.x);
            return proc.dist(proc.mouseX * xScale, proc.mouseY * yScale, button.x, button.y) <= button.radius * this.hexDist(angle + proc.frameCount);
        },
    };
}