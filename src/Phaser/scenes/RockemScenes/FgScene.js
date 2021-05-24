import {
  teamsRef,
  getTeamPlayers,
  updateTeamPoints,
} from '../Firebase/index';

import Player from '../../entities/RockemEntities/Player';
import Opponent from '.../../entities/RockemEntities/Opponent';
import Ground from '../../entities/RockemEntities/Ground';


export default class FgScene extends Phaser.Scene {
  constructor() {
    super('FgScene');

    this.Teams = [
      {
        id: 0,
        sprite: {},
        spriteKey: 'Boxing01',
        color: 'red',
        playerIds: [],
        playerNames: [],
        points: 0,
        scoreText: {},
        teamNameText: 'Team 1',
        winner: false
      },
      {
        id: 1,
        sprite: {},
        spriteKey: 'Boxing03',
        color: 'blue',
        playerIds: [],
        playerNames: [],
        points: 0,
        scoreText: {},
        teamNameText: 'Team 2',
        winner: false
      },
    ];
    this.spawned = false;
    this.gameId;
    this.myId;
    this.myTeamId;
    this.pointsToWin = 10;

    // Bind callback functions to the object context
    this.addPlayersToGame = this.addPlayersToGame.bind(this);
    this.manageTeams = this.manageTeams.bind(this);
    this.updateTeam = this.updateTeam.bind(this);

  }

  initialBoxerPositions() {
    this.initX = { 0: 100, 1: 600 };
    this.initY = 100;
  }

  preload() {
    // Preload Sprites
    this.load.multiatlas('boxingsprites', 'assets/rockemGame/spriteSheets/boxingsprites.json', 'assets/rockemGame/spriteSheets');
    this.load.image('ground', 'assets/rockemGame/sprites/transparentground.png');
    this.gameId = Number(window.localStorage.getItem('gameId'));
    this.myId = Number(window.localStorage.getItem('idKey'));
  
    // Preload Sounds
    this.load.audio('punch', 'aassets/rockemGame/audio/jump.wav');
    this.load.audio('hit', 'assets/rockemGame/audio/laser.wav');
    this.load.audio('defeat', 'assets/rockemGame/audio/scream.wav');
  }

  createGround(x, y) {
    this.groundGroup.create(x, y, 'ground');
  }

