
// global variables

var cPage="home";
var homeButton=document.querySelector(".homeB");
var rulesButton=document.querySelector(".rulesB");
var aboutButton=document.querySelector(".aboutB");
var userCards=[];
var playerCount=document.querySelector(".player_count");
var userCardsDisplay=document.querySelector(".user_cards");
var startReset=document.querySelector(".start_reset");
var deck=[];
var deckCount=0;
var colors=["red","yellow","green","blue"];
var cPlayersDisplay=document.querySelector(".computer_players");
var currentCardDisplay=document.querySelector(".current_card");
var playCardButton=document.querySelector(".play_card");
var infoColor=document.querySelector(".current_color");
var infoSymbol=document.querySelector(".current_symbol");
var deckDisplay=document.querySelector(".deck");
var userColors=[];
var userSymbols=[];
var hasPicked=false;
var lastDragged=null;
var colorPickFlag=false;
var colorChoiceButtons=document.querySelectorAll(".colorChoice");
var currentPlayer;
var infoArea=document.querySelector(".info_area");
var sayUno=document.querySelector(".say_uno");
var unoFlag=false;
var haveToSayUno=false;
var ib_count=0;


//
//
//


// event handlers


// event handler to know the last dragged element
document.addEventListener("dragstart",function(event){
    lastDragged=event.target;
});


// event handler for deck
deckDisplay.addEventListener("click",function(e){
    if(gameStatus.turn!="user"||!gameStatus.gameOngoing)
    return;
    addCardFromDeck("user",false);
});


// allowing drop events from only user cards
function allowDropCurrentCard(e)
{
    if(lastDragged.classList.contains("userCard"))
    e.preventDefault();
}


// allowing drop events from only deck
function allowDropUserCards(e)
{
    if(lastDragged.classList.contains("deck"))
    e.preventDefault();
}


// event handlers for page buttons
homeButton.addEventListener("click",function()
{
    homeButton.classList.add("cPage");
    rulesButton.classList.remove("cPage");
    aboutButton.classList.remove("cPage");
});
rulesButton.addEventListener("click",function()
{
    rulesButton.classList.add("cPage");
    homeButton.classList.remove("cPage");
    aboutButton.classList.remove("cPage");
});
aboutButton.addEventListener("click",function()
{
    aboutButton.classList.add("cPage");
    rulesButton.classList.remove("cPage");
    homeButton.classList.remove("cPage");
});

// event handler for user cards
function addEventHandler(userCardButton)
{
    userCardButton.addEventListener("click",function()
    {
        if(gameStatus.turn!="user")
        return;
        var flag=true;
        if(userCardButton.classList.contains("selectedCard"))
            flag=false;
        var eventCards=document.querySelectorAll(".userCard");
        for(var i=0;i<eventCards.length&&flag;i++)
            {
                eventCards[i].classList.remove("selectedCard");
            }
        for(var i=0;i<eventCards.length&&(!flag);i++)
            {
                eventCards[i].classList.remove("selectedCard");
            }
        if(flag)
        userCardButton.classList.add("selectedCard");
        else
        userCardButton.classList.remove("selectedCard");
    });
    doubleClickHandler(userCardButton);
}


// event handler for start/reset button
startReset.addEventListener("click",function()
{
    if(startReset.textContent=="Start")
    initialize();
    else
    reset();
});


// event handler for saying uno
sayUno.addEventListener("click",()=>{
    if(!gameStatus.gameOngoing||!haveToSayUno)
        return;
    unoFlag=true;
    updateInfoBox("UNO!");
});


// event handler for cards drag and drop
function addDragDropCards(e)
{
    if(gameStatus.turn!="user")
    return;
    let card=e.target;
    let color,symbol;
    let cl=card.classList;
    for(var i=0;i<cl.length;i++)
    {
        if(cl[i]=="red"||cl[i]=="blue"||cl[i]=="green"||cl[i]=="yellow"||cl[i]=="none")
        color=cl[i];
        else if(cl[i]=="userCard"||cl[i]=="selectedCard")
        continue;
        else
        symbol=cl[i];
    }
    for(var i=0;i<userCards.length;i++)
    {
        if(userCards[i].color==color&&userCards[i].symbol==symbol)
        {
            gameStatus.currentDragged_Picked=userCards[i];
            break;
        }
    }
}


