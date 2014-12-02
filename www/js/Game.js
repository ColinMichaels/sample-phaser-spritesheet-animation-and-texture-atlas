(function(global) {

    var Game = global.Game = function(game) {};

    Game.prototype.create = function() {
        this.targetRadius = 10;
        this.stage = 0;
        this.playing = true;
        this.createGame = true;
        // this.idPerson = 0;
        this.idZombie = 0;
        this.score = 0;
        // this.scoreText = null;
        // this.roundText = null;
        // this.groupZombies = [];
        // this.groupPeople = [];
        this.amountZombiesDead = 0;
        this.amountZombies = 0;
        this.amountAliveZombies = 0;
        this.amountPeople = 0;

        this.soundGame = this.game.add.audio('audioBackGroundGame', 1, true);
        this.soundGame.play();
        this.spriteCenario = this.game.add.sprite(0, 0, 'cenario');
        this.spriteScore = this.game.add.sprite(25, 0, 'score');
        this.spriteRound = this.game.add.sprite(625, 0, 'round');
        this.spriteAmountPeople = this.game.add.sprite(325, 0, 'amountPeople');
        this.target = this.game.add.sprite(this.game.input.x, this.game.input.y, 'target');
        this.target.anchor.setTo(0.5, 0.5);
        this.target.z = 1;
        this.game.time.events.repeat(Phaser.Timer.SECOND * 1, 5, this.initPeople, this);
        this.game.time.events.repeat(Phaser.Timer.SECOND * 1, 10, this.initZombies, this);

        // this.groupGame = this.game.add.group();
        // this.groupGame.enableBody = true;
        // this.groupGame.physicsBodyType = Phaser.Physics.ARCADE;
        // this.groupGame.add(this.target);

        this.peopleGroup = this.game.add.group();
        this.peopleGroup.enableBody = true;
        this.peopleGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.peopleGroup.z = 2;

        this.zombiesGroup = this.game.add.group();
        this.zombiesGroup.enableBody = true;
        this.zombiesGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.zombiesGroup.z = 3;

        this.amountAliveZombies = this.amountZombies;

        //Fonte
        this.stage = 1;
        this.scoreText = this.game.add.text(151, 28, this.score, {
            font: '25px arcade_normalregular',
            fill: '#ffffff',
            align: 'right'
        });
        this.scoreText.setText(0);
        this.roundText = this.game.add.text(751, 28, this.stage, {
            font: '25px arcade_normalregular',
            fill: '#ffffff',
            align: 'right'
        });
        this.roundText.setText(0);
        this.amountPeopleText = this.game.add.text(400, 17, this.amountPeopleMethod, {
            font: '25px arcade_normalregular',
            fill: '#ffffff',
            align: 'right'
        });
        this.amountPeopleText.setText(0);

        this.Stage();
    };

    Game.prototype.update = function() {
        // this.groupGame.sort('y', Phaser.Group.SORT_ASCENDING);
        this.hit();
        this.initRound();
        // this.boundWorld(this.groupGame);
        this.gameOver(this.amountPeople);
        this.updateTarget();
    };

    Game.prototype.punctuate = function(points) {
        this.score += points;
        this.scoreText.setText(this.score);
        if (this.score > 9) {
            this.scoreText.x = 127;
        } else if (this.score > 99) {
            this.scoreText.x = 103;
        } else if (this.score > 999) {
            this.scoreText.x = 89;
        }
    };

    Game.prototype.Stage = function() {
        this.roundText.setText(this.stage);
        if (this.stage > 9) {
            this.roundText.x = 727;
        } else if (this.stage > 99) {
            this.roundText.x = 703;
        }
    };

    Game.prototype.amountPeopleMethod = function(amountPeople) {
        this.amountPeopleText.setText(this.amountPeople);
        if (this.amountPeople > 9) {
            this.amountPeopleText.x = 424;
        } else if (this.amountPeople > 9) {
            this.amountPeopleText.x = 448;
        }
    };

    Game.prototype.gameOver = function(amountPeople) {
        var game = this.game;
        game.lastScore = this.score;
        game.lastRound = this.stage;
        if (amountPeople === 0 && !this.createGame) {
            this.soundGame.pause();
            this.soundGame.stop();
            // setTimeout(function() {
                // game.world.setBounds(0, 0, 800, 480);
            game.state.start('gameover', GameOver);
            // }, 500);
        }
    };

    Game.prototype.collisionHandler = function(zombie, person) {
        if (person.alive) {
            person.killBy(zombie);
        }
    };

    Game.prototype.initPeople = function() {
        // this.idPerson += 1;
        var person = new Person(this);
        this.peopleGroup.add(person);
        // this.groupPeople.push(person);
        // this.groupGame.add(person.spritePerson);
        this.amountPeople += 1;
        this.createGame = false;
        this.amountPeopleMethod(this.amountPeople);
    };


    Game.prototype.initZombies = function(person) {
        // this.idZombie += 1;
        var zombie = new Zombie(this, person);
        this.zombiesGroup.add(zombie);
        // this.groupGame.add(zombie.spriteZombie);
        // this.groupZombies.push(zombie);
        this.createGame = true;
        this.amountZombies += 1;
    };

    // Game.prototype.boundWorld = function(group) {
    //     group.forEach(function(object) {

    //         if (object.y < 400 || object.body.y > 800) {
    //             object.body.velocity.y *= -1;
    //         }

    //     });
    // };


    Game.prototype.hit = function() {
        // for (var i = 0; i < this.groupPeople.length; i++) {
        //     for (var j = 0; j < this.groupZombies.length; j++) {
        //         if (this.groupZombies[j].alive) {
        //             if (this.intersect(this.groupPeople[i].spritePerson, this.groupZombies[j].spriteZombie)) {
        //                 this.collisionHandler(this.groupZombies[j], this.groupPeople[i]);
        //             }
        //         }
        //     }
        // }
        this.game.physics.arcade.overlap(this.zombiesGroup, this.peopleGroup, this.collisionHandler, null, this);
    };

    Game.prototype.initRound = function() {
        if (this.amountZombiesDead >= this.stage * 10) {
            this.amountAliveZombies += this.stage + 3;
            this.game.time.events.repeat(Phaser.Timer.SECOND * 2, 5, this.initPeople, this);
            this.game.time.events.repeat(Phaser.Timer.SECOND * 4, 8, this.initZombies, this);
            this.stage += 1;
            this.Stage();
        }
    };

    Game.prototype.updateTarget = function() {
        this.target.x = this.game.input.x;
        this.target.y = this.game.input.y;
    };


    // Game.prototype.intersect = function(object1, object2) {
    //     if (object1.body.right <= object2.body.position.x) {
    //         return false;
    //     }

    //     if (object1.body.bottom <= object2.body.position.y) {
    //         return false;
    //     }

    //     if (object1.body.position.x >= object2.body.right) {
    //         return false;
    //     }

    //     if (object1.body.position.y >= object2.body.bottom) {
    //         return false;
    //     }

    //     return true;
    // };

    // Game.prototype.ZombieFollowPerson = function() {
    //     for (var j = 0; j < this.groupZombies.length; j++) {

    //         if (this.groupZombies[j].alive && this.groupZombies[j].block === false) {
    //             for (var i = 0; i < this.groupPeople.length; i++) {
    //                 var velocityX = this.groupZombies[j].spriteZombie.body.velocity.x;
    //                 var velocityY = this.groupZombies[j].spriteZombie.body.velocity.y;
    //                 if (this.distanceBetweenBody(this.groupZombies[j], this.groupPeople[i]) < 20); {
    //                     this.groupZombies[j].block = true;
    //                     this.groupPeople[i].block = true;
    //                     this.moveZombieToPerson(this.groupZombies[j], this.groupPeople[i]);
    //                 }
    //             }
    //         }
    //     }

    // };

    // Game.prototype.moveZombieToPerson = function(zombie, person) {
    //     var velocityX = zombie.velocity0X;
    //     var velocityY = zombie.velocity0Y;

    //     if (person.alive) {
    //         this._angle = Math.atan2(person.spritePerson.y - zombie.spriteZombie.y, person.spritePerson.x - zombie.spriteZombie.x);

    //         zombie.spriteZombie.body.velocity.x = Math.cos(this._angle) * 20;
    //         zombie.spriteZombie.body.velocity.y = Math.sin(this._angle) * 20;
    //     } else {
    //         zombie.spriteZombie.body.velocity.x = velocityX;
    //         zombie.spriteZombie.body.velocity.y = velocityY;
    //     }


    //     return this._angle;
    // };

    // Game.prototype.distanceBetweenBody = function(source, target) {
    //     this._dx = source.x - target.x;
    //     this._dy = source.y - target.y;
    //     return Math.sqrt(this._dx * this._dx + this._dy * this._dy);
    // };
    
}(this));
