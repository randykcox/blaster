/*globals console, Phaser */

(function () {

var stageSize = {width:800, height:600};
var spriteScale = 4;
var GRAVITY = 50;

var targets, balloons, booms;

var gameState = {

    preload : function() {
    //Here you can preload images, audio, spritesheets and so on.
        // this.load.image('missile', 'img/missile.png');
        this.load.spritesheet('frisbee', 'img/Frisbee.png', 14, 6);
        // this.load.image('balloon', 'img/Water Balloon.png');
        this.load.spritesheet('balloon', 'img/Water Balloon.png', 16, 16);
        this.load.image('castle', 'img/Sand Castle.png');
        this.load.image('lifeguard', 'img/Lifeguard_1.png');
        this.load.image('boom', 'img/boom.gif');
    },

    create : function() {
    //This is called immediately after preloading.

        this.stage.backgroundColor = '#9c9c9c';

        // Show FPS
        this.game.time.advancedTiming = true;
        this.fpsText = this.game.add.text(
            20, 20, '', { font: '16px Arial', fill: '#ffffff' }
        );

        targets = this.add.group();
        this.addTargets();

        balloons = this.add.group();
        this.unleashTheBalloons();

        booms = this.add.group();
    },

    update : function() {
    //This method is called every frame.
        if (this.game.time.fps !== 0) {
            this.fpsText.setText(this.game.time.fps + ' FPS');
        }

        this.physics.arcade.collide(targets, balloons, this.balloonHitsCastle, null, this);
    },

    render : function () {
//        this.debug.body(targets);
    },

    addTargets : function () {
        var castleSpacing = stageSize.width/7;
        var offset = castleSpacing/2;

        targets.add(new Castle(this, castleSpacing-offset, stageSize.height-50));
        targets.add(new Castle(this, castleSpacing*2-offset, stageSize.height-50));
        targets.add(new Castle(this, castleSpacing*3-offset, stageSize.height-50));
        targets.add(new Lifeguard(this, castleSpacing*4-offset, stageSize.height-50));
        targets.add(new Castle(this, castleSpacing*5-offset, stageSize.height-50));
        targets.add(new Castle(this, castleSpacing*6-offset, stageSize.height-50));
        targets.add(new Castle(this, castleSpacing*7-offset, stageSize.height-50));
    },

    unleashTheBalloons : function (withParallax) {
        this.balloonTimer = this.time.events.loop(500, function(){
            var balloon = this.add.existing(
                new Balloon(this, withParallax)
            );
            balloons.add(balloon);
        }, this);
    },

    balloonHitsCastle : function (castle, balloon) {
        this.blowUpBalloon(balloon);
        this.blowUpCastle(castle);
    },

    blowUpBalloon : function (balloon) {
        booms.add(new Boom(this, balloon.x, balloon.y));
        balloon.kill();
    },

    blowUpCastle : function (castle) {
        castle.kill();

        if (targets.countLiving() < 1) {
            balloons.destroy();
            console.log('Game Over');
        }
    }
};

//This line instantiates a new Phaser Game with a resolution of 1136x640 (iPhone5 Res), names it 'game',
//and adds gameState as the default state.
var game = new Phaser.Game(
    stageSize.width,
    stageSize.height,
    Phaser.AUTO,
    'gameDiv',
    gameState,
    false,  // transparent game object
    false   // antialias
);

var scaleSpeed = function (baseSpeed) {
    return spriteScale+(baseSpeed/100);
};

var Balloon = function (game) {

    var x = Math.random()*stageSize.width;
    // var y = -50;
    var y = 0;
    this.speedDown = 25;//+(Math.random()*1000);
    this.speedSide = (300) * (Math.random()-0.5);

    // Create the sprite
    Phaser.Sprite.call(this, game, x, y, 'balloon');
    this.anchor.setTo(0.5, 0.5);

    // Uncomment this line to make faster sprites larger, giving a parallax effect
    //this.scale.setTo(scaleSpeed(this.speedDown));
    this.scale.setTo(2);

    // Flip horizontally if it is falling to the left
    if (this.speedSide < 0) {
        this.scale.x *= -1;
    }

    // Enable physics and set velocity and gravity
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.velocity.setTo(this.speedSide, this.speedDown);
    this.body.gravity.y = GRAVITY;

    //This handy event lets us check if the balloon is completely off screen. If it is, we get rid of it.
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;

    // Has this balloon been hit?
    this.hit = false;
};
Balloon.prototype = Object.create(Phaser.Sprite.prototype);
Balloon.prototype.constructor = Balloon;

var Castle = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'castle');
    this.scale.setTo(spriteScale);
    this.anchor.setTo(0.5, 0.5);

    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    this.hit = false;
};
Castle.prototype = Object.create(Phaser.Sprite.prototype);
Castle.prototype.constructor = Castle;

var Lifeguard = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'lifeguard');
    this.scale.setTo(spriteScale);
    this.anchor.setTo(0.5, 0.5);

    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    this.hit = false;
};
Lifeguard.prototype = Object.create(Phaser.Sprite.prototype);
Lifeguard.prototype.constructor = Lifeguard;

var Boom = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'boom');
    this.scale.setTo(spriteScale);
    this.anchor.setTo(0.5, 0.5);
};
Boom.prototype = Object.create(Phaser.Sprite.prototype);
Boom.prototype.constructor = Boom;


/*


function create() {

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(50, 'missile');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);

    launcher = game.add.sprite(400, 300, 'castle');
    launcher.anchor.set(0.5);
    launcher.scale.setTo(10);

    game.physics.enable(launcher, Phaser.Physics.ARCADE);

    launcher.body.allowRotation = false;



}

function update() {

    launcher.rotation = game.physics.arcade.angleToPointer(launcher);

    if (game.input.activePointer.isDown)
    {
        fire();
    }

}

function fire() {

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstDead();

        bullet.reset(launcher.x - 8, launcher.y - 8);

        game.physics.arcade.moveToPointer(bullet, 300);
    }

}




*/
}());