// event handler for drop on current card
function onDropCurrentCard(e)
{
    e.preventDefault();
    if(gameStatus.currentDragged_Picked!=null&&gameStatus.currentDragged_Picked!=undefined&&playIsValid(gameStatus.currentDragged_Picked))
    {
        currentCardDisplay.src="./assets/cards/"+gameStatus.currentDragged_Picked.folder+gameStatus.currentDragged_Picked.img;
        userCardsRemove(gameStatus.currentDragged_Picked);
        displayUserCards();
        gameStatus.currentCard=gameStatus.currentDragged_Picked;
        gameStatus.currentColor=gameStatus.currentDragged_Picked.color;
        gameStatus.currentSymbol=gameStatus.currentDragged_Picked.symbol;
        updateInfoDisplays();
        carryOutProperty(gameStatus.currentDragged_Picked);
        gameStatus.currentDragged_Picked=null;
        if(!colorPickFlag)
        carryOutNextTurn();
    }
}


// event handler for play card button
playCardButton.addEventListener("click",function(){
    var cards=document.querySelectorAll(".userCard");
    for(var i=0;i<cards.length;i++)
    {
        if(cards[i].classList.contains("selectedCard"))
        {
            addDragDropCards({target:cards[i]});
            var e={
                preventDefault:()=>{

                },
            };
            onDropCurrentCard(e)
            break;
        }
    }
});


// event handler for double click
function doubleClickHandler(playCardButton)
{
    playCardButton.addEventListener("dblclick",function(e){
        
                addDragDropCards(e);
                var e={
                    preventDefault:()=>{
                    },
                };
                onDropCurrentCard(e)
    });
}


// event handler for color choice buttons
for(i=0;i<4;i++)
{
    colorChoiceButtons[i].addEventListener("click",function(event){
        if(colorPickFlag&&gameStatus.gameOngoing)
        {
            if(event.target.classList.contains("red_choice"))
            {
                gameStatus.currentColor="red";
                infoColor.src="./assets/images/display/display_color_red.png";
            }
            else if(event.target.classList.contains("yellow_choice"))
            {
                gameStatus.currentColor="yellow";
                infoColor.src="./assets/images/display/display_color_yellow.png";
            }
            else if(event.target.classList.contains("green_choice"))
            {
                gameStatus.currentColor="green";
                infoColor.src="./assets/images/display/display_color_green.png";
            }
            else if(event.target.classList.contains("blue_choice"))
            {
                gameStatus.currentColor="blue";
                infoColor.src="./assets/images/display/display_color_blue.png";
            }
            colorPickFlag=false;
            carryOutNextTurn();
        }
    });
}


//
//
//


// main code


// creating deck
function createDeck()
{
    // number cards
    for(var i=0;i<=9;i++)
    {
        for(var j=0;j<4;j++)
        {
            var c=card(i.toString(),colors[j],"number");
            if(i!=0)
            deck.push(c);
            deck.push(c);
        }
    }

    // special color cards

    // reverse
    for(var i=0;i<4;i++)
    {
        var c=card("reverse",colors[i],"reverse");
        deck.push(c);
        deck.push(c);
    }

    // skip
    for(var i=0;i<4;i++)
    {
        var c=card("skip",colors[i],"skip");
        deck.push(c);
        deck.push(c);
    }

    // draw 2
    for(var i=0;i<4;i++)
        {
            var c=card("picktwo",colors[i],"picktwo");
            deck.push(c);
            deck.push(c);
        }
    
    
    // multicolor cards

    // draw 4
    for(i=0;i<4;i++)
    {
        var c=card("plus4","none","plus4");
        deck.push(c);
    }

    // color pick
    for(i=0;i<4;i++)
    {
        var c=card("colorpick","none","colorpick");
        deck.push(c);
    }

    shuffleDeck();

}
createDeck();


