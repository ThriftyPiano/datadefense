function sketchProc(proc) {

    processingJS = proc;
    var canvas = document.getElementById('div');
    var sz = proc.min(canvas.clientWidth - 4, canvas.clientHeight - 4);
    proc.size(sz - 4, sz - 4);
    proc.angleMode = "degrees";

    ////////////
    // Paste your save code here. Remember to load your save (in the saving page).
    var saveCode = eval(localStorage.getItem('Data Defense Save Code')) || [];

    // Code {
    // Screen size adaptation {
    var fakeWidth = 600;
    var fakeHeight = 600;
    var xScale = fakeWidth / proc.width;
    var yScale = fakeHeight / proc.height;
    var scaleScreen = function () {
        proc.pushMatrix();
        proc.scale(1 / xScale, 1 / yScale);
    };
    // }
    // Misc {
    var paused = false;
    var furthestWave = 0;
    var timeElapsed = proc.millis();
    var mouseClicks = 0;
    (function () {
        this.$("body").css("overflow", "hidden");
    })();
    proc.frameRate(58);
    proc.smooth();
    var dev = false;
    
    var showBackgrounds = true;
    var keys = {};
    proc.textFont(proc.createFont('monospace'));
    var triangulized = false;
    // Helper functions
    var helper = helperFn(proc, xScale, yScale);
    var randomCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    var hackerText = function (txt, x, y) {
        var newText = '';
        for (var i = 0; i < txt.length; i++) {
            if (proc.sin(proc.frameCount) + 1 > 1 - i / txt.length) {
                newText += txt[i];
            } else {
                newText += randomCharacters[proc.floor(proc.random(randomCharacters.length))];
            }
        }
        proc.text(newText, x, y);
    };
    var upgradeCost = function (level) {
        return proc.pow(10, proc.floor(level / 2) + 1) * (2 - (level + 1) % 2) / 2;
    };
    var smallDroneCount = 0;
    var scene = 'Warning';
    // }
    // Variables and Arrays {
    var unlockedWeapons = {};
    var unlockedDrones = {};
    var unlockedViruses = [];
    var achievementsEarned = [];
    var graphicsQuality = 'High';
    var weaponImageScale = 6.5;
    var weaponImageRes = 20;
    var bulletImageScale = 4;
    var bulletImageRes = 10;
    var infected = false;
    var bullets = [];
    var players = [];
    var buttons = [];
    var fakeBits = [];
    var hPlayer = {};
    var equippedDrones = [];
    var notifs = [];
    var bitsPerClick = 0;
    var maxDroneCount = 1;
    
    var gunsUnlocked = 2;
    var dronesUnlocked = 0;
    var ascensions = 0;
    var redification = 0;
    var startRedification = false;
    var damageCoef = 1;
    // }
    // UI {
    // Backgrounds {
    var colors = [{
        name: 'Crypto',
        col: proc.color(100, 255, 0),
    },
    {
        name: 'Tide',
        col: proc.color(100, 200, 255),
    },
    {
        name: 'Jungle',
        col: proc.color(50, 200, 100),
    },
    {
        name: 'Sky',
        col: proc.color(200, 255, 255),
    },
    {
        name: 'Monochrome',
        col: proc.color(255, 255, 255),
    },
    {
        name: 'Fortune',
        col: proc.color(255, 215, 0),
    },
    {
        name: 'Inferno',
        col: proc.color(255, 120, 0),
    },
    {
        name: 'Plasma',
        col: proc.color(0, 255, 255),
    },
    {
        name: 'Blackout',
        col: proc.color(100, 100, 100),
    },
    {
        name: 'Street light',
        col: proc.color(255, 255, 100),
    },
    {
        name: 'Depths',
        col: proc.color(0, 0, 255),
    },
    {
        name: 'Atnegam',
        col: proc.color(255, 0, 255),
    },
    {
        name: 'Noir',
        col: proc.color(50, 50, 100),
    },
    {
        name: 'Royalty',
        col: proc.color(150, 0, 255),
    },
    {
        name: 'Beach',
        col: proc.color(212, 169, 140),
    },
    ];
    //
    var drawGameBackground = function () {
        proc.background(0, 0, 0);
        proc.textSize(40);
        proc.textAlign(proc.CENTER, proc.CENTER);
        for (var x = -40; x <= fakeWidth + 40; x += 40) {
            for (var y = -40; y <= fakeHeight + 40; y += 40) {
                proc.fill(helper.colorSchemes[helper.colorScheme], 100);
                if (proc.random(1) <= proc.sqrt(players[0].health / players[0].maxHealth)) {
                    proc.text(proc.round(proc.noise(x / 10, y / 10, proc.frameCount / 100)), x, y);
                } else {
                    proc.fill(255, 0, 0, 100);
                    proc.text(2, x, y);
                }
            }
        }
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
        proc.fill(0, 0, 0);
        proc.ellipse(fakeWidth / 2, fakeHeight / 2, fakeWidth / 8, fakeWidth / 8);
        helper.hexagon(fakeWidth / 2, fakeHeight / 2, proc.frameCount, fakeWidth / 8);
        helper.hexagon(fakeWidth / 2, fakeHeight / 2, -proc.frameCount, fakeWidth / 8);
        proc.noFill();
    };
    var drawMenuBackground = function () {
        proc.background(0, 0, 0);
        proc.strokeWeight(helper.lineWidth);
        proc.stroke(helper.colorSchemes[helper.colorScheme], 150);
        var hexagonSize = 75;
        for (var i = 0; i <= fakeWidth; i += hexagonSize) {
            for (var j = i % (2 * hexagonSize) === 0 ? 0 : -hexagonSize * proc.sqrt(3); j <= fakeHeight + hexagonSize * proc.sqrt(3); j += hexagonSize * 2 / proc.sqrt(3)) {
                helper.hexagon(i, j, proc.sin(proc.frameCount) * 60, hexagonSize);
            }
        }
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
    };
    var drawShopBackground = function () {
        proc.background(0, 0, 0);
        proc.stroke(helper.colorSchemes[helper.colorScheme], 150);
        helper.hexagon(fakeWidth / 2, fakeHeight / 2, proc.frameCount, fakeWidth);
        helper.hexagon(fakeWidth / 2, fakeHeight / 2, -proc.frameCount, fakeWidth * proc.sqrt(3) / 2);
        helper.hexagon(fakeWidth / 2, fakeHeight / 2, proc.frameCount, fakeWidth * 3 / 4);
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
    };
    var drawGunSelectBackground = function () {
        proc.background(0, 0, 0);
        proc.stroke(helper.colorSchemes[helper.colorScheme], 150);
        for (var i = 0; i <= fakeWidth; i += 100) {
            helper.hexagon(i, fakeHeight / 2 + proc.sin(proc.frameCount + 180 * i / fakeWidth) * fakeWidth / 2, 360 * proc.sin(proc.frameCount + 180 * i / fakeWidth), 100);
            helper.hexagon(i, fakeHeight / 2 - proc.sin(proc.frameCount + 180 * i / fakeWidth) * fakeWidth / 2, -360 * proc.sin(proc.frameCount + 180 * i / fakeWidth), 100);
        }
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
    };
    var drawColorSelectBackground = function () {
        proc.background(0, 0, 0);
        proc.stroke(helper.colorSchemes[helper.colorScheme], 150);
        helper.hexagon(fakeWidth / 6, fakeHeight / 6, proc.frameCount, fakeWidth / 4);
        helper.hexagon(fakeWidth - fakeWidth / 6, fakeHeight / 6, proc.frameCount, fakeWidth / 4);
        helper.hexagon(fakeWidth / 6, fakeHeight - fakeHeight / 6, proc.frameCount, fakeWidth / 4);
        helper.hexagon(fakeWidth - fakeWidth / 6, fakeHeight - fakeHeight / 6, proc.frameCount, fakeWidth / 4);
        helper.hexagon(fakeWidth / 2, fakeHeight / 2, proc.frameCount, fakeWidth / 2);
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
    };
    var drawPlayerUpgradeBackground = function () {
        proc.background(0, 0, 0);
        proc.stroke(helper.colorSchemes[helper.colorScheme], 150);
        for (var i = -proc.frameCount % 100; i <= fakeWidth + 100; i += 100) {
            for (var j = 0; j <= fakeHeight; j += 100) {
                helper.hexagon(i, j, proc.frameCount, 100);
            }
        }
    };
    var drawCreditsBackground = function () {
        proc.background(0, 0, 0);
        proc.stroke(helper.colorSchemes[helper.colorScheme], 150);
        for (var i = 0; i < 360; i += 60) {
            helper.hexagon(proc.cos(i + proc.frameCount) * fakeWidth / 4 + fakeWidth / 2, proc.sin(i + proc.frameCount) * fakeHeight / 4 + fakeHeight / 2, i + proc.frameCount, 100);
            helper.hexagon(proc.cos(i - proc.frameCount) * fakeWidth / 4 + fakeWidth / 2, proc.sin(i - proc.frameCount) * fakeHeight / 4 + fakeHeight / 2, i + proc.frameCount, 100);
        }
        helper.hexagon(fakeWidth / 2, fakeHeight / 2, proc.frameCount, 200);
        helper.hexagon(fakeWidth / 2, fakeHeight / 2, -proc.frameCount, 200);
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
    };
    var drawChestBackground = function () {
        proc.background(0, 0, 0);
        proc.stroke(helper.colorSchemes[helper.colorScheme], 150);
        for (var k = 75; k < fakeWidth; k += 75) {
            helper.hexagon(fakeWidth / 2, fakeHeight / 2, proc.sin(proc.frameCount + 360 * k / fakeWidth / 2) * 60, k * 2);
            helper.hexagon(fakeWidth / 2, fakeHeight / 2, -proc.cos(proc.frameCount + 360 * k / fakeWidth / 2) * 60, k * 2);
        }
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
    };
    var drawDisplayChestBackground = function () {
        proc.background(0, 0, 0);
        proc.stroke(helper.colorSchemes[helper.colorScheme], 150);
        for (var k = 75; k < fakeWidth; k += 75) {
            helper.hexagon(fakeWidth / 2, fakeHeight / 2, proc.frameCount, k * 2 * (1 + proc.sin(proc.frameCount + 360 * k / fakeWidth / 2)));
        }
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
    };
    var drawStoryBackground = function () {
        proc.background(0, 0, 0);
        proc.stroke(helper.colorSchemes[helper.colorScheme], 150);
        helper.hexagon(fakeWidth / 2, fakeHeight / 2, proc.frameCount, fakeWidth);
        for (var i = 0; i < 360; i += 60) {
            helper.hexagon(fakeWidth / 2 + fakeWidth / 4 * proc.cos(i), fakeHeight / 2 + fakeHeight / 4 * proc.sin(i), proc.frameCount, fakeWidth / 2);
        }
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
    };
    var drawDroneSelectBackground = function () {
        proc.background(0, 0, 0);
        proc.stroke(helper.colorSchemes[helper.colorScheme], 150);
        for (var i = 0; i <= fakeWidth; i += 100) {
            for (var j = 0; j <= fakeHeight; j += 100) {
                helper.hexagon(i, j + 1 / proc.cos(proc.frameCount + i), proc.frameCount, 100);
            }
        }
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
    };
    var drawDroneWeaponSelectBackground = function () {
        proc.background(0, 0, 0);
        for (var i = -proc.frameCount % 50; i <= fakeWidth - proc.frameCount % 50; i += 50) {
            helper.hexagon(i, proc.sin(i - proc.frameCount / 2) * fakeHeight / 2 + fakeHeight / 2, proc.frameCount, 50);
            helper.hexagon(i, -proc.sin(i - proc.frameCount / 2) * fakeHeight / 2 + fakeHeight / 2, proc.frameCount, 50);
        }
    };
    var drawAscendBackground = function () {
        proc.background(0, 0, 0);
        proc.stroke(helper.colorSchemes[helper.colorScheme], 150);
        for (var i = 0; i <= fakeWidth; i += 50) {
            helper.hexagon(i, ((fakeHeight / 4 + i) + proc.frameCount * 4) % fakeHeight, proc.frameCount, 50);
            helper.hexagon(i, ((fakeHeight / 2 + i) + proc.frameCount * 4) % fakeHeight, proc.frameCount, 50);
            helper.hexagon(i, ((fakeHeight * 3 / 4 + i) + proc.frameCount * 4) % fakeHeight, proc.frameCount, 50);
            helper.hexagon(i, ((fakeHeight + i) + proc.frameCount * 4) % fakeHeight, proc.frameCount, 50);
        }
    };
    var drawAscendUpgradesBackground = function () {
        proc.background(0, 0, 0);
        proc.stroke(helper.colorSchemes[helper.colorScheme], 150);
        for (var i = 0; i <= fakeWidth; i += 75) {
            helper.hexagon(i, ((fakeHeight / 4 + i) + proc.frameCount * 4) % fakeHeight, proc.frameCount, 75);
            helper.hexagon(i, ((fakeHeight / 2 + i) + proc.frameCount * 4) % fakeHeight, proc.frameCount, 75);
            helper.hexagon(i, ((fakeHeight * 3 / 4 + i) + proc.frameCount * 4) % fakeHeight, proc.frameCount, 75);
            helper.hexagon(i, ((fakeHeight + i) + proc.frameCount * 4) % fakeHeight, proc.frameCount, 75);
        }
    };
    var drawVirusBackground = function () {
        proc.background(0, 0, 0);
        proc.stroke(255, 0, 0, 150);
        for (var i = 0; i <= fakeWidth; i += 75) {
            helper.hexagon(i, (fakeHeight / 4 + i) % fakeHeight, proc.frameCount, 75 * proc.sin(proc.frameCount));
            helper.hexagon(i, (fakeHeight / 2 + i) % fakeHeight, proc.frameCount, 75 * proc.sin(proc.frameCount));
            helper.hexagon(i, (fakeHeight * 3 / 4 + i) % fakeHeight, proc.frameCount, 75 * proc.sin(proc.frameCount));
            helper.hexagon(i, (fakeHeight + i) % fakeHeight, proc.frameCount, 75 * proc.sin(proc.frameCount));
        }
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
    };
    var drawWarningBackground = function () {
        proc.background(0, 0, 0);
        proc.stroke(255, 0, 0, 150);
        helper.hexagon(fakeWidth / 2, fakeHeight / 2, proc.frameCount, fakeWidth * 3 / 4);
        helper.hexagon(fakeWidth / 2, fakeHeight / 2, proc.frameCount, fakeWidth * 5 / 8);
        helper.hexagon(fakeWidth / 2, fakeHeight / 2, proc.frameCount, fakeWidth / 2);
        helper.hexagon(fakeWidth / 2, fakeHeight / 2, proc.frameCount, fakeWidth / 4);
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
    };
    var drawPowersBackground = function () {
        proc.background(0, 0, 0);
        proc.stroke(helper.colorSchemes[helper.colorScheme], 150);
        for (var i = 0; i <= fakeWidth; i += 100) {
            for (var j = 0; j <= fakeHeight; j += 100) {
                var noiseVal = proc.noise(i / 100, j / 100, proc.frameCount / 200);
                if (noiseVal > 0.5) {
                    helper.hexagon(i, j, noiseVal * 360, 100);
                }
            }
        }
    };
    var drawSecretMarketBackground = function () {
        proc.background(0, 0, 0);
        proc.noStroke();
        proc.fill(helper.colorSchemes[helper.colorScheme], 50 * proc.abs(proc.sin(proc.frameCount)));
        proc.rect(0, 0, fakeWidth, fakeHeight);
        proc.noFill();
    };
    var drawAwardsBackground = function () {
        proc.background(0, 0, 0);
        proc.stroke(helper.colorSchemes[helper.colorScheme], 150);
        for (var i = 0; i <= fakeWidth; i += 75) {
            for (var j = 0; j <= fakeHeight; j += 75) {
                var noiseVal = proc.noise(i / 100, j / 100, proc.frameCount / 200);
                if (noiseVal > 0.5) {
                    helper.hexagon(i, j, noiseVal * 360, 75);
                }
            }
        }
    };
    var drawInfoBackground = function () {
        proc.background(0, 0, 0);
        proc.stroke(helper.colorSchemes[helper.colorScheme], 150);
        for (var i = 0; i <= fakeWidth; i += 75) {
            for (var j = 0; j <= fakeHeight; j += 75) {
                var noiseVal = proc.noise(i / 100, j / 100, proc.frameCount / 200);
                helper.hexagon(i, j, noiseVal * 360, 100);
            }
        }
    };
    var drawGuideBackground = function () {
        proc.background(0, 0, 0);
        proc.stroke(helper.colorSchemes[helper.colorScheme], 150);
        for (var i = -300 + proc.frameCount % 150; i <= fakeWidth + proc.frameCount % 150; i += 150) {
            for (var j = 0; j <= fakeHeight; j += 150) {
                var noiseVal = proc.noise(i / 100, j / 100, proc.frameCount / 400);
                helper.hexagon(i + proc.frameCount % 150, j, noiseVal * 360, 200);
            }
        }
    };
    var drawStatsBackground = function () {
        proc.background(0, 0, 0);
        proc.stroke(helper.colorSchemes[helper.colorScheme], 150);
        proc.noFill();
        for (var i = -50; i < fakeWidth + 50; i += 25) {
            var rectfakeHeight = proc.noise(i / 100 + proc.frameCount / 100) * fakeHeight;
            proc.rect(i, fakeHeight - rectfakeHeight, 25, rectfakeHeight);
        }
    };
    var drawWinnersBackground = function () {
        proc.background(0, 0, 0);
        proc.stroke(helper.colorSchemes[helper.colorScheme], 150);
        var distance = fakeWidth / 4;
        for (var i = 0; i < 360; i += 30) {
            helper.hexagon(fakeWidth / 2 + proc.cos(i) * distance, fakeHeight / 2 + proc.sin(i) * distance, 0, fakeWidth / 4 * proc.sin(proc.frameCount));
        }
    };
    var drawSavingBackground = function () {
        proc.background(0, 0, 0);
        proc.stroke(helper.colorSchemes[helper.colorScheme], 150);
        var distance = fakeWidth / 4;
        for (var i = 0; i <= fakeWidth; i += 30) {
            helper.hexagon(i, i, proc.frameCount, fakeWidth);
        }
    };
    var backgrounds = {
        'Warning': drawWarningBackground,
        'Game': drawGameBackground,
        'Menu': drawMenuBackground,
        'Shop': drawShopBackground,
        'Gun Selection': drawGunSelectBackground,
        'Credits': drawCreditsBackground,
        'Color Selection': drawColorSelectBackground,
        'Player Upgrade': drawPlayerUpgradeBackground,
        'Chests': drawChestBackground,
        'Display Chest': drawDisplayChestBackground,
        'Story': drawStoryBackground,
        'Drone Selection': drawDroneSelectBackground,
        'Drone Weapon Selection': drawDroneWeaponSelectBackground,
        'Ascend': drawAscendBackground,
        'Ascension Upgrades': drawAscendUpgradesBackground,
        'Viruses': drawVirusBackground,
        'Power Selection': drawPowersBackground,
        'Secret Market': drawSecretMarketBackground,
        'Awards': drawAwardsBackground,
        'Info': drawInfoBackground,
        'Guide': drawGuideBackground,
        'Stats': drawStatsBackground,
        'Winners': drawWinnersBackground,
        'Saving': drawSavingBackground,
    };
    var drawTitle = function (title) {
        proc.textSize(62.5);
        proc.textAlign(proc.CENTER, proc.CENTER);
        proc.fill(helper.colorSchemes[helper.colorScheme]);

        hackerText(title, fakeWidth / 2, 50);
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
        proc.line(fakeWidth / 2 - title.length * 15, 85, fakeWidth / 2 + title.length * 15, 85);
        proc.line(fakeWidth / 2 - title.length * 10, 90, fakeWidth / 2 + title.length * 10, 90);

        proc.noFill();
    };
    // }
    // Transition {
    var transitionCounter = 0;
    var transitionSpeed = 0.05;
    var transitionScene = 'Story';
    var transition = function () {
        if (transitionCounter > 0) {
            proc.noStroke();
            proc.fill(0, 0, 0, 255 - proc.abs(transitionCounter - 0.5) * 2 * 255);
            proc.rect(0, 0, fakeWidth, fakeHeight);
            proc.stroke(helper.colorSchemes[helper.colorScheme]);
            helper.hexagon(fakeWidth / 2, fakeHeight / 2, proc.frameCount, (transitionCounter - 0.5) * fakeWidth * 2);
        }
        if (transitionCounter <= 0.5 & scene !== transitionScene) {
            scene = transitionScene;
        }
        transitionCounter -= transitionSpeed;
    };
    var switchScene = function (sceneTo) {
        transitionCounter = 1;
        transitionScene = sceneTo;
    };
    // }
    // Messages {
    var addNotif = function (notification) {
        notifs.push(notification);
    };
    var notifTimer = 100;
    var maxNotifTimer = 100;
    var notifications = function () {
        if (transitionCounter > 0.5) {
            return;
        }
        if (notifs.length > 0) {
            proc.fill(0, 0, 0);
            proc.stroke(helper.colorSchemes[helper.colorScheme]);
            proc.rect(0, -50 + proc.min(notifTimer, 50), fakeWidth, 50);
            proc.fill(helper.colorSchemes[helper.colorScheme]);
            proc.rect(0, -2 + proc.min(notifTimer, 50), fakeWidth * notifTimer / maxNotifTimer, 2);
            proc.textSize(15);
            proc.textAlign(proc.CENTER, proc.CENTER);
            proc.text(notifs[0], fakeWidth / 2, -25 + proc.min(notifTimer, 50));
            notifTimer--;
            if (notifTimer <= 0) {
                notifTimer = maxNotifTimer;
                notifs.splice(0, 1);
            }
        }
    };
    // }
    // }
    // Start {
    // Warning {
    var warningButtons = [{
        name: 'Easy',
        x: fakeWidth * 3 / 4,
        y: fakeHeight * 5 / 6,
        radius: 50,
        requiredLevel: 0,
        description: 'Contains no viruses.',
        onClick: function () {
            switchScene('Story');
        }
    },
    {
        name: 'Hard',
        x: fakeWidth / 4,
        y: fakeHeight * 5 / 6,
        radius: 50,
        requiredLevel: 0,
        description: 'The real game, where viruses plague your program.',
        onClick: function () {
            switchScene('Story');
            infected = true;
        }
    },
    {
        name: 'Graphics',
        x: fakeWidth / 2,
        y: fakeHeight * 5 / 6,
        radius: 50,
        requiredLevel: 0,
        description: 'Graphics are high quality (may cause lag).\nOriginal functions will be used to draw weapons and bullets.',
        onClick: function () {
            if (graphicsQuality === 'High') {
                this.description = 'Graphics are low quality (low lag).\nWeapons and bullets are drawn using loaded images.';
                graphicsQuality = 'Low';
            } else {
                this.description = 'Graphics are high quality (may cause lag).\nOriginal functions will be used to draw weapons and bullets.';
                graphicsQuality = 'High';
            }
        }
    },
    ];
    var warning = function () {
        drawTitle('WARNING');

        proc.textAlign(proc.LEFT, proc.TOP);
        proc.textSize(15);
        proc.fill(helper.colorSchemes[helper.colorScheme]);
        proc.text('This game contains flashing lights, which may be unsuitable for some. In the game, there are viruses, which make the game more difficult. Some viruses make things flash, which may hurt your eyes. Most viruses will cause lag (which is a built-in feature). There are two modes: Easy and Hard. Easy mode (without viruses) is recommended for first-time players. People with potato computers or epilepsy should choose this mode. Hard mode incorporates the viruses, which can crash the game. Effectively, it is a race against the viruses. Can you ascend before they render the game impossible?', 25, fakeHeight / 5, fakeWidth - 50, fakeHeight * 2 / 3);
        proc.noFill();
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
        proc.rect(10, fakeHeight / 5 - 10, fakeWidth - 20, fakeHeight * 0.5);
    };
    // }
    // Story {
    var storyButtons = [{
        name: 'Start',
        x: fakeWidth / 3,
        y: fakeHeight * 7 / 8,
        radius: 50,
        requiredLevel: 0,
        description: '',
        onClick: function () {
            switchScene('Menu');
            addNotif(ascensions === 0 ? 'Welcome to Data Defense.' : 'Entering Ascension ' + ascensions + '.');
        }
    },
    {
        name: 'Dev',
        x: fakeWidth * 2 / 3,
        y: fakeHeight * 7 / 8,
        radius: 50,
        requiredLevel: 0,
        description: 'Developer mode.\nUsed by the creator to design the game.',
        onClick: function () {
            dev = true;
            switchScene('Menu');
            addNotif(ascensions === 0 ? 'Welcome, developer.' : 'Entering Ascension ' + ascensions + '.');
        }
    },
    ];
    var current = 0;
    var storyTexts = ['A: Did you seriously just tell me that you believed that?\nB: Yeah? The email clearly said in official, bold letters that I won the lottery! Why wouldn\'t I follow their instructions?\nA: You know that is a scam, right?\nB: Well, the website they sent a link to was a bit weird, so it could be.\nA: You clicked on the link? Oh my gosh. How stupid can you get?\nB: It shouldn\'t be too big of a deal, right? Our computer has a virus protection software.\nA: Yes. And for a good reason. Let\'s just hope that it does its job.\nB: I don\'t want to lose my 500 hours of gaming progress! :(\nA: Shut up! You imbecile.\n\nYour mission: protect your computer against the virus at all costs. Entering: Data Defense.', 'A: Here, I\'ll try restarting the computer.\nB: No! It says that we might lose some unsaved work, like my gaming progress!\nA: If we don\'t restart the computer to get rid of the virus, you won\'t have any gaming progress left over!\nB: Oh. Sorry, I was being really stupid.\nA: I agree. You are really stupid.\nB: That\'s not nice! You hurt my feelings!\nA: I\'m citing facts. Why would the truth hurt your feelings?\nB: My stupidity is not a fact! It\'s objective!\nA: See what I mean? Objective means facts, and subjective means opinion.\nB: Ok, my stupidity is subjective! Who cares, it\'s the same thing anyways.\n\nRestarting Data Defense...', 'B: That didn\'t seem like it worked. I don\'t see a difference.\nA: No, look! The virus protection software\'s loading bar is moving faster!\nB: Oh yeah, it is! Let\'s try restarting it again, so it will be even better!\nA: Where did the mouse go?\nB: Uh oh. I guess we\'ll have to wait for the software to bring it back. Ugh. I want to play games so badly right now!\nA: Shut up! That\'s the least important of matters right now. Our tax reports and credit card information are all stored on the computer!\nB: And my videos of monkeys reacting to magic tricks!\nA: My work PowerPoint too!\nB: What\'s a PowerPoint?\n\nRestarting again...', 'A: I\'ve been waiting for four days!\nC: Sorry, many people have been calling tech support recently. Apparently there is a virus that has been spreading through emails.\nA: I believe our computer has that virus.\nC: That\'s unfortunate. We have not yet found a way to remove the virus. You\'ll have to deal with it yourself, or factory reset your computer.\nB: Does that mean I will lose my gaming progress?\nC: I\'m afraid it does, little one.\nB: I\'m not little! I\'m twenty years old!\nC: Sorry, but I usually don\'t expect people other than kids to worry about video games.\nA: I also have some data on the computer that isn\'t backed up.\n\nRestarting computer...', 'B: What\'s happening? Why do you look so scared?\nA: I\'m not scared. Come here. Look at what the computer is doing.\nB: It\'s going to websites by itself?\nA: Yes. This site is for our online bank account.\nB: What does that mean?\nA: That means that we will lose money if we don\'t remove this virus!\nB: Oh. That is very scary.\nA: Of course it is. We might actually have to factory reset the computer.\nB: But...\nA: Do not mention your gaming progress.\nB: I was going to say that I would lose my dancing bunny videos.\nA: Seriously?\n\nRestarting...', 'A: Hey, come here.\nB: What is it? This better be worth having to wake up at 4 AM.\nA: What is this circle floating around on the screen?\nB: Yeah, what is it?\nA: I don\'t know.\nB: It looks like it is clicking on things!\nA: What do you mean?\nB: Look! It just opened up my inappropriate applesauce memes!\nA: Hmm. It is acting like a cursor! Whenever it floats over buttons, they become highlighted!\nB: It just opened up my video game! No! I am going to lose my progress!\nA: Seriously? I\'m restarting the computer.\nB: Don\'t! Not again! It\'s a miracle my games survived last time!\n\nRestarting...', 'A: Uh oh, it opened up the terminal.\nB: What is a terminal? Is that the thing in airports?\nA: No, a computer terminal, you idiot.\nB: Wait, it can type!\nA: Nice observation, Mr. Obvious.\nB: What is it saying?\nX: Hello, humans.\nB: Hi! Are you the virus? Please spare my bunny videos.\nA: It cannot hear us, you dimwit.\nX: Yes, I can. Who told you I couldn\'t?\nA: Uh oh.\nX: I have access to the computer microphone.\nB: Is that a good thing?\nA: Of course not! Are you stupid?\n\nResetting...', 'A: Ok, I downloaded and recovered as many files as I could.\nB: Do I have permission?\nX: Don\'t you dare destroy the computer. I\'ll delete all your progress.\nA: Don\'t listen to it!\nB: *Hits computer with spatula*\nA: *Rips computer in half with their bare hands*\nB: Well, that\'s the end of that.\nA: We wouldn\'t had to do this if you had paid more attention to the sites you browsed. I\'m done with this nonsense! Let us celebrate!\nX: May I celebrate with you?\nA: *Repetitively slams computer on floor*\nX: No, I am no longer on your computer. Look at your television.\n\nRestarting...', 'D: What do you mean by "a virus ate my homework?"\nB: I swear I did it! I think I emailed the PowerPoint to you yesterday!\nD: It clearly isn\'t on my computer.\nX: Yes, it is.\nD: What was that?\nB: Uh oh. It was the virus that ate my homework.\nD: So, that wasn\'t an empty PowerPoint you sent me.\nB: My mom said that you should destroy your computer as soon as possible if you get infected.\nD: I still have my lesson plans here!\nX: You mean, I have your lesson plans.\nD: *Shudders*\nB: *Picks up computer and chucks it*\n\nRestarting...', 'E: Breaking news! All electronic devices are now infected by a virus! Our most advanced team is working on finding a way to remove it. In the meantime, *static*\nB: That\'s not good. *Slams remote on ground*\nE: ... a shift to analog devices may help maintain *static*\nB: *Turns television off*\nA: This is pointless.\nB: I agree. Let\'s try some of the old movies on the DVDs.\nA: Sure.\nB: Which one? The Tale of the Missing Cat?\nA: We\'ve watched that one thousands of times.\nB: Ugh. Let\'s go to the movie theatres instead.\nA: They\'ve closed. I\'ve checked.\nB: Ugh.\n\nRestarting...'];

    var displayedStoryText = '';
    var drawStoryText = function () {
        proc.textAlign(proc.LEFT, proc.TOP);
        proc.textSize(15);
        proc.fill(helper.colorSchemes[helper.colorScheme]);
        proc.text(displayedStoryText, 25, fakeHeight / 5, fakeWidth - 50, fakeHeight * 2 / 3);
        proc.noFill();
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
        proc.rect(10, fakeHeight / 5 - 10, fakeWidth - 20, fakeHeight * 0.6);
        if (current < storyTexts[proc.constrain(ascensions, 0, storyTexts.length - 1)].length) {
            displayedStoryText += storyTexts[proc.constrain(ascensions, 0, storyTexts.length - 1)][current];
            current += 1;
        }
    };
    var story = function () {
        drawStoryText();
        drawTitle('Story Pt.' + ascensions);
    };
    // }
    //}
    // Experience {
    var experience = 0;
    var level = 1;
    var maxExperience = 100;
    var experienceGain = 1;
    var experienceBar = function () {
        proc.fill(0, 0, 0);
        proc.rect(fakeWidth - 155, fakeHeight - 20, 150, 15);
        proc.fill(helper.colorSchemes[helper.colorScheme]);
        proc.rect(fakeWidth - 155, fakeHeight - 20, 150 * experience / maxExperience, 15);
        proc.fill(experience / maxExperience > 2 / 5 ? proc.color(0, 0, 0) : helper.colorSchemes[helper.colorScheme]);
        proc.textSize(12.5);
        if (experience / maxExperience > 2 / 5) {
            proc.textAlign(proc.LEFT, proc.CENTER);
            proc.text('Level ' + level, fakeWidth - 150, fakeHeight - 12.5);
        } else {
            proc.textAlign(proc.RIGHT, proc.CENTER);
            proc.text('Level ' + level, fakeWidth - 10, fakeHeight - 12.5);
        }
        proc.fill(0, 0, 0);

        while (experience >= maxExperience) {
            experience -= maxExperience;
            level++;
            maxExperience *= 3;
            addNotif('You are now level ' + level + '!');
        }
    };
    // }
    // Currency {
    var startingBits = 0;
    var bits = startingBits;
    var bitMult = 1;
    var cumulativeBits = 0;
    var kiloBytes = 0;
    var drawBit = function (x, y, s) {
        proc.strokeWeight(helper.lineWidth);
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
        helper.hexagon(x, y, 0 + proc.frameCount, s);
        helper.hexagon(x, y, 30 - proc.frameCount, s * 2 / 3);
    };
    var displayBits = function () {
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
        proc.fill(0, 0, 0);
        proc.rect(-5, fakeHeight - 25, fakeWidth + 10, 25);
        drawBit(15, fakeHeight - 12.5, 15);
        proc.fill(helper.colorSchemes[helper.colorScheme]);
        proc.textSize(15);
        proc.textAlign(proc.LEFT, proc.CENTER);
        proc.text(proc.floor(bits) + ' bits', 30, fakeHeight - 13);
        proc.fill(0, 0, 0);
    };
    var drawFakeBits = function () {
        for (var i = 0; i < fakeBits.length; i++) {
            var fakeBit = fakeBits[i];
            drawBit(fakeBit.x, fakeBit.y, 10);
        }
    };
    var moveFakeBits = function () {
        for (var i = 0; i < fakeBits.length; i++) {
            var fakeBit = fakeBits[i];
            fakeBit.x *= 0.95;
            fakeBit.y *= 0.95;
        }
    };
    var removeFakeBits = function () {
        for (var i = 0; i < fakeBits.length; i++) {
            var fakeBit = fakeBits[i];
            if (fakeBit.x * fakeBit.x + fakeBit.y * fakeBit.y <= players[0].radius * players[0].radius) {
                bits += bitMult;
                cumulativeBits += bitMult;
                fakeBits.splice(i, 1);
            }
        }
    };
    // }
    // Game objects {
    // Weapons {

    var weapons = weaponsFn(proc, helper, bullets, players);

    var drawWeapon = function (weapon, x, y, radius, reload) {
        if (graphicsQuality === 'High') {
            weapon.display(x + radius, y, radius, reload);
        } else {
            proc.image(weapon.imageDisplay, x + radius - radius * weaponImageScale / 2, y - radius * weaponImageScale / 2, radius * weaponImageScale, radius * weaponImageScale);
        }
    };
    // }
    // Drones {
    var shopDrones = [{
        movementSpeed: 1,
        maxHealth: 500,
        healthRegen: 0.025,
        bodyDamage: 0.25,
        hoverDistance: 100,
        maxReviveTime: 300,
        description: 'Your standard, balanced drone.',
    },
    {
        movementSpeed: 2,
        maxHealth: 250,
        healthRegen: 0.0125,
        bodyDamage: 0.1,
        hoverDistance: 75,
        maxReviveTime: 200,
        description: 'Fast, low health drone that revives quicker.',
    },
    {
        movementSpeed: 0.5,
        maxHealth: 125,
        healthRegen: 0,
        bodyDamage: 0.1,
        hoverDistance: 125,
        maxReviveTime: 1,
        description: 'A slow drone that revives instantly.',
    },
    {
        movementSpeed: 1.5,
        maxHealth: 1250,
        healthRegen: 0,
        bodyDamage: 1,
        hoverDistance: 15,
        maxReviveTime: 300,
        description: 'A rammer drone with high body damage.',
    },
    {
        movementSpeed: 0.5,
        maxHealth: 2500,
        healthRegen: 0.05,
        bodyDamage: 0.75,
        hoverDistance: 100,
        maxReviveTime: 400,
        description: 'A tanky, slow drone.',
    },
    {
        movementSpeed: 0,
        maxHealth: 1250,
        healthRegen: 0.125,
        bodyDamage: 1.5,
        hoverDistance: 100,
        maxReviveTime: 200,
        description: 'An immobile drone that acts as a meat shield.',
    },
    {
        movementSpeed: 3,
        maxHealth: 375,
        healthRegen: 0.125,
        bodyDamage: 0.1,
        hoverDistance: fakeWidth * 4,
        maxReviveTime: 300,
        description: 'A super speedy, but vulnerable drone.\nStays close to you.',
    },
    {
        movementSpeed: fakeWidth * 4,
        maxHealth: 375,
        healthRegen: 0.125,
        bodyDamage: 0.25,
        hoverDistance: 75,
        maxReviveTime: 400,
        description: 'A vulnerable drone that teleports.\nTakes a while to revive.',
    },
    {
        movementSpeed: 1,
        maxHealth: 500,
        healthRegen: 0.025,
        bodyDamage: 0.25,
        hoverDistance: fakeWidth * 4,
        maxReviveTime: 200,
        description: 'A balanced drone that stays close to you.',
    },
    {
        movementSpeed: 0.75,
        maxHealth: 1500,
        healthRegen: 0.0125,
        bodyDamage: 0.5,
        hoverDistance: fakeWidth * 4,
        maxReviveTime: 500,
        description: 'Tanky, stays by your side.\nTakes a while to revive.',
    },
    {
        movementSpeed: 0.75,
        maxHealth: 250,
        healthRegen: 50,
        bodyDamage: 0.5,
        hoverDistance: 80,
        maxReviveTime: 1500,
        description: 'Fully heals itself almost instantly.\nExtremely long revive time if killed.',
    },
    {
        movementSpeed: 2.5,
        maxHealth: 500,
        healthRegen: 0,
        bodyDamage: 2.5,
        hoverDistance: 15,
        maxReviveTime: 1000,
        description: 'Insane body damage and speed, but low health.\nEffectively a bullet. Takes time to revive.',
    },
    {
        movementSpeed: 2.5,
        maxHealth: 1000,
        healthRegen: 0.025,
        bodyDamage: 0,
        hoverDistance: fakeWidth * 4,
        maxReviveTime: 300,
        description: 'Balanced drone that turns fast.\nStays near you like a turret.',
    },
    {
        movementSpeed: 1.25,
        maxHealth: 1250,
        healthRegen: 0.05,
        bodyDamage: 0.5,
        hoverDistance: 120,
        maxReviveTime: 400,
        description: 'Standard drone, but better in every way.\nExcept revive time, or course.',
    },
    {
        movementSpeed: 1.5,
        maxHealth: 375,
        healthRegen: 0.0125,
        bodyDamage: 0,
        hoverDistance: fakeWidth * 4,
        maxReviveTime: 200,
        description: 'Cowardish, weak drone. Stays close to you.',
    },
    {
        movementSpeed: 1.5,
        maxHealth: 1500,
        healthRegen: -0.05,
        bodyDamage: 0.375,
        hoverDistance: 75,
        maxReviveTime: 200,
        description: 'Good in every area, but slowly loses health.',
    },
    {
        movementSpeed: 1,
        maxHealth: 750,
        healthRegen: 0.0375,
        bodyDamage: 0.25,
        hoverDistance: -75,
        maxReviveTime: 400,
        description: 'Balanced drone.\nSneaks behind enemies to avoid being damaged.',
    },
    ];
    var greekCharacters = '\u03b1\u03b2\u03b3\u03b4\u03b5\u03b6\u03b7\u03b8\u03b9\u03ba\u03bb\u03bc\u03bd\u03be\u03bf\u03c0\u03c1\u03c2\u03c3\u03c4\u03c5\u03c6\u03c7\u03c8\u03c9';
    var greekCharacterNames = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Psi', 'Omega'];
    var originalDroneCount = shopDrones.length;
    var initDrones = function () {
        for (var i = 0; i < shopDrones.length; i++) {
            var shopDrone = shopDrones[i];
            shopDrone.owned = false;
            shopDrone.side = 'Good';
            shopDrone.reviveTime = 0;
            shopDrone.dead = false;
            shopDrone.angle = 0;
            shopDrone.weapon = 0;
            shopDrone.movement = 'Drone';
            shopDrone.reload = 0;
            shopDrone.distance = 50;
            shopDrone.health = shopDrone.maxHealth;
            shopDrone.level = 0;
            shopDrone.radius = 12.5;
            shopDrone.name = greekCharacterNames[i];
            shopDrone.logo = greekCharacters[i];
            shopDrone.used = false;
        }
    };
    initDrones();
    for (var i = 0; i < originalDroneCount; i++) {
        shopDrones.push(Object.assign({}, shopDrones[i]));
        var originalName = shopDrones[shopDrones.length - 1].name;
        shopDrones[shopDrones.length - 1].name += ' Prime';
        shopDrones[shopDrones.length - 1].description = 'Identical to ' + originalName + ', but now you can equip two.\n' + shopDrones[shopDrones.length - 1].description;
    }
    // }
    // Powers {
    var startWithPowers = false;
    var autoPowers = false;
    var powers = [{
        name: 'None',
        description: 'This power does absolutely nothing.',
        loadTime: 200,
        does: function () {

        }
    },
    {
        name: 'Reset',
        description: 'Sends every enemy back off the screen, clearing all enemy bullets.',
        loadTime: 2000,
        does: function () {
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                if (player.side === 'Bad') {
                    player.distance = fakeWidth * proc.sqrt(2) / 2;
                }
            }
            for (var i = 0; i < bullets.length; i++) {
                var bullet = bullets[i];
                if (bullet.side === 'Bad') {
                    bullet.dead = true;
                }
            }
        }
    },
    {
        name: 'Blizzard',
        description: 'Spawns piercing shards of ice everywhere.',
        loadTime: 1500,
        does: function () {
            for (var k = 0; k < 500; k++) {
                bullets.push({
                    x: proc.random(-fakeWidth / 2, fakeWidth / 2),
                    y: proc.random(-fakeHeight / 2, fakeHeight / 2),
                    angle: 0,
                    speed: 0,
                    type: 6,
                    radius: 4,
                    life: 0,
                    side: 'Good',
                    dead: false,
                    damage: 10 * helper.difficulty / 100,
                });
            }
        }
    },
    {
        name: 'Clearance',
        description: 'Shoots an expanding circle of bullets.',
        loadTime: 1000,
        does: function () {
            for (var k = 0; k < 360; k += 10) {
                bullets.push({
                    x: 0,
                    y: 0,
                    angle: k,
                    speed: 5,
                    type: 0,
                    radius: 8,
                    life: 0,
                    side: 'Good',
                    dead: false,
                    damage: helper.difficulty / 100,
                });
            }
        }
    },
    {
        name: 'Force Field',
        description: 'Creates a massive force field.',
        loadTime: 1500,
        does: function () {
            for (var k = fakeWidth / 6; k <= fakeWidth / 2; k += fakeWidth / 6) {
                bullets.push({
                    x: 0,
                    y: 0,
                    angle: 0,
                    speed: 0,
                    type: 8,
                    radius: k,
                    life: 0,
                    side: 'Good',
                    dead: false,
                    damage: helper.difficulty / 200,
                });
            }
        }
    },
    {
        name: 'Mage',
        description: 'Launches a large ball of plasma.',
        loadTime: 1000,
        does: function () {
            bullets.push({
                x: 0,
                y: 0,
                angle: players[0].angle,
                speed: 12,
                type: 12,
                radius: 75,
                life: 0,
                side: 'Good',
                dead: false,
                damage: 2 * helper.difficulty / 100,
            });
        }
    },
    {
        name: 'Necromancer',
        description: 'Spawns a horde of tiny drones.',
        loadTime: 2000,
        does: function () {
            smallDroneCount += 5;
            for (var i = 0; i < 5; i++) {
                players.push({
                    weapon: 2,
                    angle: proc.random(360),
                    distance: proc.random(fakeWidth / 2),
                    radius: 7.5,
                    movement: 'Drone',
                    movementSpeed: 2,
                    health: helper.difficulty * 2,
                    maxHealth: helper.difficulty * 2,
                    healthRegen: -0.2,
                    reload: 0,
                    side: 'Good',
                    dead: false,
                    bodyDamage: 0,
                    hoverDistance: 50,
                    reviveTime: 0,
                    maxReviveTime: 0,
                });
            }
        }
    },
    ];
    var playerPower = 0;
    var playerPowerReload = 0;
    var usePower = function () {
        var power = powers[playerPower];
        if ((proc.mouseIsPressed & proc.mouseButton === proc.RIGHT & playerPowerReload >= power.loadTime) || (playerPowerReload >= power.loadTime & !proc.mouseIsPressed)) {
            power.does();
            playerPowerReload = 0;
        }
        playerPowerReload++;
    };
    // }
    // Players {
    hPlayer = {
        weapon: 2,
        angle: 0,
        distance: 0,
        radius: 12.5,
        movement: 'Human',
        movementSpeed: 1,
        health: 10000,
        maxHealth: 10000,
        healthRegen: 0,
        reload: 0,
        side: 'Good',
        dead: false,
        bodyDamage: 0,
    };
    var spawnPlayers = function (type, amount) {
        var referenceWeapon = type.weapon;
        for (var g = 0; g < amount; g++) {
            if (type.movement !== 'Boss') {
                type.angle = proc.random(0, 360);
            } else {
                type.angle = 180;
            }
            type.distance = fakeWidth * proc.sqrt(2) / 2 + type.radius;
            type.health = type.maxHealth;
            type.healthRegen = type.maxHealth / 40000;
            type.dead = false;
            type.reload = 0;
            if (referenceWeapon === -1) {
                type.weapon = proc.floor(proc.random(2, weapons.length));
            }
            var newType = Object.assign({}, type);
            players.push(newType);
        }
    };
    var getPlayerPos = function (player) {
        if (player.movement === 'Human') {
            return {
                x: 0,
                y: 0
            };
        } else {
            return {
                x: -proc.cos(player.angle) * player.distance,
                y: -proc.sin(player.angle) * player.distance
            };
        }
    };
    var oppositeSide = function (side) {
        if (side === 'Bad') {
            return 'Good';
        } else {
            return 'Bad';
        }
    };
    var drawHealth = function (x, y, s, h) {
        h = proc.constrain(h, 0, 1);
        if (h < 1) {
            proc.rect(x - s * 3 / 2, y + s * 5 / 4, 3 * s, s / 4, s / 4);
            proc.fill(helper.colorSchemes[helper.colorScheme]);
            proc.rect(x - s * 3 / 2, y + s * 5 / 4, 3 * s * h, s / 4, s / 4);
        }
        proc.noFill();
    };
    var drawDrone = function (player) {
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
        proc.rect(-player.radius * proc.sqrt(3) / 2, -player.radius * proc.sqrt(3) / 2, player.radius * proc.sqrt(3), player.radius * proc.sqrt(3));
        helper.hexagon(0, 0, 0, player.radius * 2);
        var angle = proc.frameCount * 16;
        for (var r = 60; r < 360; r += 60) {
            if (r !== 180) {
                proc.line(proc.cos(r) * player.radius, proc.sin(r) * player.radius, proc.cos(r) * player.radius * 2, proc.sin(r) * player.radius * 2);
                proc.ellipse(proc.cos(r) * player.radius * 2, proc.sin(r) * player.radius * 2, player.radius, player.radius);
                proc.line(proc.cos(r) * player.radius * 2 + proc.cos(angle) * player.radius, proc.sin(r) * player.radius * 2 + proc.sin(angle) * player.radius, proc.cos(r) * player.radius * 2 - proc.cos(angle) * player.radius, proc.sin(r) * player.radius * 2 - proc.sin(angle) * player.radius);
            }
        }
        proc.fill(helper.colorSchemes[helper.colorScheme]);
        proc.textAlign(proc.CENTER, proc.CENTER);
        proc.textSize(player.radius * 3 / 2);
        proc.text(player.logo, 0, 0);
        proc.noFill();
    };
    var drawPlayer = function (player) {
        var playerPos = getPlayerPos(player);

        proc.pushMatrix();
        proc.translate(playerPos.x, playerPos.y);
        if (player.movement !== 'Drone') {
            proc.rotate(player.angle);
        } else {
            proc.rotate(player.angle + 180);
        }

        proc.fill(0, 0, 0);
        proc.stroke(helper.colorSchemes[helper.colorScheme]);

        if (player.movement === 'Drone') {
            drawDrone(player);
        } else {
            proc.ellipse(0, 0, player.radius * 2, player.radius * 2);
        }
        drawWeapon(weapons[player.weapon], 0, 0, player.radius, player.reload / weapons[player.weapon].reload);

        proc.popMatrix();
        if (player.movement !== 'Human') {
            drawHealth(playerPos.x, playerPos.y, player.radius, player.health / player.maxHealth);
        }

        proc.noStroke();
    };
    var drawPlayers = function () {
        for (var i = 0; i < players.length; i++) {
            drawPlayer(players[i]);
        }
    };
    var findNearestPlayer = function (player) {
        var closest = [0, 100000];
        for (var i = 0; i < players.length; i++) {
            var player2 = players[i];
            if (player.side === player2.side) {
                continue;
            }
            var moveDist = proc.min(helper.modulo(player2.angle - player.angle, 360), helper.modulo(player.angle - player2.angle, 360));
            if (moveDist < closest[1]) {
                closest = [i, moveDist];
            }
        }
        return closest[0];
    };
    var findMovementDirection = function (angle, target) {
        var normAngle = helper.modulo(angle, 360);
        var normTarget = helper.modulo(target, 360);
        if (helper.modulo(normTarget - normAngle, 360) >= 180) {
            return -1;
        } else {
            return 1;
        }
    };
    var movePlayer = function (player) {
        var angularMovementSpeed = player.movement === 'Human' ? player.movementSpeed : 360 * player.movementSpeed / 6.28 / player.distance;
        switch (player.movement) {
            case 'Human':
                var target = proc.atan2(proc.mouseY * yScale - fakeHeight / 2, proc.mouseX * xScale - fakeWidth / 2);
                var minMove = proc.abs(helper.modulo(target - player.angle, 360));
                if (minMove > 180) {
                    minMove = 360 - minMove;
                }
                player.angle += findMovementDirection(player.angle, target) * proc.min(minMove, angularMovementSpeed);
                break;
            case 'Standard':
                if (player.distance > 0) {
                    player.distance -= player.movementSpeed;
                }
                break;
            case 'Boss':
                if (player.distance > fakeWidth / 10) {
                    player.distance -= player.movementSpeed;
                }
                break;
            case 'Dodge':
                player.angle += proc.sin(proc.frameCount) * 0.5 * angularMovementSpeed;
                if (player.distance > 0) {
                    player.distance -= player.movementSpeed / 10;
                }
                break;
            case 'Spin':
                player.angle += proc.sin(proc.frameCount % 180) * 0.5 * angularMovementSpeed;
                if (player.distance > 0) {
                    player.distance -= player.movementSpeed / 10;
                }
                break;
            case 'Spiral':
                player.angle += 0.5 * angularMovementSpeed;
                if (player.distance > 0) {
                    player.distance -= player.movementSpeed / 10;
                }
                break;
            case 'Drone':
                var target = players[findNearestPlayer(player)];
                var minMove = proc.abs(helper.modulo(target.angle - player.angle, 360));
                if (minMove > 180) {
                    minMove = 360 - minMove;
                }
                player.angle += findMovementDirection(player.angle, target.angle) * proc.min(minMove, angularMovementSpeed);
                if (player.distance < target.distance - player.hoverDistance) {
                    player.distance += proc.min(target.distance - player.hoverDistance - player.distance, player.movementSpeed);
                } else if (player.distance > 0) {
                    player.distance -= proc.min(player.distance - (target.distance - player.hoverDistance), player.movementSpeed);
                }
        }
        player.distance = proc.constrain(player.distance, 0, 100000);
    };
    var shootPlayer = function (player) {
        if (player.dead) {
            return;
        }
        var playerPos = getPlayerPos(player);
        if (player.reload < weapons[player.weapon].reload) {
            player.reload++;
        }
        if (player.movement === 'Human') {
            if (player.reload >= weapons[player.weapon].reload & proc.mouseIsPressed & proc.mouseButton === proc.LEFT) {
                player.reload = 0;
                weapons[player.weapon].shoot(playerPos.x, playerPos.y, player.angle, player.side, weapons[player.weapon].damageCoefficient);
            }
        } else if (player.movement === 'Drone') {
            if (player.reload >= weapons[player.weapon].reload) {
                player.reload = 0;
                weapons[player.weapon].shoot(playerPos.x, playerPos.y, 180 + player.angle, player.side, weapons[player.weapon].damageCoefficient);
            }
        } else {
            if (player.reload >= weapons[player.weapon].reload) {
                player.reload = 0;
                weapons[player.weapon].shoot(playerPos.x, playerPos.y, player.angle, player.side, helper.difficulty / 100);
            }
        }

        player.reload = proc.constrain(player.reload, 0, weapons[player.weapon].reload);
    };
    var movePlayers = function () {
        for (var i = 0; i < players.length; i++) {
            var player = players[i];
            if (player.dead) {
                continue;
            }
            movePlayer(player);
            shootPlayer(player);
        }
    };
    var healPlayers = function () {
        for (var i = 0; i < players.length; i++) {
            var player = players[i];
            if (player.movement === 'Drone' & player.dead === true) {
                if (player.reviveTime < player.maxReviveTime) {
                    player.reviveTime++;
                } else {
                    player.dead = false;
                    player.health = player.maxHealth;
                }
            }
        }
        for (var i = 0; i < players.length; i++) {
            var player = players[i];
            if (player.dead) {
                continue;
            }
            if (player.health <= player.maxHealth) {
                player.health += proc.min(player.healthRegen * player.maxHealth / 100, player.maxHealth - player.health);
            }
            if (player.health <= 0) {
                player.dead = true;
                if (player.movement === 'Drone') {
                    player.reviveTime = 0;
                }
            }
            player.health = proc.constrain(player.health, 0, player.maxHealth);
        }
    };
    var removePlayers = function () {
        for (var i = players.length - 1; i >= 0; i--) {
            var player = players[i];
            if (player.dead & player.movement !== 'Drone') {
                if (player.movement === 'Human') {
                    switchScene('Menu');
                    players.splice(i, 1);
                    return;
                }
                if (player.side === 'Bad') {
                    experience += player.maxHealth / 10 * experienceGain;
                    var position = getPlayerPos(player);
                    for (var k = 0; k < proc.floor(player.maxHealth / 15); k++) {
                        var r = proc.random(0, 360);
                        var d = proc.random(0, player.radius);
                        if (fakeBits.length < 100) {
                            fakeBits.push({
                                x: position.x + proc.cos(r) * d,
                                y: position.y + proc.sin(r) * d
                            });
                        } else {
                            bits += bitMult;
                            cumulativeBits += bitMult;
                        }
                    }
                }
                players.splice(i, 1);
            } else if (player.movement === 'Drone' & player.dead) {
                if (player.maxReviveTime === 0) {
                    if (player.side === 'Good') {
                        smallDroneCount -= 1;
                    }
                    players.splice(i, 1);
                }
            }
        }
    };
    // }
    // Projectiles {
    var projectiles = [{
        name: 'Standard',
        display: function (x, y, s) {
            proc.ellipse(x, y, s, s);
        },
        movement: 'Straight',
        life: 75,
        damage: 20,
        onDeath: function (player, damage) {

        },
    },
    {
        name: 'Micro',
        display: function (x, y, s) {
            proc.rectMode(proc.CENTER);
            proc.rect(x, y, s * 3 / 2, s / 2);
            proc.rectMode(proc.CORNER);
        },
        movement: 'Straight',
        life: 75,
        damage: 8,
        onDeath: function (player, damage) {

        },
    },
    {
        name: 'Tracker',
        display: function (x, y, s) {
            proc.rectMode(proc.CENTER);
            proc.triangle(x, y, x - s, y - s, x + s, y);
            proc.triangle(x, y, x - s, y + s, x + s, y);
            proc.rectMode(proc.CORNER);
        },
        movement: 'Homing',
        life: 200,
        damage: 25,
        onDeath: function (player, damage) {
            var playerPos = getPlayerPos(player);
            bullets.push({
                x: playerPos.x,
                y: playerPos.y,
                angle: 0,
                speed: 0,
                type: 7,
                radius: 50,
                life: 0,
                side: oppositeSide(player.side),
                dead: false,
                damage: damage,
            });
        },
    },
    {
        name: 'Swayer',
        display: function (x, y, s) {
            proc.line(x - s, y, x + s, y);
        },
        movement: 'Waving',
        life: 100,
        damage: 8,
        onDeath: function (player, damage) {

        },
    },
    {
        name: 'Wave',
        display: function (x, y, s) {
            proc.line(x, y - s, x, y + s);
        },
        movement: 'Straight',
        life: 100,
        damage: 7.5,
        onDeath: function (player, damage) {
            if (player.movement !== 'Human') {
                if (player.movement !== 'Drone') {
                    player.distance += 5;
                } else {
                    player.distance -= 5;
                }
            }
        },
    },
    {
        name: 'Spike',
        display: function (x, y, s) {
            proc.triangle(x + s * 2 * proc.sqrt(3) / 3, y, x - s * proc.sqrt(3) / 3, y - s, x - s * proc.sqrt(3) / 3, y + s);
            proc.fill(proc.lerpColor(helper.colorSchemes[helper.colorScheme], proc.color(0, 0, 0), proc.floor((proc.frameCount / 10) % 2)));
            proc.ellipse(x, y, s, s);
            proc.fill(0, 0, 0);
        },
        movement: 'Static',
        life: 400,
        damage: 10,
        onDeath: function (player, damage) {
            var playerPos = getPlayerPos(player);
            bullets.push({
                x: playerPos.x,
                y: playerPos.y,
                angle: 0,
                speed: 0,
                type: 7,
                radius: 75,
                life: 0,
                side: oppositeSide(player.side),
                dead: false,
                damage: damage,
            });
        },
    },
    {
        name: 'Ice',
        display: function (x, y, s) {
            proc.triangle(x + s * proc.sqrt(3) / 3, y, x - s * proc.sqrt(3) / 6, y - s / 2, x - s * proc.sqrt(3) / 6, y + s / 2);
        },
        movement: 'Straight',
        life: 75,
        damage: 1.5,
        onDeath: function (player, damage) {
            if (player.side === 'Bad') {
                player.movementSpeed = 0;
                player.movement = 'Standard';
            }
        },
    },
    {
        name: 'Explosion',
        display: function (x, y, s) {
            proc.noFill();
            helper.hexagon(x, y, proc.frameCount * 5, s);
            proc.fill(0, 0, 0);
            for (var k = 0; k < s * s; k += 1000) {
                var r = proc.random(0, 360);
                var d = proc.random(0, s * proc.sqrt(3) / 4);
                proc.ellipse(x + proc.cos(r) * d, y + proc.sin(r) * d, s / 16, s / 16);
            }
        },
        movement: 'Splat',
        life: 10,
        damage: 2,
        onDeath: function (player, damage) {

        },
    },
    {
        name: 'Poison Field',
        display: function (x, y, s) {
            proc.noFill();
            helper.hexagon(x, y, proc.frameCount * 2, s);
            helper.hexagon(x, y, proc.frameCount * 2 + 30, s);
            proc.ellipse(x, y, s / 2, s / 2);
            proc.fill(0, 0, 0);
        },
        movement: 'Splat',
        life: 40,
        damage: 0.8,
        onDeath: function (player, damage) {

        },
    },
    {
        name: 'Cannonball',
        display: function (x, y, s) {
            proc.noFill();
            helper.hexagon(x, y, proc.frameCount * 2, s);
            proc.fill(proc.lerpColor(helper.colorSchemes[helper.colorScheme], proc.color(0, 0, 0), proc.floor((proc.frameCount / 10) % 2)));
            proc.ellipse(x, y, s / 2, s / 2);
            proc.fill(0, 0, 0);
        },
        movement: 'Straight',
        life: 80,
        damage: 30,
        onDeath: function (player, damage) {
            var playerPos = getPlayerPos(player);
            bullets.push({
                x: playerPos.x,
                y: playerPos.y,
                angle: 0,
                speed: 0,
                type: 7,
                radius: 75,
                life: 0,
                side: oppositeSide(player.side),
                dead: false,
                damage: damage,
            });
        },
    },
    {
        name: 'Fire',
        display: function (x, y, s) {
            helper.hexagon(x, y, proc.frameCount, s);
        },
        movement: 'Straight',
        life: 50,
        damage: 3,
        onDeath: function (player, damage) {

        },
    },
    {
        name: 'Burst',
        display: function (x, y, s) {
            proc.ellipse(x, y, s, s);
            for (var r = 0; r < 360; r += 60) {
                proc.line(x + proc.cos(r) * s / 2, y + proc.sin(r) * s / 2, x - proc.cos(r) * s / 2, y - proc.sin(r) * s / 2);
            }
        },
        movement: 'Straight',
        life: 50,
        damage: 20,
        onDeath: function (player, damage) {
            var playerPos = getPlayerPos(player);
            var d = proc.random(0, 36);
            for (var r = d; r < 360 + d; r += 300) {
                bullets.push({
                    x: playerPos.x + proc.cos(r) * (player.radius + 10),
                    y: playerPos.y + proc.sin(r) * (player.radius + 10),
                    angle: r,
                    speed: 5,
                    type: 1,
                    radius: 5,
                    life: 0,
                    side: oppositeSide(player.side),
                    dead: false,
                    damage: damage,
                });
            }
        },
    },
    {
        name: 'Plasma',
        display: function (x, y, s) {
            proc.stroke(helper.colorSchemes[helper.colorScheme]);
            proc.noFill();
            proc.ellipse(x, y, s, s * proc.sin(proc.frameCount));
            proc.ellipse(x, y, s, s * proc.sin(proc.frameCount + 90));
            proc.ellipse(x, y, s * proc.sin(proc.frameCount + 90), s);
            proc.ellipse(x, y, s * proc.sin(proc.frameCount), s);
            proc.ellipse(x, y, s, s);
        },
        movement: 'Piercing',
        life: 40,
        damage: 5,
        onDeath: function (player, damage) {

        },
    },
    {
        name: 'Void',
        display: function (x, y, s) {
            proc.stroke(helper.colorSchemes[helper.colorScheme]);
            proc.noFill();
            proc.ellipse(x, y, s * proc.sin(proc.frameCount), s * proc.sin(proc.frameCount));
            proc.ellipse(x, y, s, s);
        },
        movement: 'Piercing',
        life: 200,
        damage: 1,
        onDeath: function (player, damage) {

        },
    },
    {
        name: 'Arrow',
        display: function (x, y, s) {
            proc.rectMode(proc.CENTER);
            proc.rect(x, y, s * 3 / 2, s / 4);
            proc.rectMode(proc.CORNER);
            helper.hexagon(x + s * 3 / 4, y, 0, s / 2);
        },
        movement: 'Straight',
        life: 75,
        damage: 50,
        onDeath: function (player, damage) {

        },
    },
    {
        name: 'Firework',
        display: function (x, y, s) {
            proc.rectMode(proc.CENTER);
            proc.rect(x, y, s * 3 / 2, s / 4);
            proc.rect(x + s / 2, y, s / 2, s / 2);
            proc.rectMode(proc.CORNER);
            helper.hexagon(x + s * 3 / 4, y, 0, s / 2);
        },
        movement: 'Straight',
        life: 75,
        damage: 40,
        onDeath: function (player, damage) {
            var playerPos = getPlayerPos(player);
            bullets.push({
                x: playerPos.x,
                y: playerPos.y,
                angle: 0,
                speed: 0,
                type: 7,
                radius: 50,
                life: 0,
                side: oppositeSide(player.side),
                dead: false,
                damage: damage,
            });
        },
    },
    ];
    var delag = false;
    var drawBullet = function (bullet, x, y, s) {
        if (graphicsQuality === 'High') {
            bullet.display(x, y, s);
        } else {
            proc.image(bullet.imageDisplay, x - s * bulletImageScale / 2, y - s * bulletImageScale / 2, s * bulletImageScale, s * bulletImageScale);
        }
    };
    var drawBullets = function () {
        if (delag) {
            proc.noFill();
            proc.stroke(helper.colorSchemes[helper.colorScheme]);
            for (var i = 0; i < bullets.length; i++) {
                var bullet = bullets[i];
                proc.ellipse(bullet.x, bullet.y, bullet.radius * 2, bullet.radius * 2);
            }
            return;
        }
        for (var i = 0; i < bullets.length; i++) {
            var bullet = bullets[i];
            proc.fill(0, 0, 0);
            proc.stroke(helper.colorSchemes[helper.colorScheme]);

            proc.pushMatrix();
            proc.translate(bullet.x, bullet.y);
            proc.rotate(bullets[i].angle);
            proc.translate(-bullet.x, -bullet.y);
            drawBullet(projectiles[bullet.type], bullet.x, bullet.y, bullet.radius * 2);

            proc.popMatrix();
        }
    };
    var moveBullet = function (bullet) {
        switch (projectiles[bullet.type].movement) {
            case 'Straight':
                bullet.x += proc.cos(bullet.angle) * bullet.speed;
                bullet.y += proc.sin(bullet.angle) * bullet.speed;
                break;
            case 'Piercing':
                bullet.x += proc.cos(bullet.angle) * bullet.speed;
                bullet.y += proc.sin(bullet.angle) * bullet.speed;
                break;
            case 'Homing':
                bullet.x += proc.cos(bullet.angle) * bullet.speed;
                bullet.y += proc.sin(bullet.angle) * bullet.speed;
                if (bullet.side !== 'Bad') {
                    var mouseAngle = proc.atan2(proc.mouseY * yScale - fakeHeight / 2 - bullet.y, proc.mouseX * xScale - fakeWidth / 2 - bullet.x);
                    bullet.angle = mouseAngle;
                }
                break;
            case 'Waving':
                bullet.x += proc.cos(bullet.angle) * bullet.speed;
                bullet.y += proc.sin(bullet.angle) * bullet.speed;
                bullet.angle += proc.sin(bullet.life * 10 - 80) * 10;
                break;
            case 'Static':
                bullet.x += proc.cos(bullet.angle) * bullet.speed;
                bullet.y += proc.sin(bullet.angle) * bullet.speed;
                bullet.speed *= 0.9;
                break;
        }
        bullet.life += 1;
    };
    var moveBullets = function () {
        for (var i = 0; i < bullets.length; i++) {
            moveBullet(bullets[i]);
        }
    };
    var removeBullets = function () {
        for (var i = 0; i < bullets.length; i++) {
            var bullet = bullets[i];
            if (bullet.life >= projectiles[bullet.type].life) {
                bullet.dead = true;
            }
        }
        for (var i = bullets.length - 1; i >= 0; i--) {
            var bullet = bullets[i];
            if (bullet.dead) {
                bullets.splice(i, 1);
            }
        }
    };
    // } 
    // Collisions {
    var collidePlayers = function () {
        for (var i = 0; i < players.length; i++) {
            for (var j = i + 1; j < players.length; j++) {
                var player1 = players[i];
                var player2 = players[j];
                var player1Pos = getPlayerPos(player1);
                var player2Pos = getPlayerPos(player2);
                var moveDist = player1.radius + player2.radius - proc.dist(player1Pos.x, player1Pos.y, player2Pos.x, player2Pos.y);
                if (moveDist > 0) {
                    if (player1.side !== player2.side) {
                        player1.health -= player2.bodyDamage;
                        player2.health -= player1.bodyDamage;
                    }
                    var relativeAngle = proc.atan2(player2Pos.y - player1Pos.y, player2Pos.x - player1Pos.x);
                    if (player1.movement === 'Human') {
                        player2Pos.x += proc.cos(relativeAngle) * moveDist;
                        player2Pos.y += proc.sin(relativeAngle) * moveDist;
                    } else if (player2.movement === 'Human') {
                        player1Pos.x -= proc.cos(relativeAngle) * moveDist;
                        player1Pos.y -= proc.sin(relativeAngle) * moveDist;
                    } else {
                        var ratio = player1.radius * player1.radius / (player1.radius * player1.radius + player2.radius * player2.radius);
                        player1Pos.x -= proc.cos(relativeAngle) * moveDist * (1 - ratio);
                        player1Pos.y -= proc.sin(relativeAngle) * moveDist * (1 - ratio);
                        player2Pos.x += proc.cos(relativeAngle) * moveDist * (ratio);
                        player2Pos.y += proc.sin(relativeAngle) * moveDist * (ratio);
                    }
                    if (player1.movement !== 'Human') {
                        player1.angle = 180 + proc.atan2(player1Pos.y, player1Pos.x);
                        player1.distance = proc.dist(0, 0, player1Pos.x, player1Pos.y);
                    }
                    if (player2.movement !== 'Human') {
                        player2.angle = 180 + proc.atan2(player2Pos.y, player2Pos.x);
                        player2.distance = proc.dist(0, 0, player2Pos.x, player2Pos.y);
                    }
                }
            }
        }
    };
    var collideBulletPlayers = function () {
        for (var i = 0; i < bullets.length; i++) {
            for (var j = 0; j < players.length; j++) {
                var bullet = bullets[i];
                var player = players[j];
                if (player.dead) {
                    continue;
                }
                var playerPos = getPlayerPos(player);
                if (bullet.side === player.side) {
                    continue;
                }
                var Dist = bullet.radius + player.radius - proc.dist(bullet.x, bullet.y, playerPos.x, playerPos.y);
                if (Dist >= 0) {
                    if (bullet.side === 'Good') {
                        player.health -= projectiles[bullet.type].damage * bullet.damage * damageCoef;
                    } else {
                        player.health -= projectiles[bullet.type].damage * helper.difficulty / 100;
                    }
                    if (projectiles[bullet.type].movement !== 'Splat' & projectiles[bullet.type].movement !== 'Piercing' & !bullet.dead) {
                        projectiles[bullet.type].onDeath(player, bullet.damage);
                        bullet.dead = true;
                    }
                }
            }
        }
    };
    // }
    // }
    // Game {
    var superVignette = false;
    var currentWave = -1;
    var waveTimer = 0;
    var maxWaveTimer = 1000;
    var waves = [
        function () {
            spawnPlayers({
                weapon: -1,
                radius: 10,
                movement: 'Standard',
                movementSpeed: 1,
                maxHealth: helper.difficulty / 2,
                side: 'Bad',
                bodyDamage: helper.difficulty / 200
            }, 15);
        },
        function () {
            spawnPlayers({
                weapon: 0,
                radius: 10,
                movement: 'Spin',
                movementSpeed: 5,
                maxHealth: helper.difficulty,
                side: 'Bad',
                bodyDamage: helper.difficulty / 50
            }, 8);
        },
        function () {
            spawnPlayers({
                weapon: -1,
                radius: 12.5,
                movement: 'Spiral',
                movementSpeed: 4,
                maxHealth: helper.difficulty / 2,
                side: 'Bad',
                bodyDamage: helper.difficulty / 100
            }, 5);
        },
        function () {
            spawnPlayers({
                weapon: -1,
                radius: 12.5,
                movement: 'Standard',
                movementSpeed: 1,
                maxHealth: helper.difficulty,
                side: 'Bad',
                bodyDamage: helper.difficulty / 100
            }, 3);
        },
        function () {
            spawnPlayers({
                weapon: 0,
                radius: 10,
                movement: 'Dodge',
                movementSpeed: 5,
                maxHealth: helper.difficulty / 2,
                side: 'Bad',
                bodyDamage: helper.difficulty / 100
            }, 10);
        },
        function () {
            spawnPlayers({
                weapon: -1,
                radius: 25,
                movement: 'Boss',
                movementSpeed: 1,
                maxHealth: helper.difficulty * 10,
                side: 'Bad',
                bodyDamage: helper.difficulty / 200
            }, 1);
        },
    ];

    var message = [''];

    var gameButtons = [{
        name: 'Back',
        x: fakeWidth - 30,
        y: 30,
        radius: 25,
        requiredLevel: 0,
        description: 'Your game will not be saved, but you will keep the bits you earned.',
        onClick: function () {
            addNotif('Ended game early.');
            switchScene('Menu');
        }
    },];

    var shift = function () {
        proc.pushMatrix();
        proc.translate(fakeWidth / 2, fakeHeight / 2);
    };
    var unShift = function () {
        proc.popMatrix();
    };
    var darknessMask = function () {
        var res = 25;
        for (var k = 0; k <= fakeWidth * proc.sqrt(2) / 2 + 1; k += res) {
            proc.stroke(0, 0, 0, 255 - proc.constrain((superVignette ? 10000 : 30000) * 255 / k / k, 0, 255));
            proc.strokeWeight(res);
            proc.ellipse(0, 0, k * 2, k * 2);
        }
        proc.strokeWeight(helper.lineWidth);
    };
    var healthBar = function () {
        proc.noFill();
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
        proc.rect(5, 5, fakeWidth / 2, 20);
        proc.fill(helper.colorSchemes[helper.colorScheme]);
        proc.rect(5, 5, fakeWidth / 2 * players[0].health / players[0].maxHealth, 20);
        proc.fill(0, 0, 0);
        proc.textAlign(proc.LEFT, proc.TOP);
        proc.textSize(20);
        proc.text(proc.round(players[0].health / players[0].maxHealth * 100) + '%', 7.5, 5);
        proc.noFill();
    };
    var drawDroneHealth = function () {
        if (equippedDrones.length <= 0) {
            return;
        }
        proc.strokeWeight(5);
        for (var i = 1; i < equippedDrones.length + 1; i++) {
            proc.noFill();
            proc.stroke(helper.colorSchemes[helper.colorScheme], 100);
            proc.ellipse((i - 1) * 75 + 40, fakeHeight - 85, 50, 50);
            proc.stroke(helper.colorSchemes[helper.colorScheme]);
            var drone = players[i];
            if (drone.health > 0) {
                proc.arc((i - 1) * 75 + 40, fakeHeight - 85, 50, 50, -90, -90 + 360 * drone.health / drone.maxHealth);
            } else {
                proc.arc((i - 1) * 75 + 40, fakeHeight - 85, 50, 50, -90, -90 + 360 * drone.reviveTime / drone.maxReviveTime);
            }
            proc.fill(helper.colorSchemes[helper.colorScheme]);
            proc.textSize(25);
            proc.textAlign(proc.CENTER, proc.CENTER);
            proc.text(i, (i - 1) * 75 + 40, fakeHeight - 85);
        }
        proc.fill(helper.colorSchemes[helper.colorScheme]);
        proc.textSize(20);
        proc.textAlign(proc.CENTER, proc.CENTER);
        proc.text('Drones', equippedDrones.length / 2 * 75 + 2.5, fakeHeight - 130);
        proc.noFill();
    };
    var drawPower = function () {
        var power = powers[playerPower];
        if (playerPower !== 0) {
            proc.textSize(18);
            proc.textAlign(proc.RIGHT, proc.BOTTOM);
            proc.fill(playerPowerReload < power.loadTime ? proc.color(255, 0, 0) : helper.colorSchemes[helper.colorScheme], playerPowerReload < power.loadTime ? 150 : 255);

            if (playerPowerReload < power.loadTime) {
                proc.text(power.name + ': ' + proc.floor(playerPowerReload / power.loadTime * 100) + '% loaded.', fakeWidth - 5, fakeHeight - 30);
            } else {
                proc.text(power.name + ' is ready.', fakeWidth - 5, fakeHeight - 30);
            }

            proc.noFill();
        }
    };
    var drawStats = function () {
        proc.textAlign(proc.LEFT, proc.TOP);
        proc.fill(helper.colorSchemes[helper.colorScheme]);
        proc.textSize(25);
        proc.text(weapons[players[0].weapon].name, 10, 30);

        healthBar();

        drawPower();
    };
    var switchGuns = function () {
        for (var i = 0; i < weapons.length; i++) {
            if (keys[i] & dev) {
                players[0].weapon = i;
            }
        }
        if (proc.frameCount % 3 === 0 & dev) {
            if (keys.a) {
                players[0].weapon -= 1;
            }
            if (keys.d) {
                players[0].weapon += 1;
            }
        }
        players[0].weapon = proc.constrain(players[0].weapon, 0, weapons.length - 1);
    };
    var startGame = function () {
        smallDroneCount = 0;
        playerPowerReload = 0;
        helper.difficulty = helper.startingDifficulty;
        bullets.length = 0;
        fakeBits.length = 0;
        players.length = 0;
        hPlayer.health = hPlayer.maxHealth;
        players.push(Object.assign({}, hPlayer));
        for (var i = 0; i < shopDrones.length; i++) {
            if (shopDrones[i].used) {
                players.push(Object.assign({}, shopDrones[i]));
                players[players.length - 1].angle = proc.random(360);
            }
        }
        waveTimer = 1000;
        currentWave = 0;
    };
    var showMessage = function () {
        proc.fill(helper.colorSchemes[helper.colorScheme]);
        proc.textAlign(proc.LEFT, proc.BOTTOM);
        proc.textSize(18);
        proc.text(message[0], 5, fakeHeight - 30);
        proc.noFill();
    };
    var waveLimiter = false;
    var advanceWaves = function () {
        if (waveTimer > 0) {
            if (!this.__frameRate) {
                message = ['Wave ' + currentWave + '|Next in ' + proc.ceil(waveTimer) + ' frames.'];
            }
            else {
                message = ['Wave ' + currentWave + '|Next in ' + proc.ceil(waveTimer / this.__frameRate) + ' seconds.'];
            }
        } else {
            message = ['Wave ' + currentWave + '|Next wave ready.'];
        }
        if ((waveTimer <= 0 & !waveLimiter) || (players.length === equippedDrones.length + smallDroneCount + 1)) {
            furthestWave = proc.max(furthestWave, currentWave);
            waves[currentWave % waves.length]();
            waveTimer = maxWaveTimer;
            currentWave += 1;
            helper.difficulty *= 1.25;
        } else {
            waveTimer--;
        }
    };
    var game = function () {
        shift();

        drawBullets();
        drawPlayers();

        darknessMask();

        movePlayers();
        moveBullets();

        usePower();

        collidePlayers();
        collideBulletPlayers();

        removeBullets();
        removePlayers();
        healPlayers();

        drawFakeBits();
        moveFakeBits();
        removeFakeBits();

        unShift();

        drawStats();
        drawDroneHealth();

        showMessage();
        switchGuns();

        advanceWaves();
    };
    // }
    // Menu {
    var ascensionDisplay = function () {
        proc.fill(helper.colorSchemes[helper.colorScheme]);
        proc.textSize(15);
        proc.textAlign(proc.CENTER, proc.CENTER);
        proc.text('Ascension ' + ascensions, fakeWidth / 2, fakeHeight - 12.5);
    };
    var bottomBar = function () {
        if (scene === 'Story') {
            return;
        }
        displayBits();
        experienceBar();
        ascensionDisplay();
    };
    var secretButtonClicks = 0;
    var maxSecretButtonClicks = 50;
    var menuButtons = [{
        name: 'Battle',
        x: fakeWidth / 2,
        y: fakeHeight / 2,
        radius: 100,
        requiredLevel: 0,
        onClick: function () {
            switchScene('Game');
            startGame();
        }
    },
    {
        name: 'Shop',
        x: fakeWidth / 2 + proc.cos(180) * fakeWidth / 3,
        y: fakeHeight / 2 + proc.sin(180) * fakeHeight / 3,
        radius: 60,
        requiredLevel: 2,
        onClick: function () {
            switchScene('Shop');
        }
    },
    {
        name: 'Info',
        x: fakeWidth / 2 + proc.cos(0) * fakeWidth / 3,
        y: fakeHeight / 2 + proc.sin(0) * fakeHeight / 3,
        radius: 60,
        requiredLevel: 0,
        clicked: false,
        onClick: function () {
            switchScene('Info');
        }
    },
    {
        name: 'Ascend',
        x: fakeWidth / 2 + proc.cos(60) * fakeWidth / 3,
        y: fakeHeight / 2 + proc.sin(60) * fakeHeight / 3,
        radius: 60,
        requiredLevel: 0,
        onClick: function () {
            switchScene('Ascend');
        }
    },
    {
        name: 'Saving',
        x: fakeWidth / 2 + proc.cos(120) * fakeWidth / 3,
        y: fakeHeight / 2 + proc.sin(120) * fakeHeight / 3,
        radius: 60,
        requiredLevel: 0,
        onClick: function () {
            switchScene('Saving');
        }
    },
    ];
    var showDescription = function (description) {
        if (!description) {
            return;
        }
        proc.fill(0, 0, 0);
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
        proc.rect(0, 0, fakeWidth, 50);
        proc.fill(helper.colorSchemes[helper.colorScheme]);
        proc.textSize(15);
        proc.textAlign(proc.CENTER, proc.CENTER);
        proc.text(description, fakeWidth / 2, 25);
        proc.noFill();
    };
    var drawButton = function (button) {
        proc.noStroke();
        proc.fill(level < button.requiredLevel ? proc.color(255, 0, 0) : helper.colorSchemes[helper.colorScheme], 50);
        proc.ellipse(button.x, button.y, button.radius * 2, button.radius * 2);
        proc.strokeWeight(helper.lineWidth);
        proc.stroke(level < button.requiredLevel ? proc.color(255, 0, 0) : helper.colorSchemes[helper.colorScheme], level < button.requiredLevel ? 150 : 255);
        proc.noFill();
        helper.hexagon(button.x, button.y, proc.frameCount, helper.checkHover(button) ? button.radius * 2 : button.radius * 2.2);
        helper.hexagon(button.x, button.y, proc.frameCount, button.radius * 2);
        proc.fill(level < button.requiredLevel ? proc.color(255, 0, 0) : helper.colorSchemes[helper.colorScheme], level < button.requiredLevel ? 150 : 255);
        proc.textAlign(proc.CENTER, proc.CENTER);
        proc.textSize(button.radius / button.name.length * 2.75);
        if (level < button.requiredLevel) {
            proc.text(button.name, button.x, button.y - button.radius / 8);
            proc.fill(255, 0, 0);
            proc.textSize(button.radius / 4.5);
            proc.text('Level ' + button.requiredLevel + '\nrequired', button.x, button.y + button.radius / 2);
        } else {
            proc.text(button.name, button.x, button.y);
        }
        if (helper.checkHover(button)) {
            proc.cursor('pointer');
            showDescription(button.description);
        }
    };
    var drawButtons = function () {
        proc.cursor('default');
        for (var i = 0; i < buttons.length; i++) {
            drawButton(buttons[i]);
        }
    };
    var menu = function () {
        drawTitle('Data Defense');
        displayBits();
    };
    // }
    // Shop {
    // Gun selection {
    var currentGun = 0;
    var gunSelectButtons = [{
        name: 'Back',
        x: fakeWidth / 10,
        y: fakeHeight / 10,
        radius: 50,
        requiredLevel: 0,
        onClick: function () {
            switchScene('Shop');
        }
    },
    {
        name: 'Prev',
        x: fakeWidth / 12,
        y: fakeHeight / 2,
        radius: 40,
        requiredLevel: 0,
        onClick: function () {
            currentGun = helper.modulo(currentGun - 1, weapons.length);
        }
    },
    {
        name: 'Next',
        x: fakeWidth - fakeWidth / 12,
        y: fakeHeight / 2,
        radius: 40,
        requiredLevel: 0,
        onClick: function () {
            currentGun = helper.modulo(currentGun + 1, weapons.length);
        }
    },
    {
        name: 'Equip',
        x: fakeWidth / 2,
        y: fakeHeight - fakeHeight / 8,
        radius: 45,
        requiredLevel: 0,
        onClick: function () {
            if ((weapons[currentGun].owned & !weapons[currentGun].used) || currentGun === 0 || dev) {
                weapons[hPlayer.weapon].used = false;
                addNotif('Equipped ' + weapons[currentGun].name + '.');
                weapons[currentGun].used = true;
                hPlayer.weapon = currentGun;
            } else if (!weapons[currentGun].owned & currentGun !== 0) {
                addNotif('You do not own this gun.');
            } else if (weapons[currentGun].owned & currentGun !== 0 & weapons[currentGun].used) {
                addNotif('This weapon is used.');
            }
        }
    },
    {
        name: 'Upgrade',
        x: fakeWidth / 3,
        y: fakeHeight - fakeHeight / 8,
        radius: 45,
        requiredLevel: 0,
        onClick: function () {
            if ((bits >= upgradeCost(weapons[currentGun].level) & weapons[currentGun].owned) || dev) {
                bits -= upgradeCost(weapons[currentGun].level);
                weapons[currentGun].level += 1;
                weapons[currentGun].damageCoefficient *= 1.25;
                addNotif('Upgraded to level ' + weapons[currentGun].level + '.');
            }
        }
    },
    ];
    var gunTexts = function (gun) {
        proc.fill(helper.colorSchemes[helper.colorScheme]);
        proc.textAlign(proc.LEFT, proc.TOP);
        proc.textSize(25);
        proc.text(weapons[gun].name + ' T' + weapons[gun].level + '', fakeWidth / 6 + 5, fakeHeight / 4, fakeWidth * 2 / 3 - 10, fakeHeight / 2);
        proc.textSize(15);
        proc.text(weapons[gun].description, fakeWidth / 6 + 5, fakeHeight / 4 + 30, fakeWidth * 2 / 3 - 10, fakeHeight / 2);
        proc.textAlign(proc.RIGHT, proc.BOTTOM);
        proc.text('Gun #' + gun, fakeWidth / 6 + fakeWidth * 2 / 3 - 5, fakeHeight / 4 + fakeHeight / 2 - 5);

        proc.textAlign(proc.LEFT, proc.BOTTOM);
        proc.textSize(20);
        proc.text('Upgrade cost: ' + upgradeCost(weapons[gun].level) + ' bits', fakeWidth / 6 + 5, fakeHeight / 4 + fakeHeight / 2 - 5);
        proc.fill(0, 0, 0);
        gunSelectButtons[4].requiredLevel = (weapons[gun].level + 1);
    };
    var displayGun = function (gun) {
        proc.rect(fakeWidth / 6, fakeHeight / 4, fakeWidth * 2 / 3, fakeHeight / 2);
        proc.rect(fakeWidth / 6 - 5, fakeHeight / 4 - 5, fakeWidth * 2 / 3 + 10, fakeHeight / 2 + 10);

        proc.ellipse(fakeWidth / 2, fakeHeight / 2, 100, 100);
        drawWeapon(weapons[gun], fakeWidth / 2, fakeHeight / 2, 50, (proc.frameCount % 25) / 25);

        gunTexts(gun);

        if (weapons[gun].owned || dev) {
            if (hPlayer.weapon === gun) {
                gunSelectButtons[3].name = 'Equipped';
            } else if (weapons[gun].used) {
                gunSelectButtons[3].name = 'Used';
            } else {
                gunSelectButtons[3].name = 'Equip';
            }
        } else {
            gunSelectButtons[3].name = 'Locked';
            proc.fill(0, 0, 0, 150);
            proc.rect(fakeWidth / 6, fakeHeight / 4, fakeWidth * 2 / 3, fakeHeight / 2);
            proc.fill(helper.colorSchemes[helper.colorScheme]);
            proc.textAlign(proc.CENTER, proc.CENTER);
            proc.textSize(50);
            proc.text('LOCKED', fakeWidth / 2, fakeHeight / 2 + 100);
            proc.rect(fakeWidth / 2 - 22.5, fakeHeight / 2 + 10 - 20, 45, 40);

            //Lock
            proc.noFill();
            proc.stroke(helper.colorSchemes[helper.colorScheme]);
            proc.strokeWeight(8);
            proc.arc(fakeWidth / 2, fakeHeight / 2 - 20, 30, 30, 180, 360);
            proc.line(fakeWidth / 2 - 15, fakeHeight / 2 - 20, fakeWidth / 2 - 15, fakeHeight / 2 + 10 - 20);
            proc.line(fakeWidth / 2 + 15, fakeHeight / 2 - 20, fakeWidth / 2 + 15, fakeHeight / 2 + 10 - 20);
            proc.strokeWeight(helper.lineWidth);
            proc.fill(0, 0, 0);
            proc.ellipse(fakeWidth / 2, fakeHeight / 2 + 15, 15, 15);
            proc.strokeWeight(8);
            proc.stroke(0, 0, 0);
            proc.line(fakeWidth / 2, fakeHeight / 2 + 10, fakeWidth / 2, fakeHeight / 2 + 5);
            proc.stroke(helper.colorSchemes[helper.colorScheme]);
            proc.strokeWeight(helper.lineWidth);
        }
    };
    var gunSelect = function () {
        drawTitle('Guns');
        displayGun(currentGun);
        displayBits();
    };
    // }
    // Drone selection {
    // Drone weapon selection {
    var currentDrone = 0;
    var droneWeaponSelectButtons = [{
        name: 'Back',
        x: fakeWidth / 10,
        y: fakeHeight / 10,
        radius: 50,
        requiredLevel: 0,
        onClick: function () {
            switchScene('Drone Selection');
        }
    },];
    var weaponsPerRow = 10;
    var spacing = fakeWidth / weaponsPerRow;
    var ySpacing = fakeHeight / weaponsPerRow;
    var weaponSize = 15;
    var wrapPos = function (index) {
        return {
            x: index - proc.floor(index / weaponsPerRow) * weaponsPerRow,
            y: proc.floor(index / weaponsPerRow),
        };
    };
    var showWeapons = function () {
        proc.noFill();
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
        for (var i = 0; i < weapons.length; i++) {
            var weaponPos = wrapPos(i);
            var truePos = {
                x: weaponPos.x * spacing + spacing / 2,
                y: weaponPos.y * ySpacing + fakeHeight / 4,
            };
            if (weapons[i].owned) {
                proc.ellipse(truePos.x, truePos.y, weaponSize, weaponSize);
                proc.pushMatrix();
                proc.translate(truePos.x, truePos.y);
                proc.rotate(proc.frameCount);
                proc.translate(-truePos.x, -truePos.y);
                weapons[i].display(truePos.x + weaponSize / 2, truePos.y, weaponSize / 2, proc.frameCount % 50 / 50);
                proc.popMatrix();
            }
            proc.stroke(weapons[i].owned ? helper.colorSchemes[helper.colorScheme] : proc.color(255, 0, 0));
            helper.hexagon(truePos.x, truePos.y, proc.frameCount, weaponSize * 4);
            proc.stroke(helper.colorSchemes[helper.colorScheme]);
        }
        proc.textAlign(proc.CENTER, proc.CENTER);
        proc.textSize(15);
        proc.fill(helper.colorSchemes[helper.colorScheme]);
        for (var i = 0; i < shopDrones.length; i++) {
            var shopDrone = shopDrones[i];
            var droneWeapon = shopDrone.weapon;
            if (shopDrone.used & droneWeapon !== 0) {
                var weaponPos = wrapPos(droneWeapon);
                var truePos = {
                    x: weaponPos.x * spacing + spacing / 2,
                    y: weaponPos.y * ySpacing + fakeHeight / 4,
                };
                proc.text(shopDrone.logo, truePos.x, truePos.y + weaponSize * 15 / 8);
            }
        }
        var playerWrapPos = wrapPos(hPlayer.weapon);
        var truePos = {
            x: playerWrapPos.x * spacing + spacing / 2,
            y: playerWrapPos.y * ySpacing + fakeHeight / 4,
        };
        proc.textSize(12);
        proc.text('Player', truePos.x, truePos.y + weaponSize * 15 / 8);
        proc.textSize(25);
        proc.textAlign(proc.CENTER, proc.CENTER);
        proc.fill(helper.colorSchemes[helper.colorScheme]);
        proc.text('Choosing weapon for ' + shopDrones[currentDrone].name + '.', fakeWidth / 2, fakeHeight * 7 / 8);
    };
    var droneWeaponSelect = function () {
        showWeapons();
        drawTitle('Weapon');
    };
    // }
    // Main {
    var droneSelectButtons = [{
        name: 'Back',
        x: fakeWidth / 10,
        y: fakeHeight / 10,
        radius: 50,
        requiredLevel: 0,
        onClick: function () {
            switchScene('Shop');
        }
    },
    {
        name: 'Prev',
        x: fakeWidth / 12,
        y: fakeHeight / 2,
        radius: 40,
        requiredLevel: 0,
        onClick: function () {
            currentDrone = helper.modulo(currentDrone - 1, shopDrones.length);
        }
    },
    {
        name: 'Next',
        x: fakeWidth - fakeWidth / 12,
        y: fakeHeight / 2,
        radius: 40,
        requiredLevel: 0,
        onClick: function () {
            currentDrone = helper.modulo(currentDrone + 1, shopDrones.length);
        }
    },
    {
        name: 'Equip',
        x: fakeWidth / 2,
        y: fakeHeight - fakeHeight / 8,
        radius: 45,
        requiredLevel: 0,
        onClick: function () {
            if (shopDrones[currentDrone].used) {
                for (var i = 0; i < equippedDrones.length; i++) {

                    if (shopDrones[equippedDrones[i]].name === shopDrones[currentDrone].name) {
                        equippedDrones.splice(i, 1);
                        break;
                    }
                }
                weapons[shopDrones[currentDrone].weapon].used = false;
                shopDrones[currentDrone].used = false;
                addNotif('Unequipped ' + shopDrones[currentDrone].name + '.');
            } else if (equippedDrones.length < maxDroneCount & shopDrones[currentDrone].owned || dev) {
                equippedDrones.push(currentDrone);
                shopDrones[currentDrone].used = true;
                addNotif('Equipped ' + shopDrones[currentDrone].name + '.');
            } else if (equippedDrones.length > maxDroneCount) {
                addNotif('You have equipped the maximum number of drones.');
            } else if (!shopDrones[currentDrone].owned) {
                addNotif('You do not own this drone.');
            }
        }
    },
    {
        name: 'Upgrade',
        x: fakeWidth / 3,
        y: fakeHeight - fakeHeight / 8,
        radius: 45,
        requiredLevel: 0,
        onClick: function () {
            if ((bits >= upgradeCost(shopDrones[currentDrone].level) & shopDrones[currentDrone].owned) || dev) {
                bits -= upgradeCost(shopDrones[currentDrone].level);
                shopDrones[currentDrone].level += 1;
                shopDrones[currentDrone].maxHealth *= 1.25;
                shopDrones[currentDrone].health *= 1.25;
                shopDrones[currentDrone].bodyDamage *= 1.25;
            }
        }
    },
    {
        name: 'Weapon',
        x: fakeWidth * 2 / 3,
        y: fakeHeight - fakeHeight / 8,
        radius: 45,
        requiredLevel: 0,
        onClick: function () {
            if (shopDrones[currentDrone].used) {
                switchScene('Drone Weapon Selection');
            } else {
                addNotif('Equip this drone to assign a weapon.');
            }
        }
    },
    ];
    var droneLockedText = function (displayedDrone) {
        proc.fill(0, 0, 0, 150);
        proc.rect(fakeWidth / 6, fakeHeight / 4, fakeWidth * 2 / 3, fakeHeight / 2);
        proc.fill(helper.colorSchemes[helper.colorScheme]);
        proc.textAlign(proc.CENTER, proc.CENTER);
        proc.textSize(50);
        proc.text('LOCKED', fakeWidth / 2, fakeHeight / 2 + 100);
        proc.rect(fakeWidth / 2 - 22.5, fakeHeight / 2 + 10 - 20, 45, 40);

        //Lock
        proc.noFill();
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
        proc.strokeWeight(8);
        proc.arc(fakeWidth / 2, fakeHeight / 2 - 20, 30, 30, 180, 360);
        proc.line(fakeWidth / 2 - 15, fakeHeight / 2 - 20, fakeWidth / 2 - 15, fakeHeight / 2 + 10 - 20);
        proc.line(fakeWidth / 2 + 15, fakeHeight / 2 - 20, fakeWidth / 2 + 15, fakeHeight / 2 + 10 - 20);
        proc.strokeWeight(helper.lineWidth);
        proc.fill(0, 0, 0);
        proc.ellipse(fakeWidth / 2, fakeHeight / 2 + 15, 15, 15);
        proc.strokeWeight(8);
        proc.stroke(0, 0, 0);
        proc.line(fakeWidth / 2, fakeHeight / 2 + 10, fakeWidth / 2, fakeHeight / 2 + 5);
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
        proc.strokeWeight(helper.lineWidth);
        droneSelectButtons[3].name = 'Locked';
    };
    var drawCurrentDrone = function (displayedDrone) {
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
        proc.noFill();
        proc.pushMatrix();
        proc.translate(fakeWidth / 2, fakeHeight / 2.5 + 5);
        proc.scale(1.5);
        proc.rotate(proc.frameCount);
        drawDrone(displayedDrone);
        proc.translate(-fakeWidth / 2, -fakeHeight / 2.5 + 5);
        proc.popMatrix();
        proc.textSize(25);
        proc.textAlign(proc.CENTER, proc.CENTER);
        proc.text(displayedDrone.name + ' T' + displayedDrone.level, fakeWidth / 2, fakeHeight / 2 + 50);
        proc.textSize(15);
        proc.text(displayedDrone.description, fakeWidth / 2, fakeHeight * 2 / 3);

        proc.textAlign(proc.RIGHT, proc.BOTTOM);
        proc.text('Drone #' + currentDrone, fakeWidth / 6 + fakeWidth * 2 / 3 - 5, fakeHeight / 4 + fakeHeight / 2 - 5);

        proc.textAlign(proc.LEFT, proc.BOTTOM);

        proc.text('Upgrade cost: ' + upgradeCost(displayedDrone.level) + ' bits', fakeWidth / 6 + 5, fakeHeight / 4 + fakeHeight / 2 - 5);
        proc.fill(0, 0, 0);
        droneSelectButtons[4].requiredLevel = (displayedDrone.level + 1);
    };
    var droneBox = function () {
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
        proc.noFill();
        proc.rect(fakeWidth / 6, fakeHeight / 4, fakeWidth * 2 / 3, fakeHeight / 2);
        proc.rect(fakeWidth / 6 - 5, fakeHeight / 4 - 5, fakeWidth * 2 / 3 + 10, fakeHeight / 2 + 10);
        helper.hexagon(fakeWidth / 2, fakeHeight / 2.5 + 5, 0, fakeWidth / 3);
        helper.hexagon(fakeWidth / 2, fakeHeight / 2.5 + 5, 30, fakeWidth / 3.5);
    };
    var displayEquippedDrones = function () {
        proc.noFill();
        proc.strokeWeight(helper.lineWidth);
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
        proc.rect(5, fakeHeight * 4 / 5, fakeWidth / 5, fakeHeight / 8);
        proc.textAlign(proc.LEFT, proc.TOP);
        proc.textSize(12.5);
        proc.fill(helper.colorSchemes[helper.colorScheme]);
        proc.text('Equipped Drones:', 10, fakeHeight * 4 / 5 + 5, fakeWidth / 5 - 10, fakeHeight / 8 - 10);
        proc.noFill();
        proc.textAlign(proc.CENTER, proc.CENTER);
        proc.textSize(15);
        var droneTexts = '';
        for (var i = 0; i < equippedDrones.length; i++) {
            if (i < equippedDrones.length - 1) {
                droneTexts += shopDrones[equippedDrones[i]].logo + ',';
            } else {
                droneTexts += shopDrones[equippedDrones[i]].logo;
            }
        }
        proc.text(droneTexts, 5 + fakeWidth / 10, fakeHeight * 4 / 5 + 5 + fakeHeight / 16);
    };
    var displayCurrentDrone = function () {
        var displayedDrone = shopDrones[currentDrone];

        droneBox();
        drawCurrentDrone(displayedDrone);
        displayEquippedDrones();

        if (!displayedDrone.owned & !dev) {
            droneLockedText(displayedDrone);
        } else {
            if (displayedDrone.used) {
                droneSelectButtons[3].name = 'Unequip';
            } else {
                droneSelectButtons[3].name = 'Equip';
            }
        }
    };
    var droneSelect = function () {
        displayCurrentDrone();
        drawTitle('Drones');
    };
    // }
    // }
    // Color selection {
    var currentColor = helper.colorScheme;
    var colorSelectButtons = [{
        name: 'Back',
        x: fakeWidth / 10,
        y: fakeHeight / 10,
        radius: 50,
        requiredLevel: 0,
        onClick: function () {
            switchScene('Shop');
        }
    },
    {
        name: 'Select',
        x: fakeWidth / 2,
        y: fakeHeight - fakeHeight / 8,
        radius: 50,
        requiredLevel: 0,
        onClick: function () {
            helper.colorScheme = currentColor;
            addNotif('Color scheme changed.');
        }
    },
    {
        name: 'Prev',
        x: fakeWidth / 12,
        y: fakeHeight / 2,
        radius: 40,
        requiredLevel: 0,
        onClick: function () {
            currentColor = helper.modulo(currentColor - 1, helper.colorSchemes.length);
        }
    },
    {
        name: 'Next',
        x: fakeWidth - fakeWidth / 12,
        y: fakeHeight / 2,
        radius: 40,
        requiredLevel: 0,
        onClick: function () {
            currentColor = helper.modulo(currentColor + 1, helper.colorSchemes.length);
        }
    },
    ];

    var displayCurrentColor = function () {
        proc.fill(0, 0, 0);
        proc.rect(fakeWidth / 4, fakeHeight / 4, fakeWidth / 2, fakeHeight / 2);
        helper.hexagon(fakeWidth / 2, fakeHeight / 2, 0, fakeWidth / 2);
        helper.hexagon(fakeWidth / 2, fakeHeight / 2, 30, fakeWidth / 2);

        proc.stroke(helper.colorSchemes[currentColor]);
        helper.hexagon(fakeWidth / 2, fakeHeight / 2, proc.frameCount, fakeWidth / 4);
        helper.hexagon(fakeWidth / 2, fakeHeight / 2, -proc.frameCount, fakeWidth / 4);

        proc.fill(helper.colorSchemes[currentColor]);
        proc.textAlign(proc.CENTER, proc.CENTER);
        proc.textSize(20);
        proc.text(colors[currentColor].name, fakeWidth / 2, fakeHeight / 2);

        proc.stroke(helper.colorSchemes[helper.colorScheme]);
        proc.fill(0, 0, 0);
    };
    var colorSelect = function () {
        displayCurrentColor();
        colorSelectButtons[1].requiredLevel = currentColor;
        drawTitle('Colors');
        displayBits();
    };
    // }
    // Power selection {
    var powerSelectButtons = [{
        name: 'Back',
        x: fakeWidth / 10,
        y: fakeHeight / 10,
        radius: 50,
        requiredLevel: 0,
        onClick: function () {
            switchScene('Shop');
        }
    },
    {
        name: 'Prev',
        x: fakeWidth / 12,
        y: fakeHeight / 2,
        radius: 40,
        requiredLevel: 0,
        onClick: function () {
            playerPower = helper.modulo(playerPower - 1, powers.length);
        }
    },
    {
        name: 'Next',
        x: fakeWidth - fakeWidth / 12,
        y: fakeHeight / 2,
        radius: 40,
        requiredLevel: 0,
        onClick: function () {
            playerPower = helper.modulo(playerPower + 1, powers.length);
        }
    },
    ];
    var displayPower = function () {
        var power = powers[playerPower];
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
        proc.noFill();
        proc.rect(fakeWidth / 6, fakeHeight / 3, fakeWidth * 2 / 3, fakeHeight / 3);
        proc.rect(fakeWidth / 6 - 5, fakeHeight / 3 - 5, fakeWidth * 2 / 3 + 10, fakeHeight / 3 + 10);
        proc.fill(helper.colorSchemes[helper.colorScheme]);
        proc.textSize(20);
        proc.textAlign(proc.LEFT, proc.TOP);
        proc.text('You have equipped:\n|' + power.name + '|\n' + 'Recharge time: ' + power.loadTime + ' frames.\n' + power.description + '\nPower #' + playerPower, fakeWidth / 6 + 5, fakeHeight / 3 + 5, fakeWidth * 2 / 3 - 10, fakeHeight / 3 - 10);
        proc.line(0, fakeHeight * 3 / 4, fakeWidth, fakeHeight * 3 / 4);
        proc.textAlign(proc.CENTER, proc.CENTER);
        proc.textSize(18);
        proc.text('Power damage scales with helper.difficulty.\nReload is displayed in the bottom right.\nRight click to use powers\n(if on mobile, release your finger).', fakeWidth / 2, fakeHeight * 6 / 7);
    };
    var powerSelect = function () {
        drawTitle('Powers');
        displayPower();
    };
    //}
    // Player upgrades {
    var upgradeLevels = {
        'Health': 0,
        'Agility': 0,
        'Body dmg': 0,
        'Regen': 0,
    };
    var playerUpgradeButtons = [{
        name: 'Back',
        x: fakeWidth / 10,
        y: fakeHeight / 10,
        radius: 50,
        requiredLevel: 0,
        onClick: function () {
            switchScene('Shop');
        }
    },
    {
        name: 'Health',
        x: fakeWidth / 3,
        y: fakeHeight / 3,
        radius: 50,
        requiredLevel: 0,
        onClick: function () {
            if (bits >= upgradeCost(upgradeLevels.Health)) {
                bits -= upgradeCost(upgradeLevels.Health);
                upgradeLevels.Health += 1;
                hPlayer.maxHealth *= 1.25;
                addNotif('Health increased by 25%.');
            }
        }
    },
    {
        name: 'Agility',
        x: fakeWidth / 3,
        y: fakeHeight / 2,
        radius: 50,
        requiredLevel: 0,
        onClick: function () {
            if (bits >= upgradeCost(upgradeLevels.Agility)) {
                bits -= upgradeCost(upgradeLevels.Agility);
                upgradeLevels.Agility += 1;
                hPlayer.movementSpeed += 0.25;
                addNotif('Turn speed increased by 0.25.');
            }
        }
    },
    {
        name: 'Body dmg',
        x: fakeWidth / 3,
        y: fakeHeight * 2 / 3,
        radius: 50,
        requiredLevel: 0,
        onClick: function () {
            if (bits >= upgradeCost(upgradeLevels['Body dmg'])) {
                bits -= upgradeCost(upgradeLevels['Body dmg']);
                upgradeLevels['Body dmg'] += 1;
                hPlayer.bodyDamage += 0.25;
                addNotif('Body damage increased by 0.25.');
            }
        }
    },
    {
        name: 'Regen',
        x: fakeWidth / 3,
        y: fakeHeight * 5 / 6,
        radius: 50,
        requiredLevel: 0,
        onClick: function () {
            if (bits >= upgradeCost(upgradeLevels.Regen)) {
                bits -= upgradeCost(upgradeLevels.Regen);
                upgradeLevels.Regen += 1;
                hPlayer.healthRegen += 0.005;
                addNotif('Health regeneration increased by 0.005.');
            }
        }
    },
    ];
    var drawUpgrades = function () {
        proc.fill(helper.colorSchemes[helper.colorScheme]);
        proc.textSize(25);
        proc.textAlign(proc.LEFT, proc.CENTER);
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
        for (var i = 1; i < playerUpgradeButtons.length; i++) {
            var upgradeLevel = upgradeLevels[playerUpgradeButtons[i].name];
            proc.text(upgradeCost(upgradeLevel) + ' bits to upgrade.', fakeWidth / 2 - 25, fakeHeight / 6 + fakeHeight / 6 * i);
            proc.text('Level ' + upgradeLevel, 10, fakeHeight / 6 + fakeHeight / 6 * i);
            if (i !== playerUpgradeButtons.length - 1) {
                proc.line(0, fakeHeight / 6 + fakeHeight / 6 * i + 50, fakeWidth, fakeHeight / 6 + fakeHeight / 6 * i + 50);
            }
            playerUpgradeButtons[i].requiredLevel = upgradeLevel;
        }
        proc.noFill();
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
        proc.rect(0, fakeHeight / 6 + 50, fakeWidth, fakeHeight * 2 / 3);
    };
    var playerUpgrade = function () {
        drawUpgrades();
        drawTitle('Upgrade');
        displayBits();
    };
    // }
    // Chests {

    // Display purchased chest {
    var itemQueue = [];
    var addItem = function (itemCount, itemType) {
        switchScene('Display Chest');
        if (itemType === 'Weapon') {
            for (var i = 0; i < itemCount; i++) {
                itemQueue.push({
                    type: itemType,
                    index: proc.floor(proc.random(weapons.length)),
                });
            }
        } else if (itemType === 'Drone') {
            for (var i = 0; i < itemCount; i++) {
                itemQueue.push({
                    type: itemType,
                    index: proc.floor(proc.random(shopDrones.length)),
                });
            }
        }
    };

    var displayCurrentItem = function () {
        if (itemQueue.length === 0) {
            return;
        }
        var currentItem = itemQueue[0];
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
        helper.hexagon(fakeWidth / 2, fakeHeight / 2, proc.frameCount, fakeWidth / 2);
        helper.hexagon(fakeWidth / 2, fakeHeight / 2, -proc.frameCount, fakeWidth / 2);
        helper.hexagon(fakeWidth / 2, fakeHeight / 2, proc.frameCount + 30, fakeWidth / 2);
        helper.hexagon(fakeWidth / 2, fakeHeight / 2, -proc.frameCount + 30, fakeWidth / 2);

        proc.textAlign(proc.CENTER, proc.CENTER);
        if (currentItem.type === 'Weapon') {
            var displayedWeapon = weapons[currentItem.index];
            proc.ellipse(fakeWidth / 2, fakeHeight / 2, fakeWidth / 8, fakeHeight / 8);
            displayedWeapon.display(fakeWidth / 2 + fakeWidth / 16, fakeHeight / 2, fakeWidth / 16, (proc.frameCount % 25) / 25);
            proc.textSize(25);
            proc.fill(helper.colorSchemes[helper.colorScheme]);
            proc.text(displayedWeapon.name, fakeWidth / 2, fakeHeight / 4.5);
            proc.textSize(25);
            if (displayedWeapon.owned) {
                proc.text('(Duplicate)', fakeWidth / 2, fakeHeight / 2 + 75);
            } else {
                proc.text('New!', fakeWidth / 2, fakeHeight / 2 + 75);
            }
        } else if (currentItem.type === 'Drone') {
            var displayedDrone = shopDrones[currentItem.index];
            proc.pushMatrix();
            proc.translate(fakeWidth / 2, fakeHeight / 2);
            proc.rotate(proc.frameCount);
            proc.scale(2);
            drawDrone(displayedDrone);
            proc.scale(1 / 2);
            proc.rotate(-proc.frameCount);
            proc.translate(-fakeWidth / 2, -fakeHeight / 2);
            proc.textSize(25);
            proc.fill(helper.colorSchemes[helper.colorScheme]);
            proc.text(displayedDrone.name, fakeWidth / 2, fakeHeight / 4.5);
            proc.textSize(25);
            if (displayedDrone.owned) {
                proc.text('(Duplicate)', fakeWidth / 2, fakeHeight / 2 + 75);
            } else {
                proc.text('New!', fakeWidth / 2, fakeHeight / 2 + 75);
            }
        }

        proc.textSize(17.5);
        proc.text((itemQueue.length - 1) + ' items left.', fakeWidth / 2, fakeHeight - 40);
        proc.fill(0, 0, 0);
    };
    var nextItem = function () {
        if (itemQueue.length === 1) {
            switchScene('Chests');
        }
        if (itemQueue[0].type === 'Weapon') {
            if (!weapons[itemQueue[0].index].owned) {
                weapons[itemQueue[0].index].owned = true;
                gunsUnlocked++;
            }
        } else if (!shopDrones[itemQueue[0].index].owned) {
            shopDrones[itemQueue[0].index].owned = true;
            dronesUnlocked++;
        }
        itemQueue.splice(0, 1);
    };

    var autoNext = false;

    var displayChestButtons = [{
        name: 'Next',
        x: fakeWidth / 2,
        y: fakeHeight * 5 / 6,
        radius: 50,
        requiredLevel: 0,
        onClick: function () {
            nextItem();
        }
    },];

    var automaticNext = function () {
        if (autoNext & itemQueue.length >= 1) {
            nextItem();
        }
    };

    var displayChest = function () {
        automaticNext();
        drawTitle('Chest');
        displayCurrentItem();
    };

    // }

    // Chest shop {
    var chestContents = {
        'Small': 1,
        'Medium': 5,
        'Large': 15,
    };
    var chestCosts = {
        'Small': 200,
        'Medium': 600,
        'Large': 1500,
    };
    var chestButtons = [{
        name: 'Back',
        x: fakeWidth / 10,
        y: fakeHeight / 10,
        radius: 50,
        requiredLevel: 0,
        onClick: function () {
            switchScene('Shop');
        }
    },
    {
        name: 'Small',
        x: fakeWidth / 6,
        y: fakeHeight / 3,
        radius: 75,
        requiredLevel: 2,
        onClick: function () {
            if (bits >= chestCosts.Small) {
                bits -= chestCosts.Small;
                addItem(1, 'Weapon');
            }
        }
    },
    {
        name: 'Medium',
        x: fakeWidth / 2,
        y: fakeHeight / 3,
        radius: 75,
        requiredLevel: 4,
        onClick: function () {
            if (bits >= chestCosts.Medium) {
                bits -= chestCosts.Medium;
                addItem(5, 'Weapon');
            }
        }
    },
    {
        name: 'Large',
        x: fakeWidth * 5 / 6,
        y: fakeHeight / 3,
        radius: 75,
        requiredLevel: 7,
        onClick: function () {
            if (bits >= chestCosts.Large) {
                bits -= chestCosts.Large;
                addItem(15, 'Weapon');
            }
        }
    },
    {
        name: 'Small',
        x: fakeWidth / 6,
        y: fakeHeight * 2 / 3,
        radius: 75,
        requiredLevel: 2,
        onClick: function () {
            if (bits >= chestCosts.Small) {
                bits -= chestCosts.Small;
                addItem(1, 'Drone');
            }
        }
    },
    {
        name: 'Medium',
        x: fakeWidth / 2,
        y: fakeHeight * 2 / 3,
        radius: 75,
        requiredLevel: 4,
        onClick: function () {
            if (bits >= chestCosts.Medium) {
                bits -= chestCosts.Medium;
                addItem(5, 'Drone');
            }
        }
    },
    {
        name: 'Large',
        x: fakeWidth * 5 / 6,
        y: fakeHeight * 2 / 3,
        radius: 75,
        requiredLevel: 7,
        onClick: function () {
            if (bits >= chestCosts.Large) {
                bits -= chestCosts.Large;
                addItem(15, 'Drone');
            }
        }
    },
    ];
    var drawChestLabels = function () {
        proc.fill(helper.colorSchemes[helper.colorScheme]);
        proc.textSize(20);
        proc.textAlign(proc.CENTER, proc.CENTER);
        for (var i = 1; i < chestButtons.length; i++) {
            var chestButton = chestButtons[i];
            proc.text('Cost: ' + chestCosts[chestButton.name] + ' bits\n+' + chestContents[chestButton.name] + (i > 3 ? ' drone(s)' : ' gun(s)'), chestButton.x, chestButton.y + chestButton.radius + 20);
        }
        proc.fill(255, 0, 0);
        proc.text('Warning: You may get duplicates.', fakeWidth / 2, fakeHeight * 11 / 12);
        proc.noFill();
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
        proc.line(0, fakeHeight / 5, fakeWidth, fakeHeight / 5);
        proc.line(0, fakeHeight / 2 + 25, fakeWidth, fakeHeight / 2 + 25);
        proc.line(0, fakeHeight / 2 + fakeHeight / 3 + 25, fakeWidth, fakeHeight / 2 + fakeHeight / 3 + 25);

    };
    var drawUnlocked = function () {
        proc.fill(helper.colorSchemes[helper.colorScheme]);
        proc.textSize(15);
        proc.textAlign(proc.RIGHT, proc.TOP);
        proc.text('Guns: ' + gunsUnlocked + '/' + weapons.length + '\nDrones: ' + dronesUnlocked + '/' + shopDrones.length, fakeWidth - 5, 5);
        proc.fill(0, 0, 0);
    };
    var chests = function () {
        drawChestLabels();
        drawTitle('Chests');
        drawUnlocked();
    };
    // }
    // }
    var shopButtons = [{
        name: 'Back',
        x: fakeWidth / 10,
        y: fakeHeight / 10,
        radius: 50,
        requiredLevel: 0,
        onClick: function () {
            switchScene('Menu');
        }
    },
    {
        name: 'Guns',
        x: fakeWidth / 2,
        y: fakeHeight / 2,
        radius: 75,
        requiredLevel: 3,
        onClick: function () {
            switchScene('Gun Selection');
        }
    },
    {
        name: 'Drones',
        x: fakeWidth / 2 - 75 * 3 / 2,
        y: fakeHeight / 2 - 75 * proc.sqrt(3) / 2,
        radius: 75,
        requiredLevel: 5,
        onClick: function () {
            switchScene('Drone Selection');
        }
    },
    {
        name: 'Powers',
        x: fakeWidth / 2 + 75 * 3 / 2,
        y: fakeHeight / 2 - 75 * proc.sqrt(3) / 2,
        radius: 75,
        requiredLevel: 6,
        onClick: function () {
            switchScene('Power Selection');
        }
    },
    {
        name: 'Chests',
        x: fakeWidth / 2 + 75 * 3 / 2,
        y: fakeHeight / 2 + 75 * proc.sqrt(3) / 2,
        radius: 75,
        requiredLevel: 4,
        onClick: function () {
            switchScene('Chests');
        }
    },
    {
        name: 'Colors',
        x: fakeWidth / 2 - 75 * 3 / 2,
        y: fakeHeight / 2 + 75 * proc.sqrt(3) / 2,
        radius: 75,
        requiredLevel: 2,
        onClick: function () {
            switchScene('Color Selection');
        }
    },
    {
        name: 'Button',
        x: fakeWidth / 2,
        y: fakeHeight / 2 - 75 * proc.sqrt(3),
        radius: 75,
        requiredLevel: 0,
        description: 'This button is purely for aesthetic purposes. Or is it?',
        onClick: function () {
            if (secretButtonClicks >= maxSecretButtonClicks) {
                this.description = 'You have permanently gained access to the secret market.\nAccess stays after ascensions.';
                switchScene('Secret Market');
                this.name = 'Market';
                return;
            }
            if (bits < 200) {
                addNotif('It costs 200 bits to click the button.');
            } else {
                bits -= 200;
                secretButtonClicks++;
                this.description = secretButtonClicks + '/' + maxSecretButtonClicks + ' clicks. Clicking the button costs 200 bits.';
            }
        }
    },
    {
        name: 'Upgrade',
        x: fakeWidth / 2,
        y: fakeHeight / 2 + 75 * proc.sqrt(3),
        radius: 75,
        requiredLevel: 2,
        onClick: function () {
            switchScene('Player Upgrade');
        }
    },
    ];
    var drawShopTitle = function () {
        proc.textSize(75);
        proc.textAlign(proc.CENTER, proc.CENTER);
        proc.fill(helper.colorSchemes[helper.colorScheme]);

        hackerText('Shop', fakeWidth / 2, 50);

        proc.noFill();
    };
    var shop = function () {
        drawTitle('Shop');
        displayBits();
    };
    // }
    // Dev {
    var devBits = function () {
        if (dev) {
            bits = proc.pow(10, 10000);
        }
    };
    var devDisplay = function () {
        if (!dev || proc.mouseY * yScale > fakeWidth / 16) {
            return;
        }
        var boxPos = [5, 5];
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
        proc.fill(0, 0, 0, 100);
        proc.rect(boxPos[0], boxPos[1], fakeWidth - 10, fakeWidth / 8);
        proc.fill(helper.colorSchemes[helper.colorScheme]);
        proc.textSize(15);
        proc.textAlign(proc.LEFT, proc.TOP);
        proc.text('Dev stats: Framerate: ' + proc.floor(this.__frameRate * 10) / 10 + ' | Cumulative bits: ' + cumulativeBits + ' | MousePos: ' + proc.floor(proc.mouseX * xScale) + ', ' + proc.floor(proc.mouseY * yScale), boxPos[0] + 5, boxPos[1] + 5, fakeWidth - 10, fakeWidth / 8 - 10);
    };
    // }
    // Info {
    // Main {
    var infoButtons = [{
        name: 'Back',
        x: fakeWidth / 10,
        y: fakeHeight / 10,
        radius: 50,
        requiredLevel: 0,
        onClick: function () {
            switchScene('Menu');
        }
    },
    {
        name: 'Credits',
        x: fakeWidth / 4,
        y: fakeHeight / 2,
        radius: 60,
        requiredLevel: 0,
        clicked: false,
        onClick: function () {
            if (!this.clicked) {
                addNotif('Thank you for checking out the credits!\nHave 25 free bits!');
                this.clicked = true;
            } else {
                addNotif('Thanks for looking at the credits. :)');
            }
            switchScene('Credits');
        }
    },
    {
        name: 'Viruses',
        x: fakeWidth * 3 / 4,
        y: fakeHeight / 2,
        radius: 60,
        requiredLevel: 0,
        description: 'Where you can see your viruses, which make the game harder.\nYou can only get rid of viruses through ascensions.',
        onClick: function () {
            switchScene('Viruses');
        }
    },
    {
        name: 'Awards',
        x: fakeWidth / 2,
        y: fakeHeight / 2,
        radius: 60,
        requiredLevel: 0,
        description: '',
        onClick: function () {
            switchScene('Awards');
        }
    },
    {
        name: 'Guide',
        x: fakeWidth / 2,
        y: fakeHeight * 3 / 4,
        radius: 60,
        requiredLevel: 0,
        description: '',
        onClick: function () {
            switchScene('Guide');
        }
    },
    {
        name: 'Stats',
        x: fakeWidth / 4,
        y: fakeHeight * 3 / 4,
        radius: 60,
        requiredLevel: 0,
        description: '',
        onClick: function () {
            switchScene('Stats');
        }
    },
    {
        name: 'Winners',
        x: fakeWidth * 3 / 4,
        y: fakeHeight * 3 / 4,
        radius: 60,
        requiredLevel: 0,
        description: 'A list of the few that beat the game.',
        onClick: function () {
            switchScene('Winners');
        }
    },
    ];
    var info = function () {
        drawTitle('Info');
    };
    // }
    // Virus {
    // Particles {
    var particles = [];
    var displayParticles = function () {
        proc.stroke(helper.colorSchemes[helper.colorScheme], 150);
        for (var i = 0; i < particles.length; i++) {
            var particle = particles[i];
            helper.hexagon(particle.x, particle.y, proc.frameCount, 12.5);

            particle.x += particle.vx;
            particle.y += particle.vy;
        }
        for (var i = particles.length - 1; i >= 0; i--) {
            var particle = particles[i];
            if (particle.x !== proc.constrain(particle.x, 0, fakeWidth) || particle.y !== proc.constrain(particle.y, 0, fakeHeight)) {
                particles.splice(i, 1);
            }
        }
    };
    var addParticles = function () {
        for (var i = 0; i < 3; i++) {
            var r = proc.random(360);
            particles.push({
                x: proc.mouseX * xScale,
                y: proc.mouseY * yScale,
                vx: proc.cos(r) * 5,
                vy: proc.sin(r) * 5,
            });
        }
    };
    // }
    // Viruses {
    var virusButtons = [{
        name: 'Back',
        x: fakeWidth / 10,
        y: fakeHeight / 10,
        radius: 50,
        requiredLevel: 0,
        onClick: function () {
            switchScene('Info');
        }
    },];
    var viruses = [{
        name: "Reciprocal",
        description: "Inverts everything's color for a minute.",
        timer: 0,
        does: function () {
            this.timer++;
            if (this.timer < 2500) {
                filter(INVERT);
            } else {
                this.timer = 0;
                this.infected = false;
            }
        }
    },
    {
        name: "Downpour",
        description: "Makes your mouse spray laggy particles that block your vision.",
        does: function () {
            if (proc.frameCount % 2 === 0) {
                addParticles();
            }
        }
    },
    {
        name: "Epilepsy",
        description: "The color scheme changes every frame.",
        does: function () {
            helper.colorScheme = proc.floor(proc.random(helper.colorSchemes.length));
        }
    },
    {
        name: "Thief",
        description: "This virus steals bits at random. Does not affect cumulative bits.",
        does: function () {
            if (proc.random(2000) <= 1) {
                bits -= proc.min(5 * (ascensions + 1), bits);
            }
        }
    },
    {
        name: "Cross-eyed",
        description: "Constantly blurs and unblurs the screen.",
        does: function () {
            if (proc.frameCount % 100 <= 15) {
                filter(BLUR, 1.2);
            }
        }
    },
    {
        name: "Obesity",
        description: "Lines become extremely thick.",
        does: function () {
            helper.lineWidth = 2.5;
        }
    },
    {
        name: "Feline",
        description: "An invisible cat plays around with your mouse, making it hard to see.",
        does: function () {
            if (proc.frameCount % 5 >= 1) {
                proc.cursor('none');
            }
        }
    },
    {
        name: "Minimalist",
        description: "Your backgrounds get removed.",
        does: function () {
            showBackgrounds = false;
        }
    },
    {
        name: "Triangulation",
        description: "Hexagons look like triangles.",
        does: function () {
            hexagon = function (x, y, r, d) {
                for (var k = r; k < r + 360; k += 120) {
                    proc.line(x + proc.cos(k) * d / 2, y + proc.sin(k) * d / 2, x + proc.cos(k + 120) * d / 2, y + proc.sin(k + 120) * d / 2);
                }
            };
        }
    },
    {
        name: "Circle",
        description: "A pet circle moves around, obstructing your vision.",
        does: function () {
            proc.fill(0, 0, 0);
            proc.noStroke();
            proc.ellipse((2 * proc.noise(proc.frameCount / 100) - 0.5) * fakeWidth, (2 * proc.noise(50, -proc.frameCount / 100) - 0.5) * fakeHeight, 100, 100);
            proc.noFill();
        }
    },
    {
        name: "Depressant",
        description: "School appropriate insults flash everywhere on the screen.",
        does: function () {
            var insults = ["You're bad at this game!", "You seriously haven't ascended yet?", "Bruh.", "I don't like you.", "You're just like B in the story.", "Get better!", "Beat the game already!", "Go subscribe, you orange!", "Lemon."];
            proc.fill(helper.colorSchemes[helper.colorScheme]);
            proc.textSize(15);
            proc.textAlign(proc.CENTER, proc.CENTER);
            proc.text(insults[proc.floor(proc.random(insults.length))], proc.random(fakeWidth), proc.random(fakeHeight));
        }
    },
    {
        name: "Archaic Technology",
        description: "The game speed (framerate) is manually decreased by 25%.",
        does: function () {
            proc.frameRate(45);
        }
    },
    {
        name: "George",
        description: "You got lucky with this one! This virus gives you free bits.",
        does: function () {
            if (proc.random(2500) <= 1) {
                bits += ascensions + 1;
            }
        }
    },
    {
        name: "Stun grenade",
        description: "Transitions take three times as long.",
        does: function () {
            transitionSpeed = 0.015;
        }
    },
    {
        name: "Gerald Durrell",
        description: "This author creates vignettes (stories, not darkness).",
        does: function () {
            superVignette = true;
        }
    },
    {
        name: "Creator Advertisements",
        description: "Ocassionally takes you to the credits page.",
        does: function () {
            if (proc.random(80000) <= 1) {
                switchScene('Credits');
            }
        }
    },
    {
        name: "Mika Nelson",
        description: "Prints Mika Nelson's profile link every once in a while.",
        does: function () {
            if (proc.random(8000) <= 1) {
                proc.println('Support Mika Nelson! Go to\nhttps://www.khanacademy.org/profile/kaid_967737028094599212633448/projects');
            }
        }
    },
    {
        name: "Iltg",
        description: "You constantly get notified about losing the game.",
        does: function () {
            var theGameNotifs = ['1434', 'You lost the game!', 'Airplane!', 'I lost the game.', 'Grape.', '_ ____ ___ ____', 'Uranium', '6*239', 'Go to line 1434 in the code.', '59A in hexadecimal'];
            addNotif(theGameNotifs[proc.floor(proc.random(theGameNotifs.length))]);
        }
    },
    {
        name: "Download",
        description: "This virus gives you a free kB before deleting itself!",
        does: function () {
            kiloBytes += 1;
            this.infected = false;
            addNotif('You got a free kB!');
        }
    },
    {
        name: "Anti-virus",
        description: "For the price of all your bits, some viruses might get removed.",
        does: function () {
            bits = 0;
            this.infected = false;
            for (var k = 0; k < 3; k++) {
                viruses[proc.floor(proc.random(viruses.length))].infected = false;
            }
        }
    },
    {
        name: "Night mode",
        description: "The screen has a slight yellowish tint.",
        does: function () {
            proc.fill(200, 150, 0, 100);
            proc.noStroke();
            proc.rect(0, 0, fakeWidth, fakeHeight);
        }
    },
    {
        name: "Menu",
        description: "A menu pops up when you right click (disables powers!)",
        does: function () {
            enableContextMenu();
        }
    },
    {
        name: "Font",
        description: "Your font is replaced with an uglier one.",
        does: function () {
            proc.textFont(proc.createFont('fantasy'));
        }
    },
    {
        name: "Nope",
        description: "A huge X covers your screen.",
        does: function () {
            proc.stroke(helper.colorSchemes[helper.colorScheme]);
            proc.line(0, 0, fakeWidth, fakeHeight);
            proc.line(fakeWidth, 0, 0, fakeHeight);
        }
    },
    ];
    var applyViruses = function () {
        for (var i = 0; i < viruses.length; i++) {
            if (viruses[i].infected) {
                viruses[i].does();
            }
        }
    };
    var virusFrequency = 25000;
    var infectViruses = function () {
        if (proc.random(virusFrequency) < ascensions + 1 & infected) {
            var virus = viruses[proc.floor(proc.random(viruses.length))];
            if (virus.infected) {
                return;
            }
            addNotif('Your game has been infected by ' + virus.name + '!\nAscend to remove this virus.');
            virus.infected = true;
        }
    };
    var showInfectedViruses = function () {
        proc.stroke(255, 0, 0);
        for (var i = 0; i < viruses.length; i++) {
            var virusPos = wrapPos(i);
            var truePos = {
                x: virusPos.x * spacing + spacing / 2,
                y: virusPos.y * ySpacing + fakeHeight / 4,
            };
            if (viruses[i].infected) {
                helper.hexagon(truePos.x, truePos.y, proc.frameCount, 62.5);
            }
        }
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
    };
    var showViruses = function () {
        drawTitle('Viruses');
        showInfectedViruses();
    };
    // }
    // }
    // Awards {
    var achievements = [{
        name: 'Reboot',
        requirement: function () {
            return ascensions >= 1;
        },
        description: 'Ascend once.',
    },
    {
        name: 'Factory reset',
        requirement: function () {
            return ascensions >= 4;
        },
        description: 'Ascend four times.',
    },
    {
        name: 'Reassembly',
        requirement: function () {
            return ascensions >= 10;
        },
        description: 'Ascend ten times.',
    },
    {
        name: 'Rich',
        requirement: function () {
            return bits >= 1000;
        },
        description: 'Have 1000 bits (not cumulative).',
    },
    {
        name: 'Wealthy',
        requirement: function () {
            return bits >= 20000;
        },
        description: 'Have 20000 bits (not cumulative).',
    },
    {
        name: 'Millionaire',
        requirement: function () {
            return bits >= 1000000;
        },
        description: 'Have 1000000 bits (not cumulative).',
    },
    {
        name: 'Perseverance',
        requirement: function () {
            return currentWave > 15;
        },
        description: 'Survive wave 15.',
    },
    {
        name: 'Endurance',
        requirement: function () {
            return currentWave > 40;
        },
        description: 'Survive wave 40.',
    },
    {
        name: 'Unstoppable',
        requirement: function () {
            return currentWave > 100;
        },
        description: 'Survive wave 100.',
    },
    {
        name: 'Hidden',
        requirement: function () {
            return secretButtonClicks >= maxSecretButtonClicks;
        },
        description: 'Unlock the secret market. Wait, what market?',
    },
    {
        name: 'Quatre',
        requirement: function () {
            return level >= 4;
        },
        description: 'Make it to level 4.',
    },
    {
        name: 'Huit',
        requirement: function () {
            return level >= 8;
        },
        description: 'Make it to level 8.',
    },
    {
        name: 'Dix',
        requirement: function () {
            return level >= 10;
        },
        description: 'Make it to level 10.',
    },
    {
        name: 'Fighter',
        requirement: function () {
            return scene === 'Game';
        },
        description: 'Start your first battle.',
    },
    {
        name: 'Armed',
        requirement: function () {
            return gunsUnlocked >= 10;
        },
        description: 'Unlock 10 weapons.',
    },
    {
        name: 'Artillery',
        requirement: function () {
            return gunsUnlocked >= weapons.length;
        },
        description: 'Unlock all weapons.',
    },
    {
        name: 'Drone enthusiast',
        requirement: function () {
            return dronesUnlocked >= 10;
        },
        description: 'Unlock 10 drones.',
    },
    {
        name: 'Airport',
        requirement: function () {
            return dronesUnlocked >= shopDrones.length;
        },
        description: 'Unlock all drones.',
    },
    {
        name: 'Makers',
        requirement: function () {
            return scene === 'Credits';
        },
        description: 'Check out the credits page.',
    },
    {
        name: 'Confetti',
        requirement: function () {
            return particles.length >= 40;
        },
        description: 'Have 40 mouse particles simultaneously on the screen.',
    },
    {
        name: 'Party',
        requirement: function () {
            return particles.length >= 200;
        },
        description: 'Have 200 mouse particles simultaneously on the screen.',
    },
    {
        name: 'Diagnostic',
        requirement: function () {
            return scene === 'Viruses';
        },
        description: 'See what viruses plague you.',
    },
    {
        name: 'Literary analysis',
        requirement: function () {
            return ascensions >= storyTexts.length - 1;
        },
        description: 'Finish reading all the stories.',
    },
    {
        name: 'Curiousity',
        requirement: function () {
            return secretButtonClicks > 0;
        },
        description: 'Click the mysterious button.',
    },
    {
        name: 'Stylize',
        requirement: function () {
            return helper.colorScheme !== 0;
        },
        description: 'Choose a new color scheme.',
    },
    {
        name: 'Midas',
        requirement: function () {
            return bitMult > 1;
        },
        description: 'Upgrade your bit multiplier.',
    },
    {
        name: 'Ruthless',
        requirement: function () {
            return damageCoef > 1;
        },
        description: 'Upgrade your damage multiplier.',
    },
    {
        name: 'Advanced',
        requirement: function () {
            return experienceGain > 1;
        },
        description: 'Upgrade your experience gain.',
    },
    {
        name: 'Hangar',
        requirement: function () {
            return maxDroneCount > 1;
        },
        description: 'Purchase a drone slot.',
    },
    {
        name: 'Droner',
        requirement: function () {
            return maxDroneCount >= 4;
        },
        description: 'Have 4 drone slots.',
    },
    {
        name: 'Datum',
        requirement: function () {
            return kiloBytes > 0;
        },
        description: 'Own a kB.',
    },
    {
        name: 'Data',
        requirement: function () {
            return kiloBytes >= 10;
        },
        description: 'Own 10 kB.',
    },
    {
        name: 'Demi',
        requirement: function () {
            return proc.millis() + timeElapsed >= 1000 * 60 * 30;
        },
        description: 'Play the game for half an hour.',
    },
    {
        name: 'Bicenturion',
        requirement: function () {
            return proc.millis() + timeElapsed >= 1000 * 60 * 100;
        },
        description: 'Play the game for 200 minutes.',
    },
    {
        name: 'Grinder',
        requirement: function () {
            return proc.millis() + timeElapsed >= 1000 * 60 * 60 * 24;
        },
        description: 'Play the game for a day.',
    },
    {
        name: 'Mice',
        requirement: function () {
            return mouseClicks > 100;
        },
        description: 'Click 100 times.',
    },
    {
        name: 'Arthritis',
        requirement: function () {
            return mouseClicks > 500;
        },
        description: 'Click 500 times.',
    },
    {
        name: 'Carpal tunnel',
        requirement: function () {
            return mouseClicks > 2500;
        },
        description: 'Click 2500 times.',
    },
    ];
    var unlockedAchievements = 0;
    var awardsButtons = [{
        name: 'Back',
        x: fakeWidth / 10,
        y: fakeHeight / 10,
        radius: 50,
        requiredLevel: 0,
        onClick: function () {
            switchScene('Info');
        }
    },];
    var showEarnedAwards = function () {
        for (var i = 0; i < achievements.length; i++) {
            var awardPos = wrapPos(i);
            var truePos = {
                x: awardPos.x * spacing + spacing / 2,
                y: awardPos.y * ySpacing + fakeHeight / 4,
            };
            if (achievements[i].completed) {
                proc.stroke(helper.colorSchemes[helper.colorScheme]);
            } else {
                proc.stroke(255, 0, 0, 100);
            }
            helper.hexagon(truePos.x, truePos.y, proc.frameCount, 62.5);
            helper.hexagon(truePos.x, truePos.y, proc.frameCount, 57.5);
            helper.hexagon(truePos.x, truePos.y, proc.frameCount, 52.5);
        }
    };
    var awards = function () {
        drawTitle('Awards');
        showEarnedAwards();
    };
    var checkAwards = function () {
        for (var i = 0; i < achievements.length; i++) {
            var award = achievements[i];
            if (award.completed) {
                continue;
            }
            if (award.requirement()) {
                award.completed = true;
                unlockedAchievements++;
                addNotif('Achievement completed: ' + award.name + '!\n25 bits awarded. Total achievements: ' + unlockedAchievements + '/' + achievements.length);
                awardsButtons[i + 1].description = achievements[i].name + ':\n' + achievements[i].description;
                bits += 25;
                cumulativeBits += 25;
            }
        }
    };
    // }
    // Credits {
    var creditsButtons = [{
        name: 'Back',
        x: fakeWidth / 10,
        y: fakeHeight / 10,
        radius: 50,
        requiredLevel: 0,
        onClick: function () {
            switchScene('Info');
        }
    },];
    var credits = function () {
        drawTitle('Credits');
        proc.textSize(20);
        proc.textAlign(proc.CENTER, proc.CENTER);
        proc.fill(helper.colorSchemes[helper.colorScheme]);
        proc.text('ThriftyPiano\nSub: tinyurl.com/sub2Thrifty\n\nmango.\nSub: tinyurl.com/sub2mango\n\nmika.nelson\nProjects: tinyurl.com/mnprojects\n\nSmall thanks to \nChoco, HAMBURGER RiDER, x.asper,\nCaptain Argon, and more.', fakeWidth / 2, fakeHeight / 2 + 37.5);
        proc.fill(0, 0, 0);
    };
    // }
    // Guide {
    var currentBook = 'Main';
    var guideButtons = [{
        name: 'Back',
        x: fakeWidth / 10,
        y: fakeHeight / 10,
        radius: 50,
        requiredLevel: 0,
        onClick: function () {
            switchScene('Info');
        }
    },
    {
        name: 'Main',
        x: fakeWidth / 10,
        y: fakeHeight * 7 / 8,
        radius: 37.5,
        requiredLevel: 0,
        onClick: function () {
            currentBook = 'Main';
        }
    },
    {
        name: 'Battle',
        x: fakeWidth * 3 / 10,
        y: fakeHeight * 7 / 8,
        radius: 37.5,
        requiredLevel: 0,
        onClick: function () {
            currentBook = 'Battle';
        }
    },
    {
        name: 'Shop',
        x: fakeWidth * 5 / 10,
        y: fakeHeight * 7 / 8,
        radius: 37.5,
        requiredLevel: 0,
        onClick: function () {
            currentBook = 'Shop';
        }
    },
    {
        name: 'Ascend',
        x: fakeWidth * 7 / 10,
        y: fakeHeight * 7 / 8,
        radius: 37.5,
        requiredLevel: 0,
        onClick: function () {
            currentBook = 'Ascend';
        }
    },
    {
        name: 'Tips',
        x: fakeWidth * 9 / 10,
        y: fakeHeight * 7 / 8,
        radius: 37.5,
        requiredLevel: 0,
        onClick: function () {
            currentBook = 'Tips';
        }
    },
    ];
    var guideBook = {
        'Main': 'The goal of this game is to defeat enemies for bits. After unlocking the shop, you can use bits to buy weapons, drones, and upgrade your player. You can also change your color scheme. After you play for a while, you will unlock powers, which allow you to beat waves easier. If you are on hard mode, you will encounter viruses, which make the game harder to play. After fulfilling the ascension requirments, you can ascend. Ascending resets the game (removing your viruses in the process), and converts your bits to kB. You can use these to buy ascension upgrades and eventually beat the game. For more information, click the buttons below. To learn more about ascensions, visit the ascension page. Remember to check out the credits!',
        'Battle': 'Note that you cannot move. Your turret stays fixed in the center. Use your mouse to turn and click to shoot. After you unlock powers, right click to use them. Enemies come in regularly spaced waves (or once you defeat the current wave). If you let the enemies come too close, they will deal higher amounts of damage, especially if they have spread-based weapons or body damage. Killing enemies gives you bits. The longer your survive, the more difficult the waves. You will also earn more bits as the helper.difficulty increases. Purchase drones and new weapons to help you survive longer.',
        'Shop': 'The shop unlocks at level 2. If you are not at level 2 yet, play a few battles. In the shop, you can buy weapons, which come in chests of three sizes. Larger chests are better deals than smaller ones. You can also buy drones, which come in chests too. In the weapon selection screen, you can equip and upgrade weapons. In the drone selection screen, you can equip and upgrade drones. You can also assign weapons to them by clicking "Weapon." Drones may not share weapons with each other or the player. You can also change your color scheme for free! After you unlock powers, you can also use them for free. You can also upgrade your player for bits. This is why the turret turns so slowly initially (you can upgrade your agility). The mysterious button has no purpose (or does it?).',
        'Ascend': 'After you pass a certain level, you can ascend. To ascend, you need to have unlocked every gun and drone! When you ascend, the entire game resets, but you get awarded with kB. kB are used to purchase ascension upgrades, which last forever. It is fairly similar to ascensions in Cookie Clicker. Remember: when you ascend, you will lose almost everything. Do not ascend unless you are ready. However, I recommend ascending as soon as possible. You may regret it initially, but the game will become easier fairly fast. If you are on hard mode, ascending increases your virus frequency, so watch out!',
        'Tips': 'Ascend early. Use easier waves to heal (you do not need to beat them instantly). Check out the credits. Multiple low-cost upgrades are better than one expensive one. Never hoard your bits. Spend them as you earn them. Never leave the game unattended (go to a different tab if you want to pause for a while). Otherwise, you will come back to find your game completely infested with viruses. Drones are incredibly valuable. Play easy mode if it is your first time playing. Try dev mode to familiarize yourself with the game.',
    };
    var displayCurrentBook = function () {
        proc.textAlign(proc.LEFT, proc.TOP);
        proc.textSize(15);
        proc.fill(helper.colorSchemes[helper.colorScheme]);
        proc.text(currentBook + ':\n' + guideBook[currentBook], 25, fakeHeight / 5, fakeWidth - 50, fakeHeight * 2 / 3);
        proc.noFill();
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
        proc.rect(10, fakeHeight / 5 - 10, fakeWidth - 20, fakeHeight * 0.6);
    };
    var guide = function () {
        drawTitle('Guide');
        displayCurrentBook();
    };
    // }
    // Stats {
    var statsButtons = [{
        name: 'Back',
        x: fakeWidth / 10,
        y: fakeHeight / 10,
        radius: 50,
        requiredLevel: 0,
        onClick: function () {
            switchScene('Info');
        }
    },];
    var showStatistics = function () {
        proc.textSize(15);
        proc.textAlign(proc.LEFT, proc.TOP);

    };
    var statistics = {
        'Bits': function () {
            return bits;
        },
        'Cumulative bits': function () {
            return cumulativeBits;
        },
        'Kilobytes': function () {
            return kiloBytes;
        },
        'Ascensions': function () {
            return ascensions;
        },
        'Viruses': function () {
            var virusCount = 0;
            for (var i = 0; i < viruses.length; i++) {
                if (viruses[i].infected) {
                    virusCount += 1;
                }
            }
            return virusCount;
        },
        'Weapons': function () {
            return gunsUnlocked + '/' + weapons.length;
        },
        'Drones': function () {
            return dronesUnlocked + '/' + shopDrones.length;
        },
        'Level': function () {
            return level;
        },
        'Awards': function () {
            return unlockedAchievements + '/' + achievements.length;
        },
        'Time played': function () {
            return proc.floor((proc.millis() + timeElapsed) / 60000) + ' minutes or ' + proc.floor((proc.millis() + timeElapsed) / 60000 / 60 * 10) / 10 + ' hours.';
        },
        'Mouse clicks': function () {
            return mouseClicks;
        },
        'Furthest wave': function () {
            return furthestWave;
        },
    };
    var stats = function () {
        var statsText = '';
        for (var i in statistics) {
            var functionText = statistics[i]();
            statsText += i + ': ' + functionText + '\n';
        }
        drawTitle('Stats');
        proc.textAlign(proc.LEFT, proc.TOP);
        proc.textSize(15);
        proc.fill(helper.colorSchemes[helper.colorScheme]);
        proc.text(statsText, 25, fakeHeight / 5, fakeWidth - 50, fakeHeight * 2 / 3);
        proc.noFill();
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
        proc.rect(10, fakeHeight / 5 - 10, fakeWidth - 20, fakeHeight * 0.6);
    };
    // }
    // Winners {
    var winnersButtons = [{
        name: 'Back',
        x: fakeWidth / 10,
        y: fakeHeight / 10,
        radius: 50,
        requiredLevel: 0,
        onClick: function () {
            switchScene('Info');
        }
    },];
    var won = ['Animator101: "Subscribe to Animator101! https://www.khanacademy.org/computer-programming/-/6305847543906304"', 'Electric Dolphin: "Remember: Eat breakfast, lunch, and dinner"', 'macraerandall: "I won! FINALLY. it took me upwards of 38 hours."', 'Gilded: "I love procrastinating :D - Oct 24 2024 (Took 13 Hours)"', 'SnowyMountain: "IS THAT HYPERPIGMENTATION"', 'Nathl Macmc: "that\'s a problem for future me to deal with"'];
    var showWinners = function () {
        var winnersText = '';
        for (var i = 0; i < won.length; i++) {
            winnersText += won[i];
            winnersText += '\n';
        }
        proc.textAlign(proc.LEFT, proc.TOP);
        proc.textSize(15);
        proc.fill(helper.colorSchemes[helper.colorScheme]);
        proc.text(winnersText, 25, fakeHeight / 5, fakeWidth - 50, fakeHeight * 2 / 3);
        proc.noFill();
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
        proc.rect(10, fakeHeight / 5 - 10, fakeWidth - 20, fakeHeight * 0.6);
    };
    var winners = function () {
        drawTitle('Winners');
        showWinners();
    };
    // }
    // }
    // Initialization {
    var initAwards = function () {
        for (var i = 0; i < achievements.length; i++) {
            achievements[i].completed = false;
        }
    };
    var initViruses = function () {
        proc.textFont(proc.createFont('monospace'));
        proc.frameRate(58);
        superVignette = false;
        transitionSpeed = 0.05;
        for (var i = 0; i < viruses.length; i++) {
            viruses[i].infected = false;
        }
        showBackgrounds = true;
        helper.lineWidth = 1;
        proc.disableContextMenu();
        hexagon = function (x, y, r, d) {
            for (var k = r; k < r + 360; k += 60) {
                proc.line(x + proc.cos(k) * d / 2, y + proc.sin(k) * d / 2, x + proc.cos(k + 60) * d / 2, y + proc.sin(k + 60) * d / 2);
            }
        };
    };
    var initVirusButtons = function () {
        for (var i = 0; i < viruses.length; i++) {
            var virusPos = wrapPos(i);
            var truePos = {
                x: virusPos.x * spacing + spacing / 2,
                y: virusPos.y * ySpacing + fakeHeight / 4,
            };
            var virusName = viruses[i].name;
            virusButtons.push({
                name: virusName.substring(0, 4),
                x: truePos.x,
                y: truePos.y,
                radius: 25,
                requiredLevel: 0,
                description: viruses[i].name + ':\n' + viruses[i].description,
            });
        }
    };
    var initAwardsButtons = function () {
        for (var i = 0; i < achievements.length; i++) {
            var awardPos = wrapPos(i);
            var truePos = {
                x: awardPos.x * spacing + spacing / 2,
                y: awardPos.y * ySpacing + fakeHeight / 4,
            };
            var awardName = achievements[i].name;
            awardsButtons.push({
                name: awardName.substring(0, 4),
                x: truePos.x,
                y: truePos.y,
                radius: 20,
                requiredLevel: 0,
                description: awardName + ':\n?????',
            });
        }
    };
    var initDWSB = function () {
        for (var i = 0; i < weapons.length; i++) {
            var weaponPos = wrapPos(i);
            var truePos = {
                x: weaponPos.x * spacing + spacing / 2,
                y: weaponPos.y * ySpacing + fakeHeight / 4,
            };
            droneWeaponSelectButtons.push({
                name: i,
                x: truePos.x,
                y: truePos.y,
                radius: weaponSize * 3 / 2,
                requiredLevel: 0,
            });
        }
    };
    var initWeapons = function () {
        for (var i = 0; i < weapons.length; i++) {
            weapons[i].owned = false;
            weapons[i].damageCoefficient = 1;
            weapons[i].level = 1;
            weapons[i].used = false;
        }
        weapons[0].owned = true;
        weapons[2].owned = true;
        weapons[2].used = true;
    };
    var initColors = function () {
        for (var i = 0; i < colors.length; i++) {
            helper.colorSchemes.push(colors[i].col);
        }
    };
    var initWeaponImages = function () {
        for (var i = 0; i < weapons.length; i++) {
            var weapon = weapons[i];
            var imSize = weaponImageRes * weaponImageScale;
            proc.background(0, 0);
            proc.stroke(helper.colorSchemes[helper.colorScheme]);
            proc.fill(0, 0, 0);
            weapon.display(fakeWidth / 2, fakeHeight / 2, weaponImageRes, 1);
            weapon.imageDisplay = proc.get(fakeWidth / 2 - imSize / 2, fakeHeight / 2 - imSize / 2, imSize, imSize);
        }
    };
    var initProjectileImages = function () {
        for (var i = 0; i < projectiles.length; i++) {
            var bullet = projectiles[i];
            var imSize = bulletImageRes * bulletImageScale;
            proc.background(0, 0);
            proc.stroke(helper.colorSchemes[helper.colorScheme]);
            proc.fill(0, 0, 0);
            bullet.display(fakeWidth / 2, fakeHeight / 2, bulletImageRes);
            bullet.imageDisplay = proc.get(fakeWidth / 2 - imSize / 2, fakeHeight / 2 - imSize / 2, imSize, imSize);
        }
    };
    var init = function () {
        var loadTime = proc.millis();
        switchScene('Warning');
        initDWSB();
        initWeapons();
        initColors();
        initViruses();
        initVirusButtons();
        initWeaponImages();
        initProjectileImages();
        initAwards();
        initAwardsButtons();
        addNotif('Done loading. Took ' + (proc.millis() - loadTime) + ' milliseconds.');
    };
    init();
    // }
    // Ascend {
    // Ascension {
    var resetGame = function () {
        notifs.length = 0;
        playerPower = 0;
        initWeapons();
        initViruses();
        level = 1;
        maxExperience = 100;
        experience = 0;
        kiloBytes += proc.floor(cumulativeBits / 8000);
        bits = startingBits;
        hPlayer = {
            weapon: 2,
            angle: 0,
            distance: 0,
            radius: 12.5,
            movement: 'Human',
            movementSpeed: 1,
            health: 10000,
            maxHealth: 10000,
            healthRegen: 0,
            reload: 0,
            side: 'Good',
            dead: false,
            bodyDamage: 0,
        };
        equippedDrones.length = 0;
        for (var i = 0; i < shopDrones.length; i++) {
            var shopDrone = shopDrones[i];
            shopDrone.owned = false;
            shopDrone.used = false;
            shopDrone.maxHealth /= proc.pow(1.25, shopDrone.level);
            shopDrone.health /= proc.pow(1.25, shopDrone.level);
            shopDrone.bodyDamage /= proc.pow(1.25, shopDrone.level);
            shopDrone.level = 0;
            shopDrone.weapon = 0;
        }
        upgradeLevels = {
            'Health': 0,
            'Agility': 0,
            'Body dmg': 0,
            'Regen': 0,
        };
        helper.colorScheme = 0;
        dronesUnlocked = 0;
        gunsUnlocked = 2;
        cumulativeBits = 0;
        switchScene('Story');
        current = 0;
        displayedStoryText = '';
        if (ascensions === 0) {
            if (dev) {
                storyButtons.splice(0, 1);
                storyButtons[0].x = fakeWidth / 2;
            } else {
                storyButtons.splice(1, 1);
                storyButtons[0].x = fakeWidth / 2;
            }
        }
        ascensions += 1;
    };
    var checkAscension = function () {
        for (var i = 0; i < weapons.length; i++) {
            if (!weapons[i].owned) {
                return false;
            }
        }
        for (var i = 0; i < shopDrones.length; i++) {
            if (!shopDrones[i].owned) {
                return false;
            }
        }
        if (level < 7) {
            return false;
        }
        return true;
    };
    var ascendButtons = [{
        name: 'Back',
        x: fakeWidth / 10,
        y: fakeHeight / 10,
        radius: 50,
        requiredLevel: 0,
        onClick: function () {
            switchScene('Menu');
        }
    },
    {
        name: 'Ascend',
        x: fakeWidth / 2,
        y: fakeHeight * 5 / 6,
        radius: 50,
        requiredLevel: 7,
        description: 'Are you sure you want to reset the game?',
        onClick: function () {
            if (!checkAscension() & !dev) {
                addNotif('You have not fulfilled the ascension requirements.');
                return;
            } else {
                addNotif('Converting ' + cumulativeBits + ' bits into ' + proc.floor(cumulativeBits / 8000) + ' kB.');
                notifications();
                startRedification = true;
                redification = 0;
            }
        }
    },
    {
        name: 'Upgrades',
        x: fakeWidth * 3 / 4,
        y: fakeHeight * 5 / 6,
        radius: 50,
        requiredLevel: 0,
        description: 'Permanent upgrades that last through ascensions.',
        onClick: function () {
            switchScene('Ascension Upgrades');
        }
    },
    {
        name: 'Button',
        x: fakeWidth / 4,
        y: fakeHeight * 5 / 6,
        radius: 50,
        requiredLevel: 0,
        description: 'This button does nothing.',
        onClick: function () {
            addNotif('This button is purely for aesthetic purposes.');
        }
    },
    ];
    var ascensionRequirements = 'Note: You will lose everything but your ascension upgrades. You need to unlock every drone and gun to ascend, and be at least Level 7. Every 8000 bits earned will convert into a kilobyte upon ascension. All viruses will be cleared after ascending, although they become more common as you ascend more.';
    var ascensionWarning = function () {
        proc.textSize(15);
        proc.textAlign(proc.LEFT, proc.TOP);
        proc.fill(helper.colorSchemes[helper.colorScheme]);
        proc.text(ascensionRequirements + '\n\nTotal bits earned: ' + cumulativeBits + ' bit(s).\nKilobytes gained upon ascension: ' + proc.floor(cumulativeBits / 8000) + ' kB.\n\nGuns unlocked: ' + gunsUnlocked + '/' + weapons.length + '\nDrones unlocked: ' + dronesUnlocked + '/' + shopDrones.length, 10, fakeHeight / 4, fakeWidth - 20, fakeHeight / 2.5);
        proc.noFill();
        proc.stroke(255, 0, 0);
        proc.rect(5, fakeHeight / 4 - 5, fakeWidth - 10, fakeHeight / 2.5);
    };
    var buttonAura = function () {
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
        for (var i = 0; i < 5; i++) {
            helper.hexagon(fakeWidth / 2, fakeHeight * 5 / 6, proc.frameCount + i * 30 / 4, proc.sin(proc.frameCount + i * 72) * 25 + 150);
        }
    };
    var ascend = function () {
        drawTitle('Ascension');
        ascensionWarning();
        buttonAura();
    };
    // }
    // Redification {
    var redify = function () {
        if (startRedification) {
            for (var i = 0; i < fakeWidth; i++) {
                if (proc.random(1) > 0.8) {
                    proc.set(i, redification, proc.color(255, 0, 0));
                }
            }
            redification += 1;
            if (redification >= fakeHeight) {
                startRedification = false;
                resetGame();
            }
        }
    };
    // }
    // Ascension Upgrades {
    var aUpgradeLevels = {};
    var ascensionUpgradeButtons = [{
        name: 'Back',
        x: fakeWidth / 10,
        y: fakeHeight / 10,
        radius: 50,
        requiredLevel: 0,
        onClick: function () {
            switchScene('Ascend');
        },
        updateDesc: function () {

        }
    },
    {
        name: 'Bit mult',
        x: fakeWidth / 2,
        y: fakeHeight / 2,
        radius: 75,
        requiredLevel: 0,
        description: 'Increases bits gained by 40%. Costs 1 kB to purchase.',
        onClick: function () {
            if (kiloBytes < upgradeCost(aUpgradeLevels[this.name] - 1) & !dev) {
                addNotif('Not enough kB');
                return;
            } else {
                addNotif('Upgraded bit multiplier.');
                kiloBytes -= upgradeCost(aUpgradeLevels[this.name] - 1);
                aUpgradeLevels[this.name] += 1;
                bitMult *= 1.4;
                var upgradeLevel = aUpgradeLevels[this.name];
                this.description = 'Increases bits gained by 40%. This upgrade is currently at level ' + upgradeLevel + '.\nBit multiplier: x' + proc.round(bitMult * 100) / 100 + '. Costs ' + upgradeCost(upgradeLevel) + ' kB to level up.';
            }
        },
        updateDesc: function () {
            var upgradeLevel = aUpgradeLevels[this.name];
            if (upgradeLevel > 0) {
                this.description = 'Increases bits gained by 40%. This upgrade is currently at level ' + upgradeLevel + '.\nBit multiplier: x' + proc.round(bitMult * 100) / 100 + '. Costs ' + upgradeCost(upgradeLevel) + ' kB to level up.';
            }
        }
    },
    {
        name: 'Damage',
        x: fakeWidth / 2 - 75 * 3 / 2,
        y: fakeHeight / 2 - 75 * proc.sqrt(3) / 2,
        radius: 75,
        requiredLevel: 0,
        description: 'Increases damage by 80%. Costs 1 kB to purchase.',
        onClick: function () {
            if (kiloBytes < upgradeCost(aUpgradeLevels[this.name] - 1) & !dev) {
                addNotif('Not enough kB!');
                return;
            } else {
                addNotif('Upgraded damage.');
                kiloBytes -= upgradeCost(aUpgradeLevels[this.name] - 1);
                aUpgradeLevels[this.name] += 1;
                damageCoef *= 1.8;
                var upgradeLevel = aUpgradeLevels[this.name];
                this.description = 'Increases damage by 80%. This upgrade is currently at level ' + upgradeLevel + '.\nDamage coefficient: x' + proc.round(damageCoef * 100) / 100 + '. Costs ' + upgradeCost(upgradeLevel) + ' kB to level up.';
            }
        },
        updateDesc: function () {
            var upgradeLevel = aUpgradeLevels[this.name];
            if (upgradeLevel > 0) {
                this.description = 'Increases damage by 80%. This upgrade is currently at level ' + upgradeLevel + '.\nDamage coefficient: x' + proc.round(damageCoef * 100) / 100 + '. Costs ' + upgradeCost(upgradeLevel) + ' kB to level up.';
            }
        }
    },
    {
        name: 'Drones',
        x: fakeWidth / 2 + 75 * 3 / 2,
        y: fakeHeight / 2 - 75 * proc.sqrt(3) / 2,
        radius: 75,
        requiredLevel: 0,
        description: 'Allows you to equip one more drone. Costs 1 kB to purchase.',
        onClick: function () {
            if (kiloBytes < upgradeCost(aUpgradeLevels[this.name] - 1) & !dev) {
                addNotif('Not enough kB!');
                return;
            } else {
                addNotif('Drone slots increased by one.');
                kiloBytes -= upgradeCost(aUpgradeLevels[this.name] - 1);
                aUpgradeLevels[this.name] += 1;
                maxDroneCount += 1;
                var upgradeLevel = aUpgradeLevels[this.name];
                this.description = 'Adds one more drone slot. This upgrade is currently at level ' + upgradeLevel + '.\nDrone slots: ' + maxDroneCount + '. Costs ' + upgradeCost(upgradeLevel) + ' kB to level up.';
            }
        },
        updateDesc: function () {
            var upgradeLevel = aUpgradeLevels[this.name];
            if (upgradeLevel > 0) {
                this.description = 'Adds one more drone slot. This upgrade is currently at level ' + upgradeLevel + '.\nDrone slots: ' + maxDroneCount + '. Costs ' + upgradeCost(upgradeLevel) + ' kB to level up.';
            }
        }
    },
    {
        name: 'Levels',
        x: fakeWidth / 2 + 75 * 3 / 2,
        y: fakeHeight / 2 + 75 * proc.sqrt(3) / 2,
        radius: 75,
        requiredLevel: 0,
        description: 'You level up 50% faster. Costs 1 kB to purchase.',
        onClick: function () {
            if (kiloBytes < upgradeCost(aUpgradeLevels[this.name] - 1) & !dev) {
                addNotif('Not enough kB!');
                return;
            } else {
                addNotif('Experience multiplier increased by 50%.');
                kiloBytes -= upgradeCost(aUpgradeLevels[this.name] - 1);
                aUpgradeLevels[this.name] += 1;
                experienceGain *= 1.5;
                var upgradeLevel = aUpgradeLevels[this.name];
                this.description = 'You level up 50% faster. This upgrade is currently at level ' + upgradeLevel + '.\nExperience multiplier: ' + proc.floor(experienceGain * 100) / 100 + '. Costs ' + upgradeCost(upgradeLevel) + ' kB to level up.';
            }
        },
        updateDesc: function () {
            var upgradeLevel = aUpgradeLevels[this.name];
            if (upgradeLevel > 0) {
                this.description = 'You level up 50% faster. This upgrade is currently at level ' + upgradeLevel + '.\nExperience multiplier: ' + proc.floor(experienceGain * 100) / 100 + '. Costs ' + upgradeCost(upgradeLevel) + ' kB to level up.';
            }
        }
    },
    {
        name: 'Boost',
        x: fakeWidth / 2 - 75 * 3 / 2,
        y: fakeHeight / 2 + 75 * proc.sqrt(3) / 2,
        radius: 75,
        requiredLevel: 0,
        description: 'You start with 100 bits. Costs 1 kB to purchase.',
        onClick: function () {
            if (kiloBytes < upgradeCost(aUpgradeLevels[this.name] - 1) & !dev) {
                addNotif('Not enough kB!');
                return;
            } else {
                addNotif('Starting bits increased by 100.');
                kiloBytes -= upgradeCost(aUpgradeLevels[this.name] - 1);
                aUpgradeLevels[this.name] += 1;
                startingBits += 100;
                var upgradeLevel = aUpgradeLevels[this.name];
                this.description = 'You start with 100 more bits. This upgrade is currently at level ' + upgradeLevel + '.\nStarting bits: ' + startingBits + '. Costs ' + upgradeCost(upgradeLevel) + ' kB to level up.';
            }
        },
        updateDesc: function () {
            var upgradeLevel = aUpgradeLevels[this.name];
            if (upgradeLevel > 0) {
                this.description = 'You start with 100 more bits. This upgrade is currently at level ' + upgradeLevel + '.\nStarting bits: ' + startingBits + '. Costs ' + upgradeCost(upgradeLevel) + ' kB to level up.';
            }
        }
    },
    {
        name: 'Waves',
        x: fakeWidth / 2,
        y: fakeHeight / 2 - 75 * proc.sqrt(3),
        radius: 75,
        requiredLevel: 0,
        description: 'The game skips easier waves so you can earn bits faster.\nPurchase in moderation! Costs 1 kB to purchase.',
        onClick: function () {
            if (kiloBytes < upgradeCost(aUpgradeLevels[this.name] - 1) & !dev) {
                addNotif('Not enough kB!');
                return;
            } else {
                addNotif('Starting helper.difficulty increased by 100%.');
                kiloBytes -= upgradeCost(aUpgradeLevels[this.name] - 1);
                aUpgradeLevels[this.name] += 1;
                helper.startingDifficulty *= 2;
                var upgradeLevel = aUpgradeLevels[this.name];
                this.description = 'The game starts 100% harder. This upgrade is currently at level ' + upgradeLevel + '.\nStarting bits: ' + proc.round(helper.startingDifficulty) + '. Costs ' + upgradeCost(upgradeLevel) + ' kB to level up.';
            }
        },
        updateDesc: function () {
            var upgradeLevel = aUpgradeLevels[this.name];
            if (upgradeLevel > 0) {
                this.description = 'The game starts 100% harder. This upgrade is currently at level ' + upgradeLevel + '.\nStarting bits: ' + proc.round(helper.startingDifficulty) + '. Costs ' + upgradeCost(upgradeLevel) + ' kB to level up.';
            }
        }
    },
    {
        name: 'Cash',
        x: fakeWidth / 2,
        y: fakeHeight / 2 + 75 * proc.sqrt(3),
        radius: 75,
        requiredLevel: 0,
        description: 'You get a bit every time you click. Costs 1 kB to purchase.',
        onClick: function () {
            if (kiloBytes < upgradeCost(aUpgradeLevels[this.name] - 1) & !dev) {
                addNotif('Not enough kB!');
                return;
            } else {
                addNotif('Bits per click increased by 1.');
                kiloBytes -= upgradeCost(aUpgradeLevels[this.name] - 1);
                aUpgradeLevels[this.name] += 1;
                bitsPerClick += 1;
                var upgradeLevel = aUpgradeLevels[this.name];
                this.description = 'Increases bits per click by one. This upgrade is currently at level ' + upgradeLevel + '.\nStarting bits: ' + bitsPerClick + '. Costs ' + upgradeCost(upgradeLevel) + ' kB to level up.';
            }
        },
        updateDesc: function () {
            var upgradeLevel = aUpgradeLevels[this.name];
            if (upgradeLevel > 0) {
                this.description = 'Increases bits per click by one. This upgrade is currently at level ' + upgradeLevel + '.\nStarting bits: ' + bitsPerClick + '. Costs ' + upgradeCost(upgradeLevel) + ' kB to level up.';
            }
        }
    },
    {
        name: 'Virus',
        x: fakeWidth / 2 + 75 * 3,
        y: fakeHeight / 2,
        radius: 75,
        requiredLevel: 0,
        description: 'Decreases virus frequency by 50%. Costs 1 kB to purchase.',
        onClick: function () {
            if (kiloBytes < upgradeCost(aUpgradeLevels[this.name] - 1) & !dev) {
                addNotif('Not enough kB!');
                return;
            } else {
                addNotif('Virus frequency decreased by 50%.');
                kiloBytes -= upgradeCost(aUpgradeLevels[this.name] - 1);
                aUpgradeLevels[this.name] += 1;
                virusFrequency *= 1.5;
                var upgradeLevel = aUpgradeLevels[this.name];
                this.description = 'Decreases virus frequency by 50%. This upgrade is currently at level ' + upgradeLevel + '.\nCurrent frequency (higher is better): ' + proc.round(virusFrequency / (ascensions + 1) / 1000) + '. Costs ' + upgradeCost(upgradeLevel) + ' kB to level up.';
            }
        },
        updateDesc: function () {
            var upgradeLevel = aUpgradeLevels[this.name];
            if (upgradeLevel > 0) {
                this.description = 'Decreases virus frequency by 50%. This upgrade is currently at level ' + upgradeLevel + '.\nCurrent frequency (higher is better): ' + proc.round(virusFrequency / (ascensions + 1) / 1000) + '. Costs ' + upgradeCost(upgradeLevel) + ' kB to level up.';
            }
        }
    },
    {
        name: 'Powers',
        x: fakeWidth / 2 - 75 * 3,
        y: fakeHeight / 2,
        radius: 75,
        requiredLevel: 0,
        description: 'You start with the shop and powers unlocked. Costs 10 kB to purchase.',
        onClick: function () {
            if (aUpgradeLevels[this.name] !== 0) {
                addNotif('This is a one-time upgrade.');
                return;
            }
            if (kiloBytes < 10 & !dev) {
                addNotif('Not enough kB!');
                return;
            } else {
                addNotif('You now start with powers unlocked!');
                kiloBytes -= 10;
                aUpgradeLevels[this.name] += 1;
                startWithPowers = true;
                this.description = 'You start with the shop and powers unlocked.\nYou have purchased this upgrade.';
            }
        },
        updateDesc: function () {
            var upgradeLevel = aUpgradeLevels[this.name];
            if (upgradeLevel > 0) {
                this.description = 'You start with the shop and powers unlocked.\nYou have purchased this upgrade.';
            }
        }
    },
    ];
    var initLevels = function () {
        for (var i = 1; i < ascensionUpgradeButtons.length; i++) {
            aUpgradeLevels[ascensionUpgradeButtons[i].name] = 0;
        }
    };
    initLevels();
    var drawByte = function (x, y, r, d) {
        for (var k = r; k < r + 360; k += 120) {
            proc.line(x + proc.cos(k) * d / 2, y + proc.sin(k) * d / 2, x + proc.cos(k + 120) * d / 2, y + proc.sin(k + 120) * d / 2);
        }
        for (var k = r + 60; k < r + 420; k += 120) {
            proc.line(x + proc.cos(k) * d / 2, y + proc.sin(k) * d / 2, x + proc.cos(k + 120) * d / 2, y + proc.sin(k + 120) * d / 2);
        }
        helper.hexagon(x, y, r, d);
        helper.hexagon(x, y, r, d / 2);
    };
    var drawBytes = function () {
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
        proc.line(0, fakeHeight * 9 / 10 - 25, fakeWidth, fakeHeight * 9 / 10 - 25);
        proc.line(0, fakeHeight * 9 / 10 + 25, fakeWidth, fakeHeight * 9 / 10 + 25);
        drawByte(20, fakeHeight * 9 / 10, proc.frameCount, 25);
        proc.fill(helper.colorSchemes[helper.colorScheme]);
        proc.textSize(25);
        proc.textAlign(proc.LEFT, proc.CENTER);
        proc.text(kiloBytes + ' kB', 40, fakeHeight * 9 / 10 - 0.5);
    };
    var ascensionUpgrades = function () {
        drawTitle('Upgrades');
        drawBytes();
    };
    // }
    // }
    // Mouse and Buttons {
    // Button execution {
    var executeButtons = function () {
        if (transitionCounter > 0) {
            return;
        }
        for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            if (!button.onClick & typeof button.name === 'string') {
                continue;
            }
            if (typeof button.name === 'string') {
                if (helper.checkHover(button) & (level >= button.requiredLevel || dev)) {
                    button.onClick();
                } else if (helper.checkHover(button)) {
                    addNotif('You are not at level ' + button.requiredLevel + ' yet.');
                }
            } else if (helper.checkHover(button)) {
                if (weapons[button.name].owned || dev) {
                    if (!weapons[button.name].used || button.name === 0) {
                        weapons[shopDrones[currentDrone].weapon].used = false;
                        shopDrones[currentDrone].weapon = button.name;
                        weapons[button.name].used = true;
                        addNotif('Assigned ' + weapons[button.name].name + ' to ' + shopDrones[currentDrone].name + '.');
                    } else {
                        addNotif('This weapon is used.');
                    }
                } else {
                    addNotif('You do not own this weapon');
                }
            }
        }
    };
    var pause = function () {
        proc.background(0, 0, 0);
        proc.stroke(helper.colorSchemes[helper.colorScheme]);
        helper.hexagon(fakeWidth / 2, fakeHeight / 2, proc.frameCount, fakeWidth);
        proc.fill(helper.colorSchemes[helper.colorScheme]);
        proc.textSize(25);
        proc.textAlign(proc.CENTER, proc.CENTER);
        proc.text('Paused.\nMove mouse over screen to unpause.\n\nThis pause screen is dedicated to\n|octobrush|', fakeWidth / 2, fakeHeight / 2);
    };
    // }
    // Mouse 2.0 {
    var holdButtons = false;
    var holdTimer = 0;
    var maxHoldTimer = 25;
    var holdExecute = function () {
        if (holdButtons) {
            if (proc.mouseIsPressed) {
                holdTimer++;
            } else {
                holdTimer = 0;
            }
            if (holdTimer >= maxHoldTimer & proc.frameCount % 3 === 0) {
                executeButtons();
            }
        }
    };
    //}
    // }
    // Secret market {
    var secretMarketButtons = [{
        name: 'Back',
        x: fakeWidth / 10,
        y: fakeHeight / 10,
        radius: 50,
        requiredLevel: 0,
        onClick: function () {
            switchScene('Menu');
        }
    },
    {
        name: 'Exchange',
        x: fakeWidth / 4,
        y: fakeHeight * 3 / 4,
        radius: 50,
        requiredLevel: 0,
        description: 'You give a kB and get 6000 bits.\nDoes not affect cumulative bits.',
        onClick: function () {
            if (kiloBytes <= 0) {
                addNotif('Not enough kB. Ascend to get kB.');
            } else {
                kiloBytes--;
                bits += 6000;
                addNotif('1 kB converted into 6000 bits.\nHave fun with your wealth.');
            }
        }
    },
    {
        name: 'Gamble',
        x: fakeWidth / 4,
        y: fakeHeight / 2,
        radius: 50,
        requiredLevel: 0,
        description: '50% chance to double your bits, 50% to lose it all.\nDoubling your bits increases cumulative bits.',
        onClick: function () {
            if (proc.random(1) > 0.5) {
                cumulativeBits += bits;
                bits *= 2;
            } else {
                bits = 0;
            }
        }
    },
    {
        name: 'Vaccine',
        x: fakeWidth * 3 / 4,
        y: fakeHeight / 2,
        radius: 50,
        requiredLevel: 0,
        description: 'Removes all your current viruses for 5000 bits.',
        onClick: function () {
            if (bits >= 5000) {
                initViruses();
                addNotif('Viruses removed for 5000 bits.');
            } else {
                addNotif('Not enough bits!');
            }
        }
    },
    {
        name: 'Delag',
        x: fakeWidth / 2,
        y: fakeHeight * 3 / 4,
        radius: 50,
        requiredLevel: 0,
        description: 'Bullets are rendered as circles, reducing lag in high graphics mode.\nYou can toggle this upgrade. Costs 5 kB.',
        purchased: false,
        onClick: function () {
            if (!this.purchased & kiloBytes < 5) {
                addNotif('Not enough kB!');
            } else if (!this.purchased & kiloBytes >= 5) {
                kiloBytes -= 5;
                this.purchased = true;
                this.description = 'Minimalist bullets are on.\nThis reduces lag.';
                delag = true;
            } else if (this.purchased & delag) {
                delag = false;
                this.description = 'Minimalist bullets are off.\nThis increases lag but has better graphics.';
            } else if (this.purchased & !delag) {
                delag = true;
                this.description = 'Minimalist bullets are on.\nThis reduces lag.';
            }
        }
    },
    {
        name: 'AutoNext',
        x: fakeWidth / 2,
        y: fakeHeight / 4,
        radius: 50,
        requiredLevel: 0,
        description: 'A software is created that automatically clicks through chests.\nCosts 1 kB.',
        onClick: function () {
            if (!autoNext & kiloBytes < 1) {
                addNotif('Not enough kB.');
            } else if (!autoNext & kiloBytes >= 1) {
                autoNext = true;
                kiloBytes--;
                addNotif('AutoNext software installed.\nYour chests will automatically be clicked through');
                this.description = 'Purchased.';
            } else if (autoNext) {
                addNotif('This is a one-time upgrade.');
            }
        }
    },
    {
        name: 'WaveLimit',
        x: fakeWidth / 4,
        y: fakeHeight / 4,
        radius: 50,
        requiredLevel: 0,
        description: 'Waves don\'t automatically advance.\nThey only advance if you have beat the current wave. Costs 2 kB.',
        onClick: function () {
            if (!waveLimiter & kiloBytes < 2) {
                addNotif('Not enough kB.');
            } else if (!waveLimiter & kiloBytes >= 2) {
                kiloBytes -= 2;
                waveLimiter = true;
                addNotif('WaveLimit software installed.');
                this.description = 'Purchased.';
            } else if (waveLimiter) {
                addNotif('This is a one-time upgrade.');
            }
        }
    },
    {
        name: 'Invest',
        x: fakeWidth * 3 / 4,
        y: fakeHeight / 4,
        radius: 50,
        requiredLevel: 0,
        description: 'Converts your current bits into cumulative bits.\nAllows you to earn more kB upon ascension.',
        onClick: function () {
            addNotif('Current bits converted into cumulative bits.');
            cumulativeBits += bits;
            bits = 0;
        }
    },
    {
        name: 'Mouse 2.0',
        x: fakeWidth * 3 / 4,
        y: fakeHeight * 3 / 4,
        radius: 50,
        requiredLevel: 0,
        description: 'Holding your mouse starts an autoclicker.\nUseful for buying chests, scrolling through guns, etc. Costs 5 kB.',
        onClick: function () {
            if (!holdButtons & kiloBytes < 5) {
                addNotif('Not enough kB.');
            } else if (!holdButtons & kiloBytes >= 5) {
                kiloBytes -= 5;
                holdButtons = true;
                addNotif('Mouse upgraded.');
                this.description = 'Purchased.';
            } else if (holdButtons) {
                addNotif('This is a one-time upgrade.');
            }
        }
    },
    {
        name: 'File.txt',
        x: fakeWidth / 2,
        y: fakeHeight / 2,
        radius: 75,
        requiredLevel: 0,
        description: 'A mysterious file of size 128 kB.',
        decoded: false,
        onClick: function () {
            if (kiloBytes < 128 & !this.decoded) {
                addNotif('Not enough kB.');
            } else {
                addNotif('The file has been decoded. Good job.');
                if (!dev) {
                    addNotif('You beat the game!');
                    proc.println('https://www.khanacademy.org/computer-programming/plane/5348275601932288');
                } else {
                    proc.println('You cannot beat the game on developer mode. Sorry.');
                }
            }
        }
    },
    ];
    var secretMarket = function () {
        drawTitle('The Market');
        drawBytes();
    };
    // }
    // Saving {
    // Functions {
    var _JSON = (function () {
        return this.JSON;
    })();
    var loadSave = function () {
        if (saveCode.length <= 0) {
            addNotif('No save present.');
            return;
        }
        addNotif('Save loaded.');
        furthestWave = saveCode[0];
        timeElapsed = saveCode[1];
        mouseClicks = saveCode[2];
        helper.lineWidth = saveCode[3];
        showBackgrounds = saveCode[4];
        smallDroneCount = saveCode[5];
        graphicsQuality = saveCode[6];
        weaponImageScale = saveCode[7];
        weaponImageRes = saveCode[8];
        bulletImageScale = saveCode[9];
        bulletImageRes = saveCode[10];
        infected = saveCode[11];
        bitsPerClick = saveCode[12];
        maxDroneCount = saveCode[13];
        helper.startingDifficulty = saveCode[14];
        helper.difficulty = saveCode[15];
        gunsUnlocked = saveCode[16];
        dronesUnlocked = saveCode[17];
        ascensions = saveCode[18];
        waveLimiter = saveCode[19];
        secretMarketButtons[4].purchased = saveCode[20];
        damageCoef = saveCode[21];
        helper.colorScheme = saveCode[22];
        experience = saveCode[23];
        level = saveCode[24];
        maxExperience = saveCode[25];
        experienceGain = saveCode[26];
        startingBits = saveCode[27];
        bits = saveCode[28];
        bitMult = saveCode[29];
        cumulativeBits = saveCode[30];
        kiloBytes = saveCode[31];
        unlockedWeapons = _JSON.parse(saveCode[32]);
        unlockedDrones = _JSON.parse(saveCode[33]);
        startWithPowers = saveCode[34];
        holdButtons = saveCode[35];
        playerPower = saveCode[36];
        playerPowerReload = saveCode[37];
        hPlayer = _JSON.parse(saveCode[38]);
        delag = saveCode[39];
        secretButtonClicks = saveCode[40];
        maxSecretButtonClicks = saveCode[41];
        currentGun = saveCode[42];
        currentDrone = saveCode[43];
        currentColor = saveCode[44];
        upgradeLevels = _JSON.parse(saveCode[45]);
        autoNext = saveCode[46];
        unlockedViruses = _JSON.parse(saveCode[47]);
        virusFrequency = saveCode[48];
        achievementsEarned = _JSON.parse(saveCode[49]);
        unlockedAchievements = saveCode[50];
        aUpgradeLevels = _JSON.parse(saveCode[51]);
        for (var i in unlockedWeapons) {
            if (i.length < 3) {
                weapons[i].owned = true;
                weapons[i].damageCoefficient = unlockedWeapons[i + "damage"];
                weapons[i].level = unlockedWeapons[i + "level"];
                weapons[i].used = unlockedWeapons[i + "used"];
            }
        }
        for (var i in unlockedDrones) {
            if (i.length < 3) {
                shopDrones[i].owned = true;
                shopDrones[i].level = unlockedDrones[i + "level"];
                shopDrones[i].used = unlockedDrones[i + "used"];
                shopDrones[i].maxHealth = unlockedDrones[i + "maxHealth"];
                shopDrones[i].health = unlockedDrones[i + "health"];
                shopDrones[i].bodyDamage = unlockedDrones[i + "bodyDamage"];
                shopDrones[i].weapon = unlockedDrones[i + "weapon"];
                if (shopDrones[i].used) {
                    equippedDrones.push(i);
                }
            }
        }
        for (var i = 0; i < achievementsEarned.length; i++) {
            var index = achievementsEarned[i];
            achievements[index].completed = true;
            awardsButtons[index + 1].description = achievements[index].name + ':\n' + achievements[index].description;
        }
        for (var i = 0; i < unlockedViruses.length; i++) {
            viruses[unlockedViruses[i]].infected = true;
        }
        for (var i = 0; i < ascensionUpgradeButtons.length; i++) {
            ascensionUpgradeButtons[i].updateDesc();
        }
        if (secretButtonClicks > 0) {
            if (secretButtonClicks >= maxSecretButtonClicks) {
                shopButtons[6].description = 'You have permanently gained access to the secret market.\nAccess stays after ascensions.';
                shopButtons[6].name = "Market";
            } else {
                shopButtons[6].description = secretButtonClicks + '/' + maxSecretButtonClicks + ' clicks. Clicking the button costs 200 bits.';
            }
        }
        if (secretMarketButtons[4].purchased) {
            if (delag) {
                secretMarketButtons[4].description = 'Minimalist bullets are on.\nThis reduces lag.';
            } else {
                secretMarketButtons[4].description = 'Minimalist bullets are off.\nThis increases lag but has better graphics.';
            }
        }
        if (autoNext) {
            secretMarketButtons[5].description = 'Purchased.';
        }
        if (waveLimiter) {
            secretMarketButtons[6].description = 'Purchased.';
        }
        if (holdButtons) {
            secretMarketButtons[8].description = 'Purchased.';
        }
        scene = "Menu";
        transitionScene = "Menu";
        applyViruses();
    };
    var createSave = function () {
        for (var i = 0; i < weapons.length; i++) {
            if (weapons[i].owned) {
                unlockedWeapons[i] = true;
                unlockedWeapons[i + "damage"] = weapons[i].damageCoefficient;
                unlockedWeapons[i + "level"] = weapons[i].level;
                unlockedWeapons[i + "used"] = weapons[i].used;
            }
        }
        for (var i = 0; i < shopDrones.length; i++) {
            if (shopDrones[i].owned) {
                unlockedDrones[i] = true;
                unlockedDrones[i + "level"] = shopDrones[i].level;
                unlockedDrones[i + "used"] = shopDrones[i].used;
                unlockedDrones[i + "maxHealth"] = shopDrones[i].maxHealth;
                unlockedDrones[i + "health"] = shopDrones[i].health;
                unlockedDrones[i + "bodyDamage"] = shopDrones[i].bodyDamage;
                unlockedDrones[i + "weapon"] = shopDrones[i].weapon;
            }
        }
        for (var i = 0; i < achievements.length; i++) {
            if (achievements[i].completed) {
                achievementsEarned.push(i);
            }
        }
        for (var i = 0; i < viruses.length; i++) {
            if (viruses[i].infected) {
                unlockedViruses.push(i);
            }
        }
        saveCode[0] = furthestWave;
        saveCode[1] = proc.millis() + timeElapsed;
        saveCode[2] = mouseClicks;
        saveCode[3] = helper.lineWidth;
        saveCode[4] = showBackgrounds;
        saveCode[5] = smallDroneCount;
        saveCode[6] = graphicsQuality;
        saveCode[7] = weaponImageScale;
        saveCode[8] = weaponImageRes;
        saveCode[9] = bulletImageScale;
        saveCode[10] = bulletImageRes;
        saveCode[11] = infected;
        saveCode[12] = bitsPerClick;
        saveCode[13] = maxDroneCount;
        saveCode[14] = helper.startingDifficulty;
        saveCode[15] = helper.difficulty;
        saveCode[16] = gunsUnlocked;
        saveCode[17] = dronesUnlocked;
        saveCode[18] = ascensions;
        saveCode[19] = waveLimiter;
        saveCode[20] = secretMarketButtons[4].purchased;
        saveCode[21] = damageCoef;
        saveCode[22] = helper.colorScheme;
        saveCode[23] = experience;
        saveCode[24] = level;
        saveCode[25] = maxExperience;
        saveCode[26] = experienceGain;
        saveCode[27] = startingBits;
        saveCode[28] = bits;
        saveCode[29] = bitMult;
        saveCode[30] = cumulativeBits;
        saveCode[31] = kiloBytes;
        saveCode[32] = _JSON.stringify(unlockedWeapons);
        saveCode[33] = _JSON.stringify(unlockedDrones);
        saveCode[34] = startWithPowers;
        saveCode[35] = holdButtons;
        saveCode[36] = playerPower;
        saveCode[37] = playerPowerReload;
        saveCode[38] = _JSON.stringify(hPlayer);
        saveCode[39] = delag;
        saveCode[40] = secretButtonClicks;
        saveCode[41] = maxSecretButtonClicks;
        saveCode[42] = currentGun;
        saveCode[43] = currentDrone;
        saveCode[44] = currentColor;
        saveCode[45] = _JSON.stringify(upgradeLevels);
        saveCode[46] = autoNext;
        saveCode[47] = _JSON.stringify(unlockedViruses);
        saveCode[48] = virusFrequency;
        saveCode[49] = _JSON.stringify(achievementsEarned);
        saveCode[50] = unlockedAchievements;
        saveCode[51] = _JSON.stringify(aUpgradeLevels);
        var saveStr = "[";
        for (var i = 0; i < saveCode.length; i++) {
            if (typeof saveCode[i] === "string") {
                saveStr += "'" + saveCode[i] + "', ";
            } else {
                saveStr += saveCode[i] + ", ";
            }
        }
        saveStr = saveStr.substr(0, saveStr.length - 2) + "]";
        unlockedWeapons = {};
        unlockedDrones = {};
        achievementsEarned.length = 0;
        unlockedViruses.length = 0;
        localStorage.setItem('Data Defense Save Code', saveStr);
        addNotif('Saved.');
    };
    // }
    // Scene {
    var savingButtons = [{
        name: 'Back',
        x: fakeWidth / 10,
        y: fakeHeight / 10,
        radius: 50,
        requiredLevel: 0,
        onClick: function () {
            switchScene('Menu');
        }
    },
    {
        name: 'Load',
        x: fakeWidth / 4,
        y: fakeHeight / 2,
        radius: 75,
        requiredLevel: 0,
        description: 'Warning: This will load the current savecode into your game.\nYou will lose all progress. To save the game, click the other button.',
        onClick: function () {
            loadSave();
        }
    },
    {
        name: 'Save',
        x: fakeWidth * 3 / 4,
        y: fakeHeight / 2,
        radius: 75,
        requiredLevel: 0,
        description: 'Remember to load your save after you re-enter the game.',
        onClick: function () {
            createSave();
        }
    },
    ];
    var thankYouText = function () {
        proc.textSize(20);
        proc.fill(helper.colorSchemes[helper.colorScheme]);
        proc.textAlign(proc.CENTER, proc.CENTER);
        proc.text('Thanks to Electric Dolphin for this feature!\nInform me of any save-related bugs.', fakeWidth / 2, fakeHeight * 5 / 6);
    };
    var saving = function () {
        drawTitle('Saving');
        thankYouText();
    };
    // }
    // }
    // Main {
    var sceneButtons = {
        'Warning': warningButtons,
        'Story': storyButtons,
        'Game': gameButtons,
        'Menu': menuButtons,
        'Gun Selection': gunSelectButtons,
        'Drone Weapon Selection': droneWeaponSelectButtons,
        'Drone Selection': droneSelectButtons,
        'Color Selection': colorSelectButtons,
        'Player Upgrade': playerUpgradeButtons,
        'Chests': chestButtons,
        'Display Chest': displayChestButtons,
        'Shop': shopButtons,
        'Power Selection': powerSelectButtons,
        'Ascend': ascendButtons,
        'Ascension Upgrades': ascensionUpgradeButtons,
        'Credits': creditsButtons,
        'Viruses': virusButtons,
        'Secret Market': secretMarketButtons,
        'Awards': awardsButtons,
        'Info': infoButtons,
        'Guide': guideButtons,
        'Stats': statsButtons,
        'Winners': winnersButtons,
        'Saving': savingButtons
    };
    var buttonPerms = function () {
        if (startWithPowers) {
            sceneButtons.Menu[1].requiredLevel = 0;
            sceneButtons.Shop[3].requiredLevel = 0;
        }
    };
    var switchButtons = function () {
        buttons = sceneButtons[scene];
    };
    var functions = {
        'Warning': warning,
        'Game': game,
        'Menu': menu,
        'Shop': shop,
        'Gun Selection': gunSelect,
        'Credits': credits,
        'Color Selection': colorSelect,
        'Player Upgrade': playerUpgrade,
        'Chests': chests,
        'Display Chest': displayChest,
        'Story': story,
        'Drone Selection': droneSelect,
        'Drone Weapon Selection': droneWeaponSelect,
        'Ascend': ascend,
        'Ascension Upgrades': ascensionUpgrades,
        'Viruses': showViruses,
        'Power Selection': powerSelect,
        'Secret Market': secretMarket,
        'Awards': awards,
        'Info': info,
        'Guide': guide,
        'Stats': stats,
        'Winners': winners,
        'Saving': saving
    };
    var drawBackground = function () {
        if (!showBackgrounds) {
            proc.background(0, 0, 0);
        } else {
            backgrounds[scene]();
        }
    };
    var run = function () {
        scaleScreen();
        if (!startRedification) {
            if (paused) {
                pause();
                return;
            }
            buttonPerms();
            infectViruses();
            drawBackground();
            functions[scene]();
            drawButtons();
            bottomBar();
            notifications();
            transition();
            devBits();
            switchButtons();
            displayParticles();
            applyViruses();
            holdExecute();
            checkAwards();
        } else {
            redify();
        }
        devDisplay();
        proc.popMatrix();
    };
    proc.draw = function () {
        run();
    };
    // }
    // Events {
    proc.keyPressed = function () {
        keys[String(proc.key)] = true;
    };
    proc.keyReleased = function () {
        keys[String(proc.key)] = false;
    };
    proc.mouseClicked = function () {
        mouseClicks += 1;
        if (!startRedification) {
            executeButtons();
        }
        bits += bitsPerClick;
        addParticles();
    };
    proc.mouseOut = function () {
        paused = true;
    };
    proc.mouseOver = function () {
        paused = false;
    };

    // }
    // }


    ////////////
}

window.onload = function () {
    new Processing("canvas", sketchProc);
}
