/*globals console, Phaser */

(function () {

var stageSize = {width:800, height:600};
var spriteScale = 4;

var GameState = function(game){};

GameState.prototype.preload = function() {
//Here you can preload images, audio, spritesheets and so on.
    this.game.load.image('missile', 'img/launcher.gif');
    this.game.load.image('baddie', 'img/baddie.gif');
    this.game.load.image('city', 'img/city.gif');
    this.game.load.image('boom', 'img/boom.gif');
};

GameState.prototype.create = function() {
//This is called immediately after preloading.

    game.stage.backgroundColor = '#9c9c9c';

    this.cities = game.add.group();
    this.cities.add(new City(this, stageSize.width/6, stageSize.height-50));
    this.cities.add(new City(this, (stageSize.width/6)*2, stageSize.height-50));
    this.cities.add(new City(this, (stageSize.width/6)*3, stageSize.height-50));
    this.cities.add(new City(this, (stageSize.width/6)*4, stageSize.height-50));
    this.cities.add(new City(this, (stageSize.width/6)*5, stageSize.height-50));

    this.baddies = game.add.group();
    this.baddieTimer = game.time.events.loop(500, function(){
        var baddie = this.game.add.existing(
            new Baddie(this)
        );
        this.baddies.add(baddie);
console.log(this.baddies.countLiving());
    }, this);
};

GameState.prototype.update = function() {
//This method is called every frame.
};

var scaleSpeed = function (baseSpeed) {
    return spriteScale+(baseSpeed/100);
};

var Baddie = function (game) {

    var x = Math.random()*stageSize.width;
    // var y = -50;
    var y = 0;
    this.speedDown = 25;//+(Math.random()*1000);
    this.speedSide = (300) * (Math.random()-0.5);

    // Create the sprite
    Phaser.Sprite.call(this, game, x, y, 'baddie');
    this.anchor.setTo(0.5, 0.5);

    // Uncomment this line to make faster sprites larger, giving a parallax effect
    //this.scale.setTo(scaleSpeed(this.speedDown));
    this.scale.setTo(spriteScale);

    // Flip horizontally if it is falling to the left
    if (this.speedSide < 0) {
        this.scale.x *= -1;
    }

    // Enable physics and set velocity and gravity
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.velocity.setTo(this.speedSide, this.speedDown);
    this.body.gravity.y = 10;

    //This handy event lets us check if the baddie is completely off screen. If it is, we get rid of it.
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;

    // Has this baddie been hit?
    this.hit = false;
};
Baddie.prototype = Object.create(Phaser.Sprite.prototype);
Baddie.prototype.constructor = Baddie;

var City = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'city');
    this.scale.setTo(spriteScale);
    this.anchor.setTo(0.5, 0.5);

    this.hit = false;
};
City.prototype = Object.create(Phaser.Sprite.prototype);
City.prototype.constructor = City;

//This line instantiates a new Phaser Game with a resolution of 1136x640 (iPhone5 Res), names it 'game',
//and adds GameState as the default state.
var game = new Phaser.Game(stageSize.width, stageSize.height, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);

/*

var game = new Phaser.Game(stageSize.width, stageSize.height, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });


var launcher;
var bullets;
var baddies;
var baddieTimer;

var fireRate = 100;
var nextFire = 0;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);



    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(50, 'missile');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);

    launcher = game.add.sprite(400, 300, 'city');
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

function render() {

    game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.total, 32, 32);
    game.debug.spriteInfo(launcher, 32, 450);

}


var Missile = function (game, x, y, target) {
    //Here's where we create our player sprite.
    Phaser.Sprite.call(this, game, x, y, 'missile');
    //We set the game input as the target
    this.target = target;
    //The anchor is the 'center point' of the sprite. 0.5, 0.5 means it will be aligned and rotated by its center point.
    this.anchor.setTo(0.5, 0.5);
    //Finally we enable physics so we can move the player around (this is how easy physics is in Phaser)
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    //We need a target position for our player to head to
    this.targetPos = {x:this.x, y:this.y};
    //And an easing constant to smooth the movement
    this.easer = 0.5;
    this.scale.setTo(10);
};


*/
}());