//
//
//


// object functions


// object that stores the status of current game
var gameStatus=resetGameStatus();
function resetGameStatus()
{
    return {
    currentCard:null,
    numberOfPlayers:2,
    gameOngoing:false,
    playerCardsCount:[7,7,7,7],
    sequence:true,
    players:[],
    turn:"user",
    currentDragged_Picked:null,
    playedPile:[],
    currentSymbol:null,
    currentColor:null,
    }
}


// function to create player objects
function player(index)
{
    let cards=[];
    let pileColors=[];
    let pileSymbols=[];
    return{index:index,cards:cards,noOfCards:0,pileColors:pileColors,pileSymbols:pileSymbols};
}


// function to create card objects
function card(symbol,color,property)
{

    var img1,img2,img3;

    if(property=="number")
        img1="number_";
    else
        img1="special_";
    img2=color+"_";

    if(property!="number")
        img3=property;
    else
    {
        switch(symbol)
        {
            case "0": img3="zero"; break;
            case "1": img3="one"; break;
            case "2": img3="two"; break;
            case "3": img3="three"; break;
            case "4": img3="four"; break;
            case "5": img3="five"; break;
            case "6": img3="six"; break;
            case "7": img3="seven"; break;
            case "8": img3="eight"; break;
            case "9": img3="nine"; break;
        }
    }

    var img=img1+img2+img3+".png";                   // img stores the name of the corrosponding card image

    var folder;                                      // folder stores the name of the folder
    if(property=="number")
        folder="color_numbers/";
    else if(color=="none")
        folder="multicolor/";
    else
        folder="color_special/";
    
    return {color:color,symbol:symbol,player:null,deck:true,played:false,property:property,img:img,folder:folder}

    /*
        color = color of the card, either red, yellow, green, blue or none (for +4 and change color)
        symbol = number or symbol (reverse, skip, etc.)
        player = current player that has the card
        deck = wether the card is in the deck
        played = wether the card is in the played cards pile
        property = what the card does (nothing if number, otherwise reverses sequence etc.)
    */

}


//
//
//


// functions


// function to find the next turn
function nextTurn()
{
    if(gameStatus.sequence)
    {
        if(gameStatus.turn=="user")
        return "player1";
        else
        {
            var c=parseInt(gameStatus.turn.substring(gameStatus.turn.length-1));
            if(c==gameStatus.numberOfPlayers-1)
            return "user";
            else
            return "player"+(c+1);
        }
    }
    else
    {
        if(gameStatus.turn=="user")
        return "player"+(gameStatus.numberOfPlayers-1);
        else
        {
            var c=parseInt(gameStatus.turn.substring(gameStatus.turn.length-1));
            if(c==1)
            return "user";
            else
            return "player"+(c-1);
        }
    }
}


// computer player div
function computerPlayerDivCreater(i)
{
    var computerPlayerDiv=document.createElement("div");
    computerPlayerDiv.classList.add("cplayer");
    computerPlayerDiv.classList.add("cplayer"+i);
    var divCards=document.createElement("div");
    divCards.classList.add("cplayer"+i);
    divCards.classList.add("cplayer_cards");
    var divText=document.createElement("div");
    divText.classList.add("cplayer"+i);
    divText.classList.add("cplayer_text");
    pText=document.createElement("p");
    pNumber=document.createElement("p");
    pNumber.textContent="Player "+i;
    pText.classList.add("player_text");
    pText.classList.add("cplayer"+i);
    pNumber.classList.add("cplayer_number");
    divText.appendChild(pNumber);
    divText.appendChild(pText);
    computerPlayerDiv.appendChild(divCards);
    computerPlayerDiv.appendChild(divText);
    return computerPlayerDiv;
}


