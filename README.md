# CLI BattleShip

> All you need is a current installation of node. No external modules are used, so you don't need to run npm install. 

## Table of Contents

1. [Requirements](#requirements)
1. [Installation](#installation)
1. [Gameplay](#gameplay)
> This is a two-player game that takes place in a single terminal. Take turns -- and don't peek!
   1. [Start the Game](#start-the-game)
   1. [Enter Names](#enter-names)
   1. [Ship Placement](#ship-placement) 
   1. [Attacks](#attacks)  

##Requirements
- Node 0.10.x

##Installation
> No external modules are used. No need to use npm install. 

##Gameplay

###Starting the Game

Type node index from within the root directory. 

###Enter Names

Player one goes first, player two goes second. Enter your name after the prompt and hit enter.

### Ship Placement

Player two -- look away! 

Player one places all 5 ships, then player two does the same. The first thing you will see,
when it's your turn to place, is your blank board, then the list of ships you can place on it. 

Here's an example: 

>     Player One, begin your ship placements. Your current board is:
>     
>        1  2  3  4  5  6  7  8  9  10
>     1  oo oo oo oo oo oo oo oo oo oo
>     2  oo oo oo oo oo oo oo oo oo oo
>     3  oo oo oo oo oo oo oo oo oo oo
>     4  oo oo oo oo oo oo oo oo oo oo
>     5  oo oo oo oo oo oo oo oo oo oo
>     6  oo oo oo oo oo oo oo oo oo oo
>     7  oo oo oo oo oo oo oo oo oo oo
>     8  oo oo oo oo oo oo oo oo oo oo
>     9  oo oo oo oo oo oo oo oo oo oo
>     10 oo oo oo oo oo oo oo oo oo oo
>     
>     (oo indicates open spots, letters indicate a ship is placed there)
>      
>     Your remaining ships to place are:
>      CARRIER (length: 5)
>      BATTLESHIP (length: 4)
>      CRUISER (length: 3)
>      SUBMARINE (length: 3)
>      DESTROYER (length: 2)

This is followed by a prompt to place a ship. Here's what it looks like: 
  
>     Which ship do you want to place?
>     Enter its name (not case sensitive):

Enter one of the names from the list, for example, carrier. When you do that, you'll see the following prompt: 

>     Where do you want to place your carrier?
>     Valid input format is row,column direction (example: 1,1 down). Enter here: 

When you enter a correct input, the placement will start your ship at the row,column point on your board, and move 
however many points the ship is long in the direction you entered. For example, if your current ship is the carrier 
and you enter 1,1 down, your board should look like: 

>        1  2  3  4  5  6  7  8  9  10
>     1  CA oo oo oo oo oo oo oo oo oo
>     2  CA oo oo oo oo oo oo oo oo oo
>     3  CA oo oo oo oo oo oo oo oo oo
>     4  CA oo oo oo oo oo oo oo oo oo
>     5  CA oo oo oo oo oo oo oo oo oo
>     6  oo oo oo oo oo oo oo oo oo oo
>     7  oo oo oo oo oo oo oo oo oo oo
>     8  oo oo oo oo oo oo oo oo oo oo
>     9  oo oo oo oo oo oo oo oo oo oo
>     10 oo oo oo oo oo oo oo oo oo oo

Note that the ships cannot overlap with each other, and cannot start out of bounds, nor go out of bounds when the placement moves
in your chosen direction. This means you can't enter 10,10 down -- the movement will go out of bounds. If an invalid placemnt is 
made, you will see an error message, then you can enter a new placement.

All these prompts and displays repeat till player one has placed all five ships in valid locations. Here's an example of a board with all 
the ships placed: 

>        1  2  3  4  5  6  7  8  9  10
>     1  CA oo oo oo oo oo oo oo oo oo
>     2  CA oo oo oo oo oo oo oo oo oo
>     3  CA oo oo oo oo oo oo oo oo oo
>     4  CA oo oo oo oo BA BA BA BA oo
>     5  CA oo oo oo oo oo oo oo oo oo
>     6  oo oo oo oo oo oo oo oo oo oo
>     7  oo oo oo oo oo oo oo oo oo oo
>     8  oo SU SU SU oo oo oo oo oo DE
>     9  oo oo oo oo oo oo oo oo oo DE
>     10 oo oo CR CR CR oo oo oo oo oo

After player one finishes placing, he or she should look away and let player two begin placing. After placements are complete, there won't 
be a need to keep looking away from the terminal. You'll both be attacking a public version of each other's boards. 

### Attacks

Now that both players have privately assigned all the ships, it's time to begin the attack phase of the game. Player one will begin 
attacking first, then player two goes, and you will keep switching back and forth till one of you has sunk all of the other player's ships. 

Here's what player one will see, when the attack phase begins:

>      ~~~~~ BEGIN THE BATTLE ~~~~~
>     
>     Ship placement is over! Now, the game begins.
>     Vincent has the first move. All the enemy ships hidden are hidden on this board:
>     
>         1  2  3  4  5  6  7  8  9  10
>      1  oo oo oo oo oo oo oo oo oo oo
>      2  oo oo oo oo oo oo oo oo oo oo
>      3  oo oo oo oo oo oo oo oo oo oo
>      4  oo oo oo oo oo oo oo oo oo oo
>      5  oo oo oo oo oo oo oo oo oo oo
>      6  oo oo oo oo oo oo oo oo oo oo
>      7  oo oo oo oo oo oo oo oo oo oo
>      8  oo oo oo oo oo oo oo oo oo oo
>      9  oo oo oo oo oo oo oo oo oo oo
>      10 oo oo oo oo oo oo oo oo oo oo
>     
>     (oo shows unattacked spots, -- shows misses, XX shows hits)
>     
>     Attack by entering a row,column pair:

The board here is player one's public board. When player one makes an attack at a point on this board, the game checks if the enemy has a ship
located at that point in his or her private board. If there is a hit, then player one will see XX at the point on this public board, or will see --
if it is a miss. If a player attacks a point that he or she has already attacked, or if the attack is invalid in formatting or goes out of bounds, 
an error message will show, and this player can try again till a valid attack is made. 

For exampe, let's say player one enters 1,1, but player two does not have any ship there. Player one's public board will now be: 

>         1  2  3  4  5  6  7  8  9  10
>      1  -- oo oo oo oo oo oo oo oo oo
>      2  oo oo oo oo oo oo oo oo oo oo
>      3  oo oo oo oo oo oo oo oo oo oo
>      4  oo oo oo oo oo oo oo oo oo oo
>      5  oo oo oo oo oo oo oo oo oo oo
>      6  oo oo oo oo oo oo oo oo oo oo
>      7  oo oo oo oo oo oo oo oo oo oo
>      8  oo oo oo oo oo oo oo oo oo oo
>      9  oo oo oo oo oo oo oo oo oo oo
>      10 oo oo oo oo oo oo oo oo oo oo

It will now be player two's turn. He or she will see his or her own public board, which, the first time around, will not have any marks on it. Player
two will be prompted to attack. If he or she enters 1,1, and player one has a ship located there, then player two's public board will now be: 

>         1  2  3  4  5  6  7  8  9  10
>      1  XX oo oo oo oo oo oo oo oo oo
>      2  oo oo oo oo oo oo oo oo oo oo
>      3  oo oo oo oo oo oo oo oo oo oo
>      4  oo oo oo oo oo oo oo oo oo oo
>      5  oo oo oo oo oo oo oo oo oo oo
>      6  oo oo oo oo oo oo oo oo oo oo
>      7  oo oo oo oo oo oo oo oo oo oo
>      8  oo oo oo oo oo oo oo oo oo oo
>      9  oo oo oo oo oo oo oo oo oo oo
>      10 oo oo oo oo oo oo oo oo oo oo

The gameplay then goes back to player one's attack. The previous miss will still be recorded on this board. If player one scores a hit at 6,9, then, 
player one's public board will now be: 

>         1  2  3  4  5  6  7  8  9  10
>      1  -- oo oo oo oo oo oo oo oo oo
>      2  oo oo oo oo oo oo oo oo oo oo
>      3  oo oo oo oo oo oo oo oo oo oo
>      4  oo oo oo oo oo oo oo oo oo oo
>      5  oo oo oo oo oo oo oo oo oo oo
>      6  oo oo oo oo oo oo oo oo XX oo
>      7  oo oo oo oo oo oo oo oo oo oo
>      8  oo oo oo oo oo oo oo oo oo oo
>      9  oo oo oo oo oo oo oo oo oo oo
>      10 oo oo oo oo oo oo oo oo oo oo

This sequence repeats till either player has hit every spot on the other player's private board that has a ship in it. For instance, taking the 
complete example board for player one from above, player two's winning public board may look like: 

>        1  2  3  4  5  6  7  8  9  10
>     1  XX -- oo oo oo oo oo -- oo oo
>     2  XX oo oo oo oo oo oo oo oo oo
>     3  XX oo oo oo oo oo oo oo oo oo
>     4  XX oo oo oo oo XX XX XX XX --
>     5  XX oo -- oo oo oo oo oo oo oo
>     6  oo oo oo oo -- oo oo oo oo oo
>     7  oo oo oo oo oo oo oo oo oo oo
>     8  -- XX XX XX oo oo oo oo oo XX
>     9  oo oo oo oo oo oo oo oo oo XX
>     10 oo oo XX XX XX oo oo oo oo --


When either player has won, you'll see a game over prompt. The game will then end. To play again, type in node index and start again! 

Enjoy!

