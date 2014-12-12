/*globals console, Phaser */

(function () {

var stageSize = {width:800, height:600};
var spriteScale = 4;
var GRAVITY = 50;

var cities, baddies, booms;

var gameState = {

    preload : function() {
    //Here you can preload images, audio, spritesheets and so on.
        this.load.image('missile', 'img/missile.png');
        this.load.image('baddie', 'img/bomb.png');
        this.load.image('city', 'img/city.gif');
        this.load.image('boom', 'img/boom.gif');
    },

    create : function() {
    //This is called immediately after preloading.

        this.stage.backgroundColor = '#9c9c9c';

        cities = this.add.group();
        this.addCities();

        baddies = this.add.group();
        this.unleashTheBaddies();

        booms = this.add.group();
    },

    update : function() {
    //This method is called every frame.

        this.physics.arcade.collide(cities, baddies, this.baddieHitsCity, null, this);
    },

    render : function () {
//        this.debug.body(cities);
    },

    addCities : function () {
        cities.add(new City(this, stageSize.width/6, stageSize.height-50));
        cities.add(new City(this, (stageSize.width/6)*2, stageSize.height-50));
        cities.add(new City(this, (stageSize.width/6)*3, stageSize.height-50));
        cities.add(new City(this, (stageSize.width/6)*4, stageSize.height-50));
        cities.add(new City(this, (stageSize.width/6)*5, stageSize.height-50));
    },

    unleashTheBaddies : function (withParallax) {
        this.baddieTimer = this.time.events.loop(500, function(){
            var baddie = this.add.existing(
                new Baddie(this, withParallax)
            );
            baddies.add(baddie);
        }, this);
    },

    baddieHitsCity : function (city, baddie) {
        this.blowUpBaddie(baddie);
        this.blowUpCity(city);
    },

    blowUpBaddie : function (baddie) {
        booms.add(new Boom(this, baddie.x, baddie.y));
        baddie.kill();
    },

    blowUpCity : function (city) {
        city.kill();

        if (cities.countLiving() < 1) {
            baddies.destroy();
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
    gameState
);

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
    this.scale.setTo(2);

    // Flip horizontally if it is falling to the left
    if (this.speedSide < 0) {
        this.scale.x *= -1;
    }

    // Enable physics and set velocity and gravity
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.velocity.setTo(this.speedSide, this.speedDown);
    this.body.gravity.y = GRAVITY;

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

    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    this.hit = false;
};
City.prototype = Object.create(Phaser.Sprite.prototype);
City.prototype.constructor = City;


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




*/
}());