// function to arrange user cards
function arrange()
{
    if(gameStatus.gameOngoing)
    {
        var newUserCards=[];

        var noTMP=[];
        var spTMP=[];

        // red cards
        for(var i=0;i<userCards.length;i++)
        {
            if(userCards[i].color=="red")
            {
                if(userCards[i].property=="number")
                {
                    noTMP.push(userCards[i]);
                    userCards.splice(i,1);
                }
                else
                {
                    spTMP.push(userCards[i]);
                    userCards.splice(i,1);
                }
                i--;
            }
        }
        for(var i=0;i<noTMP.length;i++)
        newUserCards.push(noTMP[i]);
        for(var i=0;i<spTMP.length;i++)
        newUserCards.push(spTMP[i]);

        noTMP=[];
        spTMP=[];

        // yellow cards
        for(var i=0;i<userCards.length;i++)
            {
                if(userCards[i].color=="yellow")
                {
                    if(userCards[i].property=="number")
                    {
                        noTMP.push(userCards[i]);
                        userCards.splice(i,1);
                    }
                    else
                    {
                        spTMP.push(userCards[i]);
                        userCards.splice(i,1);
                    }
                    i--;
                }
            }
            for(var i=0;i<noTMP.length;i++)
            newUserCards.push(noTMP[i]);
            for(var i=0;i<spTMP.length;i++)
            newUserCards.push(spTMP[i]);
    
            noTMP=[];
            spTMP=[];

        // green cards
        for(var i=0;i<userCards.length;i++)
            {
                if(userCards[i].color=="green")
                {
                    if(userCards[i].property=="number")
                    {
                        noTMP.push(userCards[i]);
                        userCards.splice(i,1);
                    }
                    else
                    {
                        spTMP.push(userCards[i]);
                        userCards.splice(i,1);
                    }
                    i--;
                }
            }
            for(var i=0;i<noTMP.length;i++)
            newUserCards.push(noTMP[i]);
            for(var i=0;i<spTMP.length;i++)
            newUserCards.push(spTMP[i]);
    
            noTMP=[];
            spTMP=[];

        // blue cards
        for(var i=0;i<userCards.length;i++)
            {
                if(userCards[i].color=="blue")
                {
                    if(userCards[i].property=="number")
                    {
                        noTMP.push(userCards[i]);
                        userCards.splice(i,1);
                    }
                    else
                    {
                        spTMP.push(userCards[i]);
                        userCards.splice(i,1);
                    }
                    i--;
                }
            }
            for(var i=0;i<noTMP.length;i++)
            newUserCards.push(noTMP[i]);
            for(var i=0;i<spTMP.length;i++)
            newUserCards.push(spTMP[i]);
    
            noTMP=[];
            spTMP=[];

        // remaining cards
        for(var i=0;i<userCards.length;i++)
        {
            newUserCards.push(userCards[i]);
        }
        userCards=newUserCards;
        displayUserCards();
    }
}


// function to shuffle deck
function shuffleDeck()              // fisher-yates shuffling algorithm
{
    let currentIndex = deck.length;

    while (currentIndex != 0)
    {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [deck[currentIndex], deck[randomIndex]] = [deck[randomIndex], deck[currentIndex]];
    }
}


// function to select the choice of computer player
function computerChoice(cards)
{
    // cards = array of cards that the player has

    let currentColor = gameStatus.currentColor;
    let currentSymbol = gameStatus.currentSymbol;

    // if theres a non multicolor card that matches, returns that
    for(var i=0;i<cards.length;i++)
    {
        if(cards[i].color==currentColor||cards[i].symbol==currentSymbol)
        return i;
    }

    // otherwise looks for a multicolor card
    for(var i=0;i<cards.length;i++)
    {
        if(cards[i].color=="none")
        return i;
    }

    // if neither, returns null
    return null;
}


