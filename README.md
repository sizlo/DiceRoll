Dice Roll
=========

A slack integration that performs dice rolls.

Hosted on Heroku at https://warm-depths-57943.herokuapp.com

## Commands

1. Roll a dice with Y sides X number of times.
  
   `/roll [XdY]`

2. Pick a random user from the current conversation

   `/randomuser`

   For private conversations the `@dice_roll` user will need to be added to the conversation

3. Pick a random user from a usergroup

   `/randomuser @someusergroup`

## Running locally

1. Install dependencies
   
   `npm install`

2. Set the `SLACK_TOKEN` envar
   
   `export SLACK_TOKEN=<some token>`
    
3. Run the app with node
   
   `npm start`

## Deployment

Add heroku as a remote

`git remote add heroku https://git.heroku.com/warm-depths-57943.git`

To deploy from master:

`git push heroku`

To deploy from another branch

`git push heroku another_branch:master`
