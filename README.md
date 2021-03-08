# REELS OF FORTUNE slot machine game
 A web-based slot machine game built in JavaScript using the P5.js library.
 
 <b>Can you win the Jackpot?</b> 
 
 
 Player starts with 100 credits. Each spin costs 1 credit.  
 Score information can be shown by clicking the pay table in right-bottom corner.   
 
 Under the game window, checking the <i><b>Debug Menu</b></i> button will reveal controls for debugging the game. The game originally runs randomly, but by using this menu the player can fix what symbol lands on which line per reel.
 It is also possible to make the values random by choosing '<i>Random Symbol</i>' or '<i>Random Line</i>' for each reel.  
 
 Another use for the Debug Menu is to add credits. Note that the minimum value is 1 credit, and the maximum is 5,000 credits. 
 
 ### Current Issues / Missing Key Features:
 * The reels are supposed to stop in the following order: left reel after 2 seconds, center reel follows by 0.5 seconds, lastly the right reel after another 0.5 seconds. Making the entire round last about 3 seconds. This is currently not happening the way it is intended to, as to how I made the reels loop. High scroll speeds make it quite difficult for the engine to catch the smaller distance changes between a reel and its planned stop point, and it almost always passes it between one frame and the next. A possible solution is to not let the engine reed the distances to stop, but actually redraw the symbols where they're supposed to land after the spinning time has elapsed. I'd like to try this solution later on and see if it impacts the visual perceptions of the player.
  
 * The game is planned to have an  '<i><b>Add Balance</b></i>' below the balance indicator. Hence, the little empty space below it.
  