// function to distribute cards initially
function distributeCards()
{
    var i,j;

    // distribute to user
    for(i=0;i<7;i++)
    {
        userCards.push(deck.pop());
        userCards[i].player="user";
        userCards[i].played=false;
        userCards[i].deck=false;
        userColors.push(userCards[i].color);
        userSymbols.push(userCards[i].symbol);
        deckCount--;
    }
    displayUserCards();

    // distribute to players
    for(i=0;i<gameStatus.numberOfPlayers-1;i++)
    {
        for(j=0;j<7;j++)
        {
            gameStatus.players[i].cards.push(deck.pop());
            gameStatus.players[i].cards[j].player="player"+(i+1);
            gameStatus.players[i].cards[j].played=false;
            gameStatus.players[i].cards[j].deck=false;
            gameStatus.players[i].pileColors.push(gameStatus.players[i].cards[j].color);
            gameStatus.players[i].pileSymbols.push(gameStatus.players[i].cards[j].symbol);
            deckCount--;
        }
    }
    displayPlayerCards();
}


// function to initialize the game
function initialize()
{
    if(playerCount.value>4||playerCount.value<2||playerCount.value==null||playerCount.value==undefined||playerCount.value=="")
    {
        updateInfoBox("Enter a valid number of players! (Between 2 and 4)");
        return;
    }
    updateInfoBox("Game Started!");
    deckCount=108;
    gameStatus.turn="user";
    gameStatus.gameOngoing=true;
    startReset.textContent="Reset";
    gameStatus.numberOfPlayers=playerCount.value;
    for(var i=0;i<gameStatus.numberOfPlayers;i++)
    {
        gameStatus.playerCardsCount[i]=7;
    }
    for(var i=0;i<gameStatus.numberOfPlayers-1;i++)
    {
        gameStatus.players.push(player(i+1));
        gameStatus.players[i].noOfCards=7;
    }
    distributeCards();
}


// function to update info box
function updateInfoBox(s)
{
    ib_count++;
    let c=ib_count;
    let newInfoDiv=document.createElement("div");
    newInfoDiv.className=`info_box ib${c}`;
    newInfoDiv.innerHTML=s;
    if(infoArea.children.length==0)
    infoArea.appendChild(newInfoDiv);
    else
    infoArea.insertBefore(newInfoDiv,infoArea.firstChild);
    setTimeout(()=>{
        document.querySelector(`.info_box.ib${c}`).remove();
    },2000);
}


// function to display both
function displayBoth()
{
    displayUserCards();
    displayPlayerCards();
}


// function to display user cards
window.onresize=displayBoth;
function displayUserCards()
{
    var display=document.querySelector(".user_cards");
    display.innerHTML="";
    display.style.gridTemplateColumns="";
    var c=userCards.length;
    var k=window.getComputedStyle(display).fontSize;
    k=k.substring(0,k.length-2);
    k=parseInt(k);
    var w=display.offsetWidth;
    w=w-(9*k);
    var disp="";
    for(var i=0;i<c-1;i++)
    {
        disp+=w/(c-1)+"px ";
    }
    disp+="9em";
    display.style.gridTemplateColumns=disp;
    for(var i=0;i<userCards.length;i++)
    {
        let newCard=new Image();
        newCard.draggable=true;
        newCard.addEventListener("drag",function(e){
            addDragDropCards(e);
        });
        newCard.src="./assets/cards/"+userCards[i].folder+userCards[i].img;
        newCard.classList.add("userCard");
        newCard.classList.add(userCards[i].color);
        newCard.classList.add(userCards[i].symbol);
        addEventHandler(newCard);
        display.appendChild(newCard);
    }
}
displayUserCards();


// function to display user cards
function setCplayerCards(i)
{
    var display=document.querySelector(".cplayer_cards.cplayer"+i);
    display.style.gridTemplateColumns="";
    var c=display.childElementCount;
    var k=window.getComputedStyle(display).fontSize;
    k=k.substring(0,k.length-2);
    k=parseInt(k);
    var w=display.offsetWidth;
    w=w-(6*k);
    var disp="";
    for(var i=0;i<c-1;i++)
    {
        disp+=w/(c-1)+"px ";
    }
    disp+="6em";
    display.style.gridTemplateColumns=disp;
}