  // spritePrefix: 'Boxing01', 'Boxing03'
  // colorkeys: 'RED', 'BLUE'
  createAnimations(colorkey, spritePrefix) { 
    this.anims.create({
      key: `walk_${spritePrefix}`,
      frames: this.anims.generateFrameNames('boxingsprites', { 
        prefix: `${colorkey}/Walk/__${spritePrefix}_Walk_`,
        zeroPad: 3,
        start: 0, 
        end: 9 
      }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: `walkback_${spritePrefix}`,
      frames: this.anims.generateFrameNames('boxingsprites', { 
        prefix: `${colorkey}/WalkBack/__${spritePrefix}_WalkBack_`,
        zeroPad: 3,
        start: 0, 
        end: 9 
      }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: `idle_${spritePrefix}`,
      frames: this.anims.generateFrameNames('boxingsprites', { 
        prefix: `${colorkey}/Idle/__${spritePrefix}_Idle_`,
        zeroPad: 3,
        start: 0, 
        end: 9 
      }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: `guard_${spritePrefix}`,
      frames: this.anims.generateFrameNames('boxingsprites', { 
        prefix: `${colorkey}/Blocking/__${spritePrefix}_Blocking_`,
        zeroPad: 3,
        start: 0, 
        end: 9 
      }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: `punchleft_${spritePrefix}`,
      frames: this.anims.generateFrameNames('boxingsprites', { 
        prefix: `${colorkey}/PunchLeft/__${spritePrefix}_PunchLeft_`,
        zeroPad: 3,
        start: 0, 
        end: 5
      }),
      frameRate: 60,
      repeat: 0,
    });
    this.anims.create({
      key: `punchright_${spritePrefix}`,
      frames: this.anims.generateFrameNames('boxingsprites', { 
        prefix: `${colorkey}/PunchRight/__${spritePrefix}_PunchRight_`,
        zeroPad: 3,
        start: 0, 
        end: 5 
      }),
      frameRate: 60,
      repeat: 0,
    });
    this.anims.create({
      key: `punchup_${spritePrefix}`,
      frames: this.anims.generateFrameNames('boxingsprites', { 
        prefix: `${colorkey}/PunchUp/__${spritePrefix}_PunchUp_`,
        zeroPad: 3,
        start: 0, 
        end: 6 
      }),
      frameRate: 10,
      repeat: 0,
    });
    this.anims.create({
      key: `hurt_${spritePrefix}`,
      frames: this.anims.generateFrameNames('boxingsprites', { 
        prefix: `${colorkey}/Hurt/__${spritePrefix}_Hurt_`,
        zeroPad: 3,
        start: 0, 
        end: 6 
      }),
      frameRate: 10,
      repeat: 0,
    });
    this.anims.create({
      key: `dizzy_${spritePrefix}`,
      frames: this.anims.generateFrameNames('boxingsprites', { 
        prefix: `${colorkey}/Dizzy/__${spritePrefix}_Dizzy_`,
        zeroPad: 3,
        start: 0, 
        end: 7 
      }),
      frameRate: 10,
      repeat: 0,
    });
    this.anims.create({
      key: `ko_${spritePrefix}`,
      frames: this.anims.generateFrameNames('boxingsprites', { 
        prefix: `${colorkey}/KO/__${spritePrefix}_KO_`,
        zeroPad: 3,
        start: 0, 
        end: 9 
      }),
      frameRate: 8,
      repeat: 0,
    });
  }

  create() {
    // Create game entities

    // Load team and player info from Firebase
    this.manageTeams()

    // Get db reference to teams for updating
    this.teamsRef = teamsRef(this.gameId, 'rockemGame');

    //SCOREBOARD
    this.team1NameText;
    this.team1NameText = this.add.text(18, 18, 'Team 1', {
      fontSize: '18px',
      fill: 'white',
    })
    this.score1Text;
    this.score1Text = this.add.text(18, 38, 'Points: 0', {
      fontSize: '25px',
      fill: 'white',
    });

    this.team2NameText = this.add.text(600, 18, 'Team 2', {
      fontSize: '18px',
      fill: 'white',
    })
    this.score2Text;
    this.score2Text = this.add.text(600, 38, 'Points: 0', {
      fontSize: '25px',
      fill: 'white',
    });

    // The Player
    this.player = new Player(this, 100, -1-0, 'boxingsprites', 'RED/Walk/__Boxing01_Walk_000')
    .setScale(0.75)
    .setSize(50,600);

    this.player.body.collideWorldBounds = true;
    this.player.body.setAllowDrag(true);
    this.player.body.setDrag(100,0);
    this.player.body.setFriction(0.7,0);

    const team1 = this.Teams[0];
    team1.sprite = this.player; //bind player sprite to red team
    //this.player.play(team1.color);
    team1.scoreText = this.score1Text;
    team1.teamNameText = this.team1NameText;
    
      
    // The Opponent
    this.opponent = new Opponent(this, 600, -100, 'boxingsprites', 'BLUE/Walk/__Boxing03_Walk_000')
    .setScale(.75)
    .setSize(300,600);
    this.opponent.body.collideWorldBounds = true;
    this.opponent.body.setAllowDrag(true);
    this.opponent.body.setDrag(100,0);
    this.opponent.body.setFriction(0.7,0);
  
    const team2 = this.Teams[1];
    team2.sprite = this.opponent; //bind opponent sprite to blue team
    //this.opponent.play(team2.color);
    team2.scoreText = this.score2Text;
    team2.teamNameText = this.team2NameText;
    

    this.groundGroup = this.physics.add.staticGroup({ classType: Ground });
    this.createGround(0, 600);
    this.createGround(801, 600);
    
    // Create sounds
    this.punchSound = this.sound.add('punch');
    this.defeatSound = this.sound.add('defeat');

    // Create animations
    this.createAnimations('RED', 'Boxing01');
    this.createAnimations('BLUE', 'Boxing03');

    //console.log("Anims===>", this.anims)

    // Create collisions for all entities
    this.physics.add.collider(this.player, this.groundGroup);
    this.physics.add.collider(this.opponent, this.groundGroup);

    // Assign the cursors
    this.cursors = this.input.keyboard.createCursorKeys();
    //console.log("Cursors===>", this.cursors)

    // Check if game over or increment team points for each spacebar press
    this.input.keyboard.on('keydown_SPACE', () => {
      const myTeam = this.Teams[this.myTeamId];
      const otherTeam = this.Teams.filter(team => team.id !== myTeam.id)[0]
      let points = myTeam.points;
      let otherPoints = otherTeam.points;
      let winner;
      let loser;

      //Set sprites to fighting position
      if(this.player.x !== 250 && points === 0)
        this.player.setX(250);
        
      if(this.opponent.x !== 425 && points === 0)
        this.opponent.setX(425);

      if(points > this.pointsToWin - 1 || otherPoints > this.pointsToWin - 1 && points !== otherPoints) {
        console.log("GAME OVER");
        winner = points > otherPoints ? myTeam : otherTeam;

        //play Idle animation
        winner.sprite.updateMovement('idle', winner.spriteKey);

        if (winner === myTeam)
          loser = otherTeam
        else
          loser = myTeam

        //play go to corner animation
        winner.sprite.goCorner(winner.spriteKey);

        //play KO anmimation
        loser.sprite.KO(loser.spriteKey);

      } else if (points > this.pointsToWin && points === otherPoints) {
        console.log("DRAW");
        winner.sprite.updateMovement('idle', winner.spriteKey);
        loser.sprite.updateMovement('idle', loser.spriteKey);
      }
      else {
        points++;
        console.log(`Team ${this.myTeamId} Points: `, points);
        this.updateTeam(this.myTeamId, points); // update teams points
        const key = points % 2 === 0 ? 'punchleft' : 'punchright';
        myTeam.sprite.updateMovement(key, myTeam.spriteKey);
       } 
    });

  }

  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {
    const myTeam = this.Teams[this.myTeamId];
    if (myTeam) {
      let currentPoints = myTeam.points;
      this.teamsRef.child(`${this.myTeamId}`).update({ points: currentPoints });
    }
  }

  addPlayersToGame(data, teamId) {
    const myTeam = this.Teams[teamId];
    data.forEach((player) => {
      const team = this.Teams[teamId];

      if(player.playerId === this.myId) {
        this.myTeamId = teamId;
        window.localStorage.setItem('myTeamId', teamId);
      }
      team.playerIds.push(player.playerId);
      team.playerNames.push(player.name);
    });

    myTeam.teamNameText.setText(this.Teams[teamId].playerNames.join('/'));

  }

  manageTeams() {
    this.Teams.forEach( team => {
      getTeamPlayers(this.gameId, 'rockemGame', team.id, this.spawned, this.addPlayersToGame);
      this.listenerOff = updateTeamPoints(
        this.gameId,
        team.id,
        this.updateTeam
      );
    })
  }

  updateTeam(teamId, currentPoints) {
    const teamToUpdate = this.Teams[teamId];
    teamToUpdate.points = currentPoints;
    teamToUpdate.scoreText.setText('Points: ' + currentPoints);
  }
}
