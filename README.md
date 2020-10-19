# Haunted Tiles

Haunted Tiles is an application to pit student-developed ai against each other in a fun game.

## Game Details

The game looks like this:

It is a 5 by 5 board of breaking tiles. With two teams (home & away) each with 3 players represented by cute monsters. Every turn the monsters move one tile or remain on their current tile by jumping. Every time that a tile is stepped on (jumping is a step) by a monster that tile breaks more. Every tile can sustain three steps. That is on the 3rd step the tile will break and any number of monsters on that step will fall to their death. Monsters can also fall to their death if they walk off the 5 x 5 board. The game is over when all three monsters on one team have fallen to their death.

The objective to the game is to remain on the board longer than your opponent. 

You will code an AI that will send instructions to your team on how each monster should move. 


## To Compete

This section walks you through the necessary steps to compete in this coding competition. If you have any questions email us at hauntedtiles@tylertech.com

### Step 1: Register

Register by visiting https://haunted-tiles.tylerdev.io/register and filling out the form.

### Step 2: Code

The competition opens on DATE. 

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
You can see the app running by visiting localhost:4200 in your favorite browser.

#### Developing your AI

Your AI will be written in Javascript a common web technology. 

The game engine is expecting a main function with two parameters, gameState and side. And it is expecting the function to return an array with three dirctions.

For example look at this main function:

```
function main(gameState, side) {
    return ['south', 'south', 'south'];
  }
 ```

We have mocked out a blank AI called development.ai.ts

You can find it along with example AIs in the following folder: src > app > game > ai 

This folder is the best place to start!

#### Testing your AI

We have included three different ways to test your AI up to your preference.

1) You can develop all your code in the development.ai.ts script and chose the "Development" Team Config to run against other test AIs.

2) You can directly paste either a publically hosted raw file link (for example on github) or your javascript code into the test box and click run.

3) You can add a new team config using the Add Team box. (You will want to use this if you would like to test different AIs you've developed against each other) 

NOTE: No matter how you test make sure you test your final AI with the Add Team Box. This will ensure successful submission of your code to the competition.

### Step 3: Submission

STOP! Have you testing your script using the Add Team Box yet?

Once you are happy with your AI you can submit your code directly in your local app on the Submission tab. 

Either paste your script directly in the submit box or submit a URL to the raw file publically hosted.

Note: Make sure your team name matches the same team name you submitted on the Registration Form. 


### Step 4: Competition

The competition will be live streamed on TWITCH.TV. Follow us at https://www.twitch.tv/tylertechnologies