// function to reset
function reset()
{
    hasPicked=false;
    userColors=[];
    userSymbols=[];
    infoColor.src="./assets/images/display/display_empty.png";
    infoSymbol.src="./assets/images/display/display_empty.png";
    gameStatus=resetGameStatus();
    currentCardDisplay.src="./assets/images/play_a_card.png";
    startReset.textContent="Start";
    userCards=[];
    deck=[];
    createDeck();
    shuffleDeck();
    displayUserCards();
    displayPlayerCards();
}


//  function to display computer player cards
function displayPlayerCards()
{
    cPlayersDisplay.innerHTML="";
    if(!gameStatus.gameOngoing)
    {
        cPlayersDisplay.appendChild(computerPlayerDivCreater(1));
    }
    else
    {
        for(var i=0;i<gameStatus.players.length;i++)
        {
            var cDiv=computerPlayerDivCreater(i+1);
            cPlayersDisplay.appendChild(cDiv);
            var s=".cplayer"+(i+1)+".cplayer_cards";
            var cCards=document.querySelector(s);
            var count=gameStatus.players[i].cards.length;
            for(var j=0;j<count;j++)
            {
                var img=new Image();
                img.src="./assets/images/uno_back.png";
                cCards.appendChild(img);
            }
            setCplayerCards(i+1);
        }
    }
}


// function to remove user card on playing
function userCardsRemove(card)
{
    for(var i=0;i<userCards.length;i++)
    {
        if(card.color==userCards[i].color&&card.symbol==userCards[i].symbol)
        {
            userCards[i].played=true;
            userCards[i].player=null;
            gameStatus.playedPile.push(userCards[i]);
            var index=userColors.indexOf(userCards[i].color);
            if(index>-1)
            userColors.splice(index,1);
            index=userSymbols.indexOf(userCards[i].symbol);
            if(index>-1)
            userSymbols.splice(index,1);
            userCards.splice(i,1);
            if(userCards.length==1)
            {
                haveToSayUno=true;
                setTimeout(()=>{
                    if(!unoFlag)
                    {
                        updateInfoBox("You did not say UNO in time! Two cards are added!");
                        addCardFromDeck("user",true);
                        addCardFromDeck("user",true);
                    }
                    unoFlag=false;
                    haveToSayUno=false;
                },4000);
            }
            break;
        }
    }
}


//  function to update info displays
function updateInfoDisplays()
{
    var img="display_color_"+gameStatus.currentColor;
    infoColor.src="./assets/images/display/"+img+".png";
    img="display_number_";
    switch(gameStatus.currentSymbol)
    {
        case "0": img+="zero"; break;
        case "1": img+="one"; break;
        case "2": img+="two"; break;
        case "3": img+="three"; break;
        case "4": img+="four"; break;
        case "5": img+="five"; break;
        case "6": img+="six"; break;
        case "7": img+="seven"; break;
        case "8": img+="eight"; break;
        case "9": img+="nine"; break;
        default: img+=gameStatus.currentSymbol;
    }
    infoSymbol.src="./assets/images/display/"+img+".png";
}


