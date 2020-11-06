# Haunted Tiles

Haunted Tiles is an application to pit student-developed ai against each other in a fun game.

## Game Details

The game looks like this:

![Game image](/src/docs/Game.PNG)

Here is the UI Annotated:

![Game image annotated](/src/docs/GameAnnotated.PNG)

### Description
The game starts with a 7 by 7 board of breaking tiles. On the board are two teams (home & away) each with 3 players represented by cute monsters. Every turn the monsters move one tile or remain on their current tile by jumping. Every time that a tile is stepped on (jumping is a step) by a monster that tile breaks more. Every tile can sustain three steps. That is on the 3rd step the tile will break and any number of monsters on that step will fall to their death. Monsters can also fall to their death if they walk off the board. 

The objective to the game is to remain on the board longer than your opponent.

### Board Configs (maps)
The default 7 x 7 board has every tile at full strength. There are different maps that you can test your AI on. For the competition we will be cycling through different maps each round within a match.  

### How to win a round
A round is over when all three monsters on one team have fallen to their death. The team that has any number of monsters still alive wins the round.

#### Tie States

In the event that both teams lose their last monsters on the same turn the winner is determined by which team has broken the most tiles. 

In the event that both teams broke the same number of tiles than that round is declared a tie and another round begins.

### How to Win a Match

A match is comprised with an Odd number of rounds. The winner of the match is whoever has won the most rounds. For example if a match is comprised of 5 rounds then the team who wins 3 rounds wins the match.

#### Tie States

If a match ends with the rounds won between two teams tied then we will play singular rounds until a team wins one more. For example if at the end of 5 rounds the round count is 2-2-1. That is 2 wins for the home team, 2 wins for the away team, and 1 tie; then the winner of the next round will win the entire match. 

If two teams tie all 5 rounds of a match or tie to the count of 10 rounds, then a coin toss will determine the winner of the match. For eample at the end of 5 rounds if the count is 0-0-5 then we will coin toss. If at the end of 5 rounds the count is 1-1-2 or 2-2-1 and we keep playing rounds to determine the winner and those rounds keep tying to the count of 1-1-8 or 2-2-6. Then the winner is determined by a coint toss.


## To Compete

This section walks you through the necessary steps to compete in this coding competition. If you have any questions email us at hauntedtiles@tylertech.com

### Step 1: Register

Register by visiting https://haunted-tiles.tylerdev.io/register and filling out the form.

### Step 2: Code

If you are reading this than the competition has begun. Please read the game details thoroughly above. 

Given the game details you will code an AI that will send instructions to your team on how each monster should move. 

#### Prerequisites

Ensure your computer is ready by installing the following 

latest stable version of node (LTS) here -> https://nodejs.org/en/

(Optional) Git here -> https://git-scm.com/book/en/v2/Getting-Started-Installing-Git

#### Getting the Code

You can clone the repo in two ways:

Using the command: git clone https://github.com/tyler-technologies-oss/codecomp-dropper.git

Or visiting https://github.com/tyler-technologies-oss/codecomp-dropper and clicking code -> download zip

#### Running the Code

After downloading or installing open the project in your favoriate IDE. We recommend the lightweight Visual Stuido Code. Check it out here -> https://code.visualstudio.com/download

At the top level directiory run

```npm install```

After initial installation you can run the app with

```npm start```

This will start the app on your local machine. 

You can see the app running by visiting http://localhost:4200 in your favorite browser.

#### Developing your AI

Your AI will be written in Javascript, a common web technology. 

The game engine is expecting a main function with two parameters, gameState and side. And it is expecting the function to return an array with three directions.

For example look at this main function:

```
function main(gameState, side) {
    return ['south', 'south', 'south'];
  }
 ```
Here are the interfaces of the data you receive. You can look at example scripts to build ideas on how you can leverage the data

```
export interface IGameState {
  boardSize: [number, number];
  tileStates: TileState[][];
  teamStates: TeamStates;
}

export enum TileState {
  Good = 3,
  Warning = 2,
  Danger = 1,
  Broken = 0,
}

export enum Side {
  Home = 'home',
  Away = 'away',
}

export enum MoveDirection {
  North = 'north',
  South = 'south',
  East = 'east',
  West = 'west',
  None = 'none',
}

export type TeamStates = Record<Side, ITeamMemberState[]>;

export interface ITeamMemberState {
  coord: Coord;
  isDead: boolean;
}

export type Coord = [number, number];
```

There are three ways you can develop your AI.

1. Using the included blank AI file
2. Using the realtime in app Code Editor Window
3. Adding a team config with you script 

***Using the included blank AI file***
We have mocked out a blank AI called development.ai.ts

You can find it along with example AIs in the following folder: src > app > game > ai 

This AI appears in the dropdown config as "Development Team"

***Using the realtime in app Code Editor Window***

See the picture below, by clicking the button you will launch a window where you can code with syntax highlighting.

As long as you keep the app running this window will keep you code saved. You can run that code against other team configs and also download it to submit! 

![Code Window](/src/docs/CodeWindow.PNG)

***Adding a team config***

By clicking the add button you can add a team config with a github script link or the script pasted in like a string. 

This can be advantagous as you can write multiple scripts and test them against each other.

This also aligns with how submitted code will work.

I recommend that everyone add your final script as a team to make sure it will submit correctly through the submission form.

#### Testing your AI

We have included three different ways to test your AI up to your preference.

1) You can develop all your code in the development.ai.ts script and chose the "Development" Team Config to run against other test AIs.

2) You can directly code in the developer window and click run.

3) You can add a new team config using the Add Team box. (You will want to use this if you would like to test different AIs you've developed against each other) 

NOTE: No matter how you test make sure you test your final AI with the Add Team Box. This will ensure successful submission of your code to the competition.

### Step 3: Submission

STOP! Have you tested your script using the Add Team Box yet?

Once you are happy with your AI you can submit your code directly in your local app on the Submission tab. 

Either paste your script directly in the submit box or submit a URL to the raw file that is publically hosted.

Note: Make sure your team name matches the same team name you submitted on the Registration Form. 


### Step 4: Competition

The competition will be live streamed on TWITCH.TV. Follow us at https://www.twitch.tv/tylertechnologies

#GOOD LUCK


