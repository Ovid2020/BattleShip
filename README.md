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

##Requirements
- Node 0.10.x

##Installation
> No external modules are used. No need to use npm install. 

##Gameplay

###Starting the Game

Type node index from within the root directory. 

###Enter Names

Player one goes first, player two goes second. Enter your name after the prompt and hit enter.

## Ship Placement

Player two -- look away! 

Player one places all 5 ships, then player two does the same. The first thing you will see,
when it's your turn to place, is your blank board, then the list of ships you can place on it. 

Here's an example: 

>  Player One, begin your ship placements. Your current board is:
>
>     1  2  3  4  5  6  7  8  9  10
>  1  oo oo oo oo oo oo oo oo oo oo
>  2  oo oo oo oo oo oo oo oo oo oo
>  3  oo oo oo oo oo oo oo oo oo oo
>  4  oo oo oo oo oo oo oo oo oo oo
>  5  oo oo oo oo oo oo oo oo oo oo
>  6  oo oo oo oo oo oo oo oo oo oo
>  7  oo oo oo oo oo oo oo oo oo oo
>  8  oo oo oo oo oo oo oo oo oo oo
>  9  oo oo oo oo oo oo oo oo oo oo
>  10 oo oo oo oo oo oo oo oo oo oo
>
>  (oo indicates open spots, letters indicate a ship is placed there)
>
>  Your remaining ships to place are:
>  CARRIER (length: 5)
>  BATTLESHIP (length: 4)
>  CRUISER (length: 3)
>  SUBMARINE (length: 3)
>  DESTROYER (length: 2)

This is followed by a prompt to place a ship. Here's what it looks like: 
  
>  Which ship do you want to place?
>  Enter its name (not case sensitive):

Enter one of the names from the list, for example, carrier. When you do that, you'll see the following prompt: 

>  Where do you want to place your carrier?
>  Valid input format is row,column direction (example: 1,1 down). Enter here: 

When you enter a correct input, the placement will start your ship at the row,columb point on your board, and move 
however many points the ship is long in the direction you entered. For example, if your current ship is the carrier 
and you enter 1,1 down, your board should look like: 

>     1  2  3  4  5  6  7  8  9  10
>  1  CA oo oo oo oo oo oo oo oo oo
>  2  CA oo oo oo oo oo oo oo oo oo
>  3  CA oo oo oo oo oo oo oo oo oo
>  4  CA oo oo oo oo oo oo oo oo oo
>  5  CA oo oo oo oo oo oo oo oo oo
>  6  oo oo oo oo oo oo oo oo oo oo
>  7  oo oo oo oo oo oo oo oo oo oo
>  8  oo oo oo oo oo oo oo oo oo oo
>  9  oo oo oo oo oo oo oo oo oo oo
>  10 oo oo oo oo oo oo oo oo oo oo

All these prompts and displays repeat till player one has placed all five ships in valid locations. Note that the ships cannot overlap 
with each other, and cannot start out of bounds, nor go out of bounds when the placement moves in your chosen direction. This means you 
can't enter 10,10 down -- the movement will go out of bounds. 

After player one finishes placing, he or she should look away and let player two begin placing. After placements are complete, there won't 
be a need to keep looking away from the terminal. You'll both be attacking a public version of each other's boards. 