// function to add card to user or player cards from deck
function addCardFromDeck(player,flag)
{
    if(!gameStatus.gameOngoing)
        return;
    if(player=="user"&&(!hasPicked))
    {
        if(deck.length!=0)
        {
            userCards.push(deck.pop());
            userCards[userCards.length-1].deck=true;
            userCards[userCards.length-1].player="user";
            userColors.push(userCards[userCards.length-1].color);
            userSymbols.push(userCards[userCards.length-1].symbol);
            deckCount--;
        }
        else
        {
            deck=gameStatus.playedPile;
            shuffleDeck();
            userCards.push(deck.pop());
            userCards[userCards.length-1].deck=true;
            userCards[userCards.length-1].player="user";
            userColors.push(userCards[userCards.length-1].color);
            userSymbols.push(userCards[userCards.length-1].symbol);
            deckCount=deck.length;
        }
        if(!flag)
        hasPicked=true;
        displayUserCards();
        if(!(flag||userCards[userCards.length-1].color=="none"||userCards[userCards.length-1].color==gameStatus.currentColor||userCards[userCards.length-1].symbol==gameStatus.currentSymbol))
            carryOutNextTurn();
    }
    else if(player.substring(0,4)=="play")
    {
        var index=player.substring(6);
        if(deck.length!=0)
        {
            var card=deck.pop();
            card.deck=false;
            card.player="player"+index;
            gameStatus.players[index-1].cards.push(card);
            gameStatus.players[index-1].pileColors.push(card.color);
            gameStatus.players[index-1].pileSymbols.push(card.symbol);
            deckCount--;
        }
        else
        {
            deck=gameStatus.playedPile;
            shuffleDeck();
            var card=deck.pop();
            card.deck=false;
            card.player="player"+index;
            gameStatus.players[index-1].cards.push(card);
            gameStatus.players[index-1].pileColors.push(card.color);
            gameStatus.players[index-1].pileSymbols.push(card.symbol);
            deckCount=deck.length;
        }
        hasPicked=false;
        displayPlayerCards();
    }
}


// function to check if user play is valid
function playIsValid(card)
{
    if(card!=null&&card!=undefined)
    {
        if(card.color=="none")
        return true;
        else if(card.color==gameStatus.currentColor)
        return true;
        else if(card.symbol==gameStatus.currentSymbol)
        return true;
        else if(gameStatus.currentColor==null||gameStatus.currentSymbol==null)
        return true;
    }
    return false;
}


// function to carry out the property of user played card
function carryOutProperty(card)
{
    currentPlayer=gameStatus.turn;
    if(card.property=="number")
    return;
    else
    {
        if(card.property=="reverse")
        {
            gameStatus.sequence=!gameStatus.sequence;
            if(gameStatus.numberOfPlayers==2)
            gameStatus.turn=nextTurn();
        }
        else if(card.property=="skip")
        {
            gameStatus.turn=nextTurn();
        }
        else if(card.property=="picktwo")
        {
            var victim=nextTurn();
            addCardFromDeck(victim,true);
            addCardFromDeck(victim,true);
            gameStatus.turn=victim;
        }
        else if(card.property=="plus4")
        {
            var victim=nextTurn();
            addCardFromDeck(victim,true);
            addCardFromDeck(victim,true);
            addCardFromDeck(victim,true);
            addCardFromDeck(victim,true);
            if(currentPlayer=="user")
            {
                colorPickFlag=true;
                updateInfoBox("Pick a color!");
            }
            gameStatus.turn=victim;
        }
        else if(card.property=="colorpick"&&currentPlayer=="user")
        {
            colorPickFlag=true;
            updateInfoBox("Pick a color!");
        }
        if(card.property=="plus4"||card.property=="colorpick"&&currentPlayer!="user")
        {
            var c=parseInt(gameStatus.turn.substring(6));
            gameStatus.currentColor=chooseNextColor(c);
        }
    }
}


// function to choose next color for computers
function chooseNextColor(c)
{
    var i=parseInt(Math.random()*4);
    return colors[i];
}


// function to change turns
function carryOutNextTurn()
{
    if(!gameStatus.gameOngoing)
    return;
    var allPlayers;
    hasPicked=false;
    gameStatus.turn=nextTurn();
    if(gameStatus.turn.substring(0,4)=="play")
    {
        var cPlayerTurn=document.querySelector(".cplayer_text.c"+gameStatus.turn);
        allPlayers=document.querySelectorAll(".cplayer_text");
        allPlayers.forEach(function(i){
            i.style.backgroundColor="#005C78";
            i.firstChild.style.color="#F3F7EC";
        });
        cPlayerTurn.style.backgroundColor="#F3F7EC";
        cPlayerTurn.firstChild.style.color="#005C78";
        var player=parseInt(gameStatus.turn.substring(6));
        var cardPicked=computerChoice(gameStatus.players[player-1].cards);
        if(cardPicked==null)
        {
            var card;
            if(deck.length!=0)
            card=deck.pop();
            else
            {
                deck=gameStatus.playedPile;
                shuffleDeck();
                card=deck.pop();
                deckCount=deck.length();
                gameStatus.playedPile=[];
            }
            gameStatus.players[player-1].cards.push(card);
            gameStatus.players[player-1].pileColors.push(card.color);
            gameStatus.players[player-1].pileSymbols.push(card.symbol);
            displayPlayerCards();
            cPlayerTurn=document.querySelector(".cplayer_text.c"+gameStatus.turn);
            cPlayerTurn.style.backgroundColor="#F3F7EC";
            cPlayerTurn.firstChild.style.color="#005C78";
            card.deck=false;
        }
        updateInfoBox("Player "+player+"'s turn!");
        setTimeout(function(){
        if(gameStatus.turn=="user")
            gameStatus.turn=currentPlayer;
        var player=parseInt(gameStatus.turn.substring(6));
        var cardPicked=computerChoice(gameStatus.players[player-1].cards);
        if(cardPicked!=null)
        {
            var card=gameStatus.players[player-1].cards[cardPicked];
            var cT=gameStatus.players[player-1].pileColors.indexOf(card.color);
            gameStatus.players[player-1].pileColors.splice(cT,1);
            cT=gameStatus.players[player-1].pileSymbols.indexOf(card.symbol);
            gameStatus.players[player-1].pileSymbols.splice(cT,1);
            gameStatus.players[player-1].cards.splice(cardPicked,1);
            card.played=true;
            gameStatus.playedPile.push(card);
            gameStatus.currentCard=card;
            gameStatus.currentColor=card.color;
            gameStatus.currentSymbol=card.symbol;
            carryOutProperty(card);
            updateInfoDisplays();
            displayPlayerCards();
        }
        currentCardDisplay.src="./assets/cards/"+gameStatus.currentCard.folder+gameStatus.currentCard.img;
        allPlayers=document.querySelectorAll(".cplayer_text");
        allPlayers.forEach(function(i){
            i.style.backgroundColor="#005C78";
            i.firstChild.style.color="#F3F7EC";
        });
        checkIfWon();
        carryOutNextTurn();
        },2000);
    }
    else
    updateInfoBox("Your turn!");
}


// function to check if game has been won
function checkIfWon()
{
    if(gameStatus.gameOngoing)
    {
        if(userCards.length==0)
        userWins();
        else
        {
            for(var i=0;i<gameStatus.players.length;i++)
            {
                if(gameStatus.players[i].cards.length==0)
                playerWins(i);
            }
        }
    }
}


// function to handle a player winning
function playerWins(i)
{
    updateInfoBox("Player "+(i+1)+" wins!");
    gameStatus.players.splice(i,1);
    var reqDiv=document.querySelector(".cplayer.cplayer"+(gameStatus.numberOfPlayers-1));
    reqDiv.remove();
    if(i+1==1)
    gameStatus.turn="user";
    else
    gameStatus.turn="player"+(i);
    gameStatus.numberOfPlayers=gameStatus.players.length+1;
    displayPlayerCards();
    if(gameStatus.players.length==0)
    userLoses();
}


// function to handle user winning
function userWins()
{
    updateInfoBox("You win!");
    gameStatus.gameOngoing=false;
    gameStatus=resetGameStatus();
}


// function to handle user losing
function userLoses()
{
    updateInfoBox("You lose!");
    gameStatus.gameOngoing=false;
    gameStatus=resetGameStatus();
}







/* tmp experiment 

function randomAdd()
{
    var button=document.querySelector(".play_card");
    button.addEventListener("click",function(e){
        userCards.push(deck.pop());
        displayUserCards();
    })
}
randomAdd();
 */

   
