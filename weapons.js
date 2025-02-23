// Average DPS should be slightly less than 2 (Except Mono, Freeze's DPS)

function weaponsFn(proc, helper, bullets, players) {
    return [{
        name: 'Base',
        description: 'Literally nothing. Do not use unless you have no other guns.',
        display: function (x, y, s, reload) { },
        reload: 0,
        shoot: function (x, y, angle, side, damage) {

        },
    },
    {
        name: 'Base Prime',
        description: 'A fancier version of nothing.',
        display: function (x, y, s, reload) {
            helper.hexagon(x - s, y, 0, s * 2);
        },
        reload: 0,
        shoot: function (x, y, angle, side, damage) { },
    },
    {
        name: 'Mono',
        description: 'The standard turret. A jack of all trades.',
        display: function (x, y, s, reload) {
            proc.rect(x - s / 8, y - s / 2, s / 2 + s / 2 * reload, s);
        },
        shoot: function (x, y, angle, side, damage) {
            bullets.push({
                x: x,
                y: y,
                angle: angle,
                speed: 4,
                type: 0,
                radius: 5,
                life: 0,
                side: side,
                dead: false,
                damage: damage,
            });
        },
        reload: 18,
    },
    {
        name: 'Mono Prime',
        description: 'Shoots smaller bullets than a Mono at a higher frequency and speed. Bullets do slightly less damage.',
        display: function (x, y, s, reload) {
            proc.rect(x - s / 8, y - s / 3, s / 2 + s / 2 * reload, s * 2 / 3);
            proc.rect(x - s / 2, y - s / 2, s / 2, s);
        },
        shoot: function (x, y, angle, side, damage) {
            bullets.push({
                x: x,
                y: y,
                angle: angle,
                speed: 6,
                type: 0,
                radius: 3,
                life: 0,
                side: side,
                dead: false,
                damage: damage * 0.8,
            });
        },
        reload: 12,
    },
    {
        name: 'Double',
        description: 'Double the bullets for slower reload.',
        display: function (x, y, s, reload) {
            proc.rect(x - s, y - s / 2 - s / 2, s * 3 / 2 + s / 2 * reload, s);
            proc.rect(x - s, y + s / 2 - s / 2, s * 3 / 2 + s / 2 * reload, s);
            proc.line(x + s / 2 * reload, y - s, x + s / 2 * reload, y + s);
        },
        shoot: function (x, y, angle, side, damage) {
            bullets.push({
                x: x - proc.cos(angle + 90) * 7.5,
                y: y - proc.sin(angle + 90) * 7.5,
                angle: angle,
                speed: 4,
                type: 0,
                radius: 5,
                life: 0,
                side: side,
                dead: false,
                damage: damage,
            });
            bullets.push({
                x: x + proc.cos(angle + 90) * 7.5,
                y: y + proc.sin(angle + 90) * 7.5,
                angle: angle,
                speed: 4,
                type: 0,
                radius: 5,
                life: 0,
                side: side,
                dead: false,
                damage: damage,
            });
        },
        reload: 25,
    },
    {
        name: 'Double Prime',
        description: 'Launches three bullets instead of two at a lower fire rate.',
        display: function (x, y, s, reload) {
            proc.rect(x - s, y - s / 2 - s / 2, s * 3 / 2 + s / 2 * reload, s);
            proc.rect(x - s, y + s / 2 - s / 2, s * 3 / 2 + s / 2 * reload, s);
            proc.rect(x - s, y - s / 2, s * 5 / 4 + s / 2 * reload, s);
            proc.line(x + s / 2 * reload, y - s, x + s / 2 * reload, y + s);
        },
        shoot: function (x, y, angle, side, damage) {
            bullets.push({
                x: x - proc.cos(angle + 90) * 7.5,
                y: y - proc.sin(angle + 90) * 7.5,
                angle: angle,
                speed: 4,
                type: 0,
                radius: 5,
                life: 0,
                side: side,
                dead: false,
                damage: damage,
            });
            bullets.push({
                x: x + proc.cos(angle + 90) * 7.5,
                y: y + proc.sin(angle + 90) * 7.5,
                angle: angle,
                speed: 4,
                type: 0,
                radius: 5,
                life: 0,
                side: side,
                dead: false,
                damage: damage,
            });
            bullets.push({
                x: x,
                y: y,
                angle: angle,
                speed: 4,
                type: 0,
                radius: 5,
                life: 0,
                side: side,
                dead: false,
                damage: damage,
            });
        },
        reload: 40,
    },
    {
        name: 'Blitz',
        description: 'A barrage of concentrated low-damage bullets.',
        display: function (x, y, s, reload) {
            for (var k = 0; k < 4; k++) {
                proc.rect(x - s / 8, y - s / 6 + s / 4 * proc.sin(reload / 4 * 360 + k * 90), s * 3 / 2, s / 3);
            }
        },
        shoot: function (x, y, angle, side, damage) {
            bullets.push({
                x: x,
                y: y,
                angle: angle,
                speed: 8,
                type: 1,
                radius: 2.5,
                life: 0,
                side: side,
                dead: false,
                damage: damage,
            });
        },
        reload: 5,
    },
    {
        name: 'Blitz Prime',
        description: 'Shoots tiny, fast bullets at a high frequency. Bullets will spread a bit.',
        display: function (x, y, s, reload) {
            for (var k = 0; k < 4; k++) {
                proc.rect(x - s / 8, y - s / 6 + s / 4 * proc.sin(reload / 4 * 360 + k * 90), s * 3 / 2, s / 3);
            }
            proc.rect(x - s / 4, y - s / 2, s / 2, s);
        },
        shoot: function (x, y, angle, side, damage) {
            bullets.push({
                x: x,
                y: y,
                angle: angle + proc.random(-5, 5),
                speed: 12,
                type: 1,
                radius: 1,
                life: 0,
                side: side,
                dead: false,
                damage: damage * 0.45,
            });
        },
        reload: 2,
    },
    {
        name: 'Seeker',
        description: 'Shoots damaging tracer missiles that explode.',
        display: function (x, y, s, reload) {
            proc.quad(x, y - s / 2, x, y + s / 2, x + s * 3 / 4, y + s * 3 / 2, x + s * 3 / 4, y - s * 3 / 2);
            proc.line(x + s * 3 / 4, y, x + s * 2, y);
            proc.fill(proc.lerpColor(helper.colorSchemes[helper.colorScheme], proc.color(0, 0, 0), proc.floor((proc.frameCount / 10) % 2)));
            proc.ellipse(x + s * 2, y, s / 2, s / 2);
            proc.fill(0, 0, 0);
        },
        shoot: function (x, y, angle, side, damage) {
            bullets.push({
                x: x,
                y: y,
                angle: angle,
                speed: 4,
                type: 2,
                radius: 2.5,
                life: 0,
                side: side,
                dead: false,
                damage: damage,
            });
        },
        reload: 40,
    },
    {
        name: 'Seeker Prime',
        description: 'Manufactures larger, slower drones with higher damage.',
        display: function (x, y, s, reload) {
            proc.quad(x, y - s / 2, x, y + s / 2, x + s * 3 / 4, y + s * 3 / 2, x + s * 3 / 4, y - s * 3 / 2);
            proc.line(x + s * 3 / 4, y, x + s * 3 / 2, y);
            proc.line(x + s * 3 / 4, y - s * 3 / 2, x - s, y - s);
            proc.line(x + s * 3 / 4, y + s * 3 / 2, x - s, y + s);
            proc.line(x, y - s / 2, x - s, y - s);
            proc.line(x, y + s / 2, x - s, y + s);
            proc.fill(proc.lerpColor(helper.colorSchemes[helper.colorScheme], proc.color(0, 0, 0), proc.floor((proc.frameCount / 10) % 2)));
            proc.ellipse(x + s * 3 / 2, y, s / 2, s / 2);
            proc.fill(0, 0, 0);
        },
        shoot: function (x, y, angle, side, damage) {
            bullets.push({
                x: x,
                y: y,
                angle: angle,
                speed: 2,
                type: 2,
                radius: 4,
                life: 0,
                side: side,
                dead: false,
                damage: damage * 2,
            });
        },
        reload: 65,
    },
    {
        name: 'Oscillator',
        description: 'Shoots bullets that oscillate back and forth.',
        display: function (x, y, s, reload) {
            proc.ellipse(x, y, s, s);
            proc.line(x - s / 2, y, x - s, y - s);
            proc.line(x - s / 2, y, x - s, y + s);
            proc.strokeWeight(s / 8);
            for (var k = 0; k < 5; k++) {
                var d = proc.random(0, s / 2);
                var r = proc.random(0, 360);
                proc.point(x + proc.cos(r) * d, y + proc.sin(r) * d);
            }
            proc.strokeWeight(helper.lineWidth);
        },
        shoot: function (x, y, angle, side, damage) {
            bullets.push({
                x: x,
                y: y,
                angle: angle + proc.random(-10, 10),
                speed: 5,
                type: 3,
                radius: 2.5,
                life: 0,
                side: side,
                dead: false,
                damage: damage,
            });
        },
        reload: 5,
    },
    {
        name: 'Oscillator Prime',
        description: 'Bullets are shot at a higher frequency, but spread more.',
        display: function (x, y, s, reload) {
            helper.hexagon(x, y, proc.frameCount, s);
            proc.line(x, y, x - s, y - s);
            proc.line(x, y, x - s, y + s);
            proc.strokeWeight(s / 8);
            for (var k = 0; k < 5; k++) {
                var d = proc.random(0, s / 2 * proc.sin(proc.frameCount));
                var r = proc.random(0, 360);
                proc.point(x + proc.cos(r) * d, y + proc.sin(r) * d);
            }
            proc.strokeWeight(helper.lineWidth);
        },
        shoot: function (x, y, angle, side, damage) {
            bullets.push({
                x: x,
                y: y,
                angle: angle + proc.random(-75, 75),
                speed: 4,
                type: 3,
                radius: 2.5,
                life: 0,
                side: side,
                dead: false,
                damage: damage * 0.6,
            });
        },
        reload: 3,
    },
    {
        name: 'Spreader',
        description: 'A shotgun of low-damage bullets. Effective up close.',
        display: function (x, y, s, reload) {
            proc.rect(x - s, y - s / 2, s, s);
            proc.quad(x, y - s / 3, x, y + s / 3, x + s / 2 + s / 2 * reload, y + s * 2 / 3, x + s / 2 + s / 2 * reload, y - s * 2 / 3);
        },
        shoot: function (x, y, angle, side, damage) {
            for (var k = 0; k < 10; k++) {
                bullets.push({
                    x: x,
                    y: y,
                    angle: angle + proc.random(-15, 15),
                    speed: 8,
                    type: 1,
                    radius: 2.5,
                    life: 0,
                    side: side,
                    dead: false,
                    damage: damage,
                });
            }
        },
        reload: 50,
    },
    {
        name: 'Spreader Prime',
        description: 'Shoots a spread of bullets, which have varying damage, size, and speed.',
        display: function (x, y, s, reload) {
            helper.hexagon(x - s / 2, y, 30, s * 3 / 2);
            proc.ellipse(x - s / 2, y, s, s);
            proc.quad(x, y - s / 3, x, y + s / 3, x + s / 2 + s / 2 * reload, y + s * 2 / 3, x + s / 2 + s / 2 * reload, y - s * 2 / 3);
        },
        shoot: function (x, y, angle, side, damage) {
            for (var k = 0; k < 18; k++) {
                var m = proc.random(0.6, 1);
                bullets.push({
                    x: x,
                    y: y,
                    angle: angle + proc.random(-15, 15),
                    speed: 8 * m,
                    type: 1,
                    radius: 2.5 * m,
                    life: 0,
                    side: side,
                    dead: false,
                    damage: damage * m,
                });
            }
        },
        reload: 70,
    },
    {
        name: 'Pulse',
        description: 'Shoots wide soundwaves that damage and knock back enemies.',
        display: function (x, y, s, reload) {
            proc.pushMatrix();
            proc.translate(proc.random(-s / 8, s / 8), proc.random(-s / 8, s / 8));
            proc.rect(x - s / 2, y - s, s * 3 / 2, s * 2);
            proc.ellipse(x + s / 4, y, s, s);
            proc.ellipse(x + s / 4, y, s / 2, s / 2);
            proc.popMatrix();
            proc.line(x - s / 2, y, x - s * 2, y);
        },
        shoot: function (x, y, angle, side, damage) {
            for (var k = -15; k <= 15; k += 2) {
                bullets.push({
                    x: x,
                    y: y,
                    angle: angle + k,
                    speed: 4,
                    type: 4,
                    radius: 2.5,
                    life: 0,
                    side: side,
                    dead: false,
                    damage: damage,
                });
            }
        },
        reload: 45,
    },
    {
        name: 'Pulse Prime',
        description: 'Shoots narrower soundwaves that deal more damage and have more knockback.',
        display: function (x, y, s, reload) {
            proc.pushMatrix();
            proc.translate(proc.random(-s / 8, s / 8), proc.random(-s / 8, s / 8));
            proc.rect(x - s / 2, y - s * 2 / 3, s * 3 / 2, s * 4 / 3);
            proc.ellipse(x + s / 4, y, s, s);
            helper.hexagon(x + s / 4, y, proc.frameCount, s / 2);
            proc.popMatrix();
            proc.line(x - s / 2, y - s / 8, x - s * 2, y - s / 8);
            proc.line(x - s / 2, y + s / 8, x - s * 2, y + s / 8);
        },
        shoot: function (x, y, angle, side, damage) {
            for (var k = -6; k <= 6; k += 1) {
                bullets.push({
                    x: x,
                    y: y,
                    angle: angle + k,
                    speed: 5,
                    type: 4,
                    radius: 2.5,
                    life: 0,
                    side: side,
                    dead: false,
                    damage: damage,
                });
            }
        },
        reload: 60,
    },
    {
        name: 'Enclosure',
        description: 'Lays explosive mines that can stack up quite a bit.',
        display: function (x, y, s, reload) {
            proc.rect(x - s, y - s, s, s * 2);
            proc.quad(x, y - s, x + s / 2, y - s - s / 2, x + s / 2, y + s + s / 2, x, y + s);
            proc.arc(x, y, s * 2, s * 2, 90, 90 + 180 * reload);
        },
        shoot: function (x, y, angle, side, damage) {
            bullets.push({
                x: x,
                y: y,
                angle: angle,
                speed: 20,
                type: 5,
                radius: 5,
                life: 0,
                side: side,
                dead: false,
                damage: damage,
            });
        },
        reload: 25,
    },
    {
        name: 'Enclosure Prime',
        description: 'Lower reload in exchange for less launching distance, mine size, and damage.',
        display: function (x, y, s, reload) {
            proc.rect(x - s, y - s / 2, s, s);
            proc.quad(x, y - s / 2, x + s / 2, y - s / 2 - s / 2, x + s / 2, y + s / 2 + s / 2, x, y + s / 2);
            proc.arc(x, y, s, s, 90, 90 + 180 * reload);
            proc.line(x + s / 2, y - s / 2 - s / 2, x - s / 2, y - s / 2);
            proc.line(x + s / 2, y + s / 2 + s / 2, x - s / 2, y + s / 2);
        },
        shoot: function (x, y, angle, side, damage) {
            bullets.push({
                x: x,
                y: y,
                angle: angle + proc.random(-5, 5),
                speed: 15,
                type: 5,
                radius: 3,
                life: 0,
                side: side,
                dead: false,
                damage: damage * 0.8,
            });
        },
        reload: 12,
    },
    {
        name: 'Freeze',
        description: 'Low damage spray that stops enemies in their tracks, making them easier to hit.',
        display: function (x, y, s, reload) {
            proc.rect(x - s * 2, y - s / 2, s * 2, s);
            proc.quad(x, y - s / 2, x + s / 2, y - s, x + s / 2, y + s, x, y + s / 2);
            for (var k = 0; k < 3; k++) {
                proc.line(x - s + proc.cos(k * 120 + reload * 60) * s / 3, y + proc.sin(k * 120 + reload * 60) * s / 3, x - s + proc.cos(k * 120 + 180 + reload * 60) * s / 3, y + proc.sin(k * 120 + 180 + reload * 60) * s / 3);
            }
        },
        shoot: function (x, y, angle, side, damage) {
            for (var k = 0; k < 2; k++) {
                bullets.push({
                    x: x,
                    y: y,
                    angle: angle + proc.random(-30, 30),
                    speed: 2.5,
                    type: 6,
                    radius: 2,
                    life: 0,
                    side: side,
                    dead: false,
                    damage: damage,
                });
            }
        },
        reload: 5,
    },
    {
        name: 'Freeze Prime',
        description: 'Sprays icy bullets in an extremely wide arc, freezing enemies. Does no damage.',
        display: function (x, y, s, reload) {
            proc.rect(x - s * 2, y - s / 2, s * 2, s);
            proc.arc(x - s / 2, y, s * 2, s * 2, -90, 90);
            proc.line(x - s / 2, y - s, x - s / 2, y + s);
            helper.hexagon(x - s * 3 / 2, y, proc.frameCount, s / 2);
            proc.line(x + s / 2, y, x - s / 2, y);
        },
        shoot: function (x, y, angle, side, damage) {
            for (var k = 0; k < 4; k++) {
                bullets.push({
                    x: x,
                    y: y,
                    angle: angle + proc.random(-90, 90),
                    speed: 4,
                    type: 6,
                    radius: 1,
                    life: 0,
                    side: side,
                    dead: false,
                    damage: 0,
                });
            }
        },
        reload: 1,
    },
    {
        name: 'Barrier',
        description: 'A force field that damages any that enter.',
        display: function (x, y, s, reload) {
            helper.hexagon(x - s, y, proc.frameCount * 5, s * 3 / 2);
            helper.hexagon(x - s, y, proc.frameCount * 5, s * 5 / 4);
            proc.ellipse(x - s, y, s / 2, s / 2);
        },
        shoot: function (x, y, angle, side, damage) {
            bullets.push({
                x: x,
                y: y,
                angle: 0,
                speed: 0,
                type: 8,
                radius: 110,
                life: 0,
                side: side,
                dead: false,
                damage: damage,
            });
        },
        reload: 40,
    },
    {
        name: 'Barrier Prime',
        description: 'A smaller force field that rapidly drains health.',
        display: function (x, y, s, reload) {
            helper.hexagon(x - s, y, -proc.frameCount * 5, s * 3 / 2);
            helper.hexagon(x - s, y, proc.frameCount * 5, s * 5 / 4);
            proc.ellipse(x - s, y, s / 2, s / 2);
            proc.ellipse(x - s, y, s, s);
        },
        shoot: function (x, y, angle, side, damage) {
            bullets.push({
                x: x,
                y: y,
                angle: 0,
                speed: 0,
                type: 8,
                radius: 60,
                life: 0,
                side: side,
                dead: false,
                damage: damage,
            });
        },
        reload: 20,
    },
    {

        name: 'Mortar',
        description: 'Shoots speedy, high-damage and explosive bullets.',
        display: function (x, y, s, reload) {
            proc.rect(x - s / 8, y - s / 2, s / 2 + s / 2 * reload, s);
            proc.strokeWeight(2);
            helper.hexagon(x - s * 3 / 4, y, 30, s * 3 / 2);
            proc.strokeWeight(helper.lineWidth);
            proc.line(x - s / 8 + s, y - s / 2, x - s, y - s);
            proc.line(x - s / 8 + s, y + s / 2, x - s, y + s);
        },
        shoot: function (x, y, angle, side, damage) {
            bullets.push({
                x: x,
                y: y,
                angle: angle,
                speed: 7.5,
                type: 9,
                radius: 10,
                life: 0,
                side: side,
                dead: false,
                damage: damage,
            });
        },
        reload: 35,
    },
    {

        name: 'Mortar Prime',
        description: 'Lowered fire rate. Shoots two smaller bullets consecutively.',
        display: function (x, y, s, reload) {
            proc.rect(x - s / 8, y - s / 2, s / 2 + s / 2 * reload, s);
            proc.rect(x - s / 8, y - s / 2, s / 2 + s / 2 * (1 - reload), s);
            proc.strokeWeight(2);
            helper.hexagon(x - s, y, 30, s * 3 / 2);
            helper.hexagon(x - s, y, 0, s * 3 / 2);
            proc.strokeWeight(helper.lineWidth);
            proc.line(x - s / 8 + s, y - s / 2, x - s, y - s);
            proc.line(x - s / 8 + s, y + s / 2, x - s, y + s);
        },
        shoot: function (x, y, angle, side, damage) {
            bullets.push({
                x: x - proc.cos(angle) * 12.5,
                y: y - proc.sin(angle) * 12.5,
                angle: angle,
                speed: 7.5,
                type: 9,
                radius: 5,
                life: 0,
                side: side,
                dead: false,
                damage: damage * 2 / 3,
            });
            bullets.push({
                x: x + proc.cos(angle) * 12.5,
                y: y + proc.sin(angle) * 12.5,
                angle: angle,
                speed: 7.5,
                type: 9,
                radius: 5,
                life: 0,
                side: side,
                dead: false,
                damage: damage * 2 / 3,
            });
        },
        reload: 45,
    },
    {
        name: 'Octo',
        description: 'Shoots bullets in 8 directions at a low frequency. More damage, but less concentrated.',
        display: function (x, y, s, reload) {
            for (var r = 0; r < 8; r++) {
                proc.pushMatrix();
                proc.translate(x - s, y);
                proc.rotate(r / 8 * 360);
                proc.translate(-x + s, -y);
                proc.rect(x - s / 8, y - s / 2, s / 2 + s / 2 * reload, s);
                proc.popMatrix();
            }
        },
        shoot: function (x, y, angle, side, damage) {
            for (var r = 0; r < 8; r++) {
                bullets.push({
                    x: x,
                    y: y,
                    angle: angle + r / 8 * 360,
                    speed: 4,
                    type: 0,
                    radius: 5,
                    life: 0,
                    side: side,
                    dead: false,
                    damage: damage,
                });
            }
        },
        reload: 90,
    },
    {
        name: 'Octo Prime',
        description: 'Shoots an expanding circle of smaller bullets.',
        display: function (x, y, s, reload) {
            for (var r = 0; r < 20; r++) {
                proc.pushMatrix();
                proc.translate(x - s, y);
                proc.rotate(r / 20 * 360);
                proc.translate(-x + s, -y);
                proc.rect(x - s / 8, y - s / 4, s / 2 + s / 2 * reload, s / 2);
                proc.popMatrix();
            }
        },
        shoot: function (x, y, angle, side, damage) {
            for (var r = 0; r < 20; r++) {
                bullets.push({
                    x: x,
                    y: y,
                    angle: angle + r / 20 * 360,
                    speed: 5,
                    type: 1,
                    radius: 2.5,
                    life: 0,
                    side: side,
                    dead: false,
                    damage: damage,
                });
            }
        },
        reload: 100,
    },
    {
        name: 'Creator',
        description: 'Spawns tiny weak drones that shoot Mono bullets. Health increases with level.',
        display: function (x, y, s, reload) {
            proc.rect(x + s / 2, y - s / 2, s / 2, s);
            proc.line(x - s, y - s, x + s / 2, y - s / 2);
            proc.line(x - s, y + s, x + s / 2, y + s / 2);
            proc.line(x - s, y - s, x - s, y + s);
            proc.rect(x - s + s * 3 / 2 * reload, y - s + s / 2 * reload, s / 2, s * 2 - s * reload);
            proc.line(x - s, y - s, x - s + s * 3 / 2 * reload + s / 2, y - s + s / 2 * reload);
            proc.line(x - s, y + s, x - s + s * 3 / 2 * reload + s / 2, y + s - s / 2 * reload);
        },
        shoot: function (x, y, angle, side, damage) {
            if (side === 'Good') {
                smallDroneCount++;
            }
            players.push({
                weapon: 2,
                angle: side === 'Good' ? 180 + angle : angle,
                distance: side === 'Good' ? proc.dist(x, y, 0, 0) + 25 : proc.dist(x, y, 0, 0) - 25,
                radius: 7.5,
                movement: side === 'Good' ? 'Drone' : 'Standard',
                movementSpeed: 2,
                health: side === 'Good' ? damage * 50 : helper.difficulty / 4,
                maxHealth: side === 'Good' ? damage * 50 : helper.difficulty / 4,
                healthRegen: -0.2,
                reload: 0,
                side: side,
                dead: false,
                bodyDamage: 0,
                hoverDistance: 50,
                reviveTime: 0,
                maxReviveTime: 0,
            });
        },
        reload: 100,
    },
    {
        name: 'Creator Prime',
        description: 'Spawns small drones with barriers at a lower fire rate. Health increases with level.',
        display: function (x, y, s, reload) {
            proc.rect(x - s + s * 3 / 2 * reload, y - s + s / 2 * reload, s / 2, s * 2 - s * reload);
            proc.line(x - s, y - s, x - s + s * 3 / 2 * reload + s / 2, y - s + s / 2 * reload);
            proc.line(x - s, y + s, x - s + s * 3 / 2 * reload + s / 2, y + s - s / 2 * reload);
            proc.rect(x - s + s * 3 / 2 * (1 - reload), y - s + s / 2 * (1 - reload), s / 2, s * 2 - s * (1 - reload));
            proc.line(x - s, y - s, x - s + s * 3 / 2 * (1 - reload) + s / 2, y - s + s / 2 * (1 - reload));
            proc.line(x - s, y + s, x - s + s * 3 / 2 * (1 - reload) + s / 2, y + s - s / 2 * (1 - reload));
        },
        shoot: function (x, y, angle, side, damage) {
            if (side === 'Good') {
                smallDroneCount++;
            }
            players.push({
                weapon: 20,
                angle: side === 'Good' ? 180 + angle : angle,
                distance: side === 'Good' ? proc.dist(x, y, 0, 0) + 25 : proc.dist(x, y, 0, 0) - 25,
                radius: 7.5,
                movement: side === 'Good' ? 'Drone' : 'Standard',
                movementSpeed: 2,
                health: side === 'Good' ? damage * 75 : helper.difficulty * 3 / 8,
                maxHealth: side === 'Good' ? damage * 75 : helper.difficulty * 3 / 8,
                healthRegen: -0.2,
                reload: 0,
                side: side,
                dead: false,
                bodyDamage: 0,
                hoverDistance: 25,
                reviveTime: 0,
                maxReviveTime: 0,
            });
        },
        reload: 120,
    },
    {
        name: 'Furnace',
        description: 'Your classic flamethrower tank. It creates a high damage spray of flames close up.',
        display: function (x, y, s, reload) {
            proc.ellipse(x - s * 2, y - s / 2, s, s);
            proc.ellipse(x - s * 2, y + s / 2, s, s);
            proc.line(x - s * 2 - s / 2, y - s / 2, x - s * 2 - s / 2, y + s / 2);
            proc.line(x - s * 2 + s / 2, y - s / 2, x - s * 2 + s / 2, y + s / 2);
            proc.noFill();
            proc.arc(x - s, y, s * 5 / 2, s * 5 / 2, 230, 345);
            proc.arc(x - s, y, s * 2.75, s * 2.75, 225, 346);
            proc.fill(0, 0, 0);
            proc.rect(x - s / 16, y - s / 3, s / 2, s * 2 / 3);
            proc.quad(x - s / 16 + s / 2, y - s / 3, x - s / 16 + s / 2, y + s / 3, x - s / 16 + s, y + s / 2, x - s / 16 + s, y - s / 2);
            proc.rect(x - s / 16 + s / 2, y - s / 6, s / 2, s / 3);
        },
        shoot: function (x, y, angle, side, damage) {
            bullets.push({
                x: x,
                y: y,
                angle: angle + proc.random(-5, 5),
                speed: 4,
                type: 10,
                radius: 2.5,
                life: 0,
                side: side,
                dead: false,
                damage: damage,
            });
        },
        reload: 2,
    },
    {
        name: 'Furnace Prime',
        description: 'Shoots larger flames that deal more damage.',
        display: function (x, y, s, reload) {
            helper.hexagon(x - s * 2, y - s / 2, 30, s);
            helper.hexagon(x - s * 2, y + s / 2, 30, s);
            proc.line(x - s * 2 - s / 2, y - s / 2, x - s * 2 - s / 2, y + s / 2);
            proc.line(x - s * 2 + s / 2, y - s / 2, x - s * 2 + s / 2, y + s / 2);
            proc.noFill();
            proc.arc(x - s, y, s * 5 / 2, s * 5 / 2, 230, 345);
            proc.arc(x - s, y, s * 2.75, s * 2.75, 225, 346);
            proc.fill(0, 0, 0);
            proc.rect(x - s / 8, y - s / 2, s / 2, s);
            proc.quad(x - s / 8 + s / 2, y - s / 2, x - s / 8 + s / 2, y + s / 2, x - s / 16 + s, y + s * 2 / 3, x - s / 16 + s, y - s * 2 / 3);
            proc.rect(x - s / 8 + s / 2, y - s / 4, s / 2, s / 2);
        },
        shoot: function (x, y, angle, side, damage) {
            bullets.push({
                x: x,
                y: y,
                angle: angle + proc.random(-10, 10),
                speed: 4,
                type: 10,
                radius: 7.5,
                life: 0,
                side: side,
                dead: false,
                damage: damage * 4,
            });
        },
        reload: 8,
    },
    {
        name: 'Shrapnel',
        description: 'Damaging cannonball that explodes into smaller bullets after hitting an enemy.',
        display: function (x, y, s, reload) {
            proc.fill(0, 0, 0);
            proc.rect(x, y - s / 2, s, s);
            // You lost the game!
            proc.rect(x - s / 2, y - s * 2 / 3, s / 2, s * 4 / 3);
            proc.line(x + s / 2, y - s / 2, x, y - s * 2 / 3);
            proc.line(x + s / 2, y + s / 2, x, y + s * 2 / 3);
            proc.ellipse(x + s / 2, y, s * reload, s);
            proc.line(x + s, y - s / 2, x, y - s * 2 / 3);
            proc.line(x + s, y + s / 2, x, y + s * 2 / 3);
            proc.noFill();
        },
        shoot: function (x, y, angle, side, damage) {
            bullets.push({
                x: x,
                y: y,
                angle: angle,
                speed: 6,
                type: 11,
                radius: 7.5,
                life: 0,
                side: side,
                dead: false,
                damage: damage,
            });
        },
        reload: 50,
    },
    {
        name: 'Shrapnel Prime',
        description: 'Smaller cannonballs shot in all directions.',
        display: function (x, y, s, reload) {
            proc.fill(0, 0, 0);
            for (var r = 0; r < 360; r += 45) {
                proc.pushMatrix();
                proc.translate(x - s, y);
                proc.rotate(r);
                proc.translate(-x + s, -y);
                proc.rect(x, y - s / 3, s, s * 2 / 3);
                proc.line(x + s / 2, y - s / 3, x, y - s / 2);
                proc.line(x + s / 2, y + s / 3, x, y + s / 2);
                proc.ellipse(x + s / 2, y, s * reload * 2 / 3, s * 2 / 3);
                proc.line(x + s, y - s / 3, x, y - s / 2);
                proc.line(x + s, y + s / 3, x, y + s / 2);
                proc.popMatrix();
            }
            proc.noFill();
        },
        shoot: function (x, y, angle, side, damage) {
            for (var k = 0; k < 360; k += 45) {
                bullets.push({
                    x: x,
                    y: y,
                    angle: angle + k,
                    speed: 6,
                    type: 11,
                    radius: 5,
                    life: 0,
                    side: side,
                    dead: false,
                    damage: damage / 6,
                });
            }
        },
        reload: 75,
    },
    {
        name: 'Railgun',
        description: 'Propels a ball of plasma that shoots through enemies.',
        display: function (x, y, s, reload) {
            proc.fill(0, 0, 0);
            proc.rect(x - s / 2, y - s / 4, s * 3 / 2, s / 8);
            proc.rect(x - s / 2, y + s / 8, s * 3 / 2, s / 8);
            proc.rect(x - s, y - s / 2, s / 2, s);
            proc.rect(x - s * 2, y - s * 2 / 3, s, s * 4 / 3);
            proc.ellipse(x - s * 3 / 2, y, s * reload, s * reload);
            proc.noFill();
        },
        shoot: function (x, y, angle, side, damage) {
            bullets.push({
                x: x,
                y: y,
                angle: angle,
                speed: 10,
                type: 12,
                radius: 7.5,
                life: 0,
                side: side,
                dead: false,
                damage: damage,
            });
        },
        reload: 20,
    },
    {
        name: 'Railgun Prime',
        description: 'Summons a plasma sword with high damage.',
        display: function (x, y, s, reload) {
            proc.fill(0, 0, 0);
            proc.rect(x - s / 2, y - s / 3, s * 3 / 2, s / 6);
            proc.rect(x - s / 2, y + s / 6, s * 3 / 2, s / 6);
            proc.rect(x - s, y - s / 3, s / 2, s * 2 / 3);
            proc.rect(x - s * 2, y - s * 2 / 3, s, s * 4 / 3);
            helper.hexagon(x - s * 3 / 2, y, proc.frameCount, s * reload);
            proc.noFill();
        },
        shoot: function (x, y, angle, side, damage) {
            for (var k = 3; k < 25; k += 2) {
                bullets.push({
                    x: x + proc.cos(angle) * k * 5,
                    y: y + proc.sin(angle) * k * 5,
                    angle: angle,
                    speed: 0,
                    type: 12,
                    radius: 7.5,
                    life: 38,
                    side: side,
                    dead: false,
                    damage: damage * (side === 'Good' ? (1 / 20) : (1 / 200)),
                });
            }
        },
        reload: 1,
    },
    {
        name: 'Vacuum',
        description: 'Creates slow, intangible spheres of dark matter that damage enemies in them.',
        display: function (x, y, s, reload) {
            proc.fill(0, 0, 0);
            proc.stroke(helper.colorSchemes[helper.colorScheme]);
            proc.ellipse(x - s / 2, y, s, s);
            proc.ellipse(x, y - s, s, s);
            proc.ellipse(x, y + s, s, s);
            proc.ellipse(x - s, y - s, s, s);
            proc.ellipse(x - s, y + s, s, s);
            proc.ellipse(x - s * 2, y, s * 3 / 2 * reload, s * 3 / 2 * reload);
            proc.rect(x - s / 4, y - s / 2, s * 3 / 2, s);
            proc.rect(x - s / 2, y - s / 2, s * reload, s);
            proc.noFill();
        },
        shoot: function (x, y, angle, side, damage) {
            bullets.push({
                x: x,
                y: y,
                angle: angle,
                speed: 1,
                type: 13,
                radius: 25,
                life: 0,
                side: side,
                dead: false,
                damage: damage,
            });
        },
        reload: 50,
    },
    {
        name: 'Vacuum Prime',
        description: 'Creates larger spheres that do more damage at a lower frequency.',
        display: function (x, y, s, reload) {
            proc.fill(0, 0, 0);
            proc.stroke(helper.colorSchemes[helper.colorScheme]);
            helper.hexagon(x - s, y, proc.frameCount, s * 2);
            proc.ellipse(x, y - s, s, s);
            proc.ellipse(x, y + s, s, s);
            proc.ellipse(x - s * 2, y - s, s, s);
            proc.ellipse(x - s * 2, y + s, s, s);
            proc.rect(x - s / 4, y - s / 2, s * 3 / 2, s);
            proc.rect(x - s / 4, y - s / 3, s * reload, s * 2 / 3);
            proc.noFill();
        },
        shoot: function (x, y, angle, side, damage) {
            bullets.push({
                x: x,
                y: y,
                angle: angle,
                speed: 1,
                type: 13,
                radius: 35,
                life: 0,
                side: side,
                dead: false,
                damage: damage * 1.5,
            });
        },
        reload: 100,
    },
    {
        name: 'Crossbow',
        description: 'Launches high-damage arrows at a low fire rate.',
        display: function (x, y, s, reload) {
            var bowTip = [y - s * 3 / 2 - reload * s / 2, y + s * 3 / 2 + reload * s / 2];
            proc.noFill();
            proc.stroke(helper.colorSchemes[helper.colorScheme]);
            proc.arc(x - s, y, s * 3, s * 3 + reload * s, -90, 90);
            proc.line(x - s, bowTip[0], x - s, bowTip[1]);
            proc.rect(x - s / 4, y - s, s / 2, s * 2);
            helper.hexagon(x - s * 2, y, proc.frameCount, s);
            proc.triangle(x - s * 2, y, x - s, bowTip[0], x - s, bowTip[1]);
        },
        shoot: function (x, y, angle, side, damage) {
            bullets.push({
                x: x,
                y: y,
                angle: angle,
                speed: 15,
                type: 14,
                radius: 10,
                life: 0,
                side: side,
                dead: false,
                damage: damage,
            });
        },
        reload: 30,
    },
    {
        name: 'Crossbow Prime',
        description: 'Shoots arrows with fireworks attacked to them that explode.',
        display: function (x, y, s, reload) {
            var bowTip = [y - s * 3 / 2 - reload * s / 2, y + s * 3 / 2 + reload * s / 2];
            proc.noFill();
            proc.stroke(helper.colorSchemes[helper.colorScheme]);
            proc.arc(x - s, y, s * 2, s * 3 + reload * s, -90, 90);
            proc.rect(x - s / 2, y - s, s / 2, s * 2);
            helper.hexagon(x - s * 2, y, proc.frameCount, s * 3 / 2);
            proc.triangle(x - s * 2, y, x - s, bowTip[0], x - s, bowTip[1]);
        },
        shoot: function (x, y, angle, side, damage) {
            bullets.push({
                x: x,
                y: y,
                angle: angle,
                speed: 15,
                type: 15,
                radius: 10,
                life: 0,
                side: side,
                dead: false,
                damage: damage,
            });
        },
        reload: 40,
    },
    ];

}