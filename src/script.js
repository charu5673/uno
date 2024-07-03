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


//
//
//


// event handlers


// allowing drop events
function allowDrop(e)
{
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
}


// event handler for start/reset button
startReset.addEventListener("click",function()
{
    if(startReset.textContent=="Start")
    initialize();
    else
    reset();
});


// event handler for cards drag and drop
function addDragDropCards(e)
{
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
    if(gameStatus.currentDragged_Picked!=null&&gameStatus.currentDragged_Picked!=undefined)
    {
        currentCardDisplay.src="./assets/cards/"+gameStatus.currentDragged_Picked.folder+gameStatus.currentDragged_Picked.img;
        userCardsRemove(gameStatus.currentDragged_Picked);
        displayUserCards();
        gameStatus.currentCard=gameStatus.currentDragged_Picked;
        gameStatus.currentColor=gameStatus.currentDragged_Picked.color;
        gameStatus.currentSymbol=gameStatus.currentDragged_Picked.symbol;
        updateInfoDisplays();
        gameStatus.currentDragged_Picked=null;
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


//
//
//


// main code


// creating deck
function createDeck()                       // iife function to create deck
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
    turn:"player1",
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
    return{index:index,cards:cards,noOfCards:0};
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

    let currentColor = gameStatus.currentCard.color;
    let currentSymbol = gameStatus.currentCard.symbol;
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

        deckCount--;
    }
    displayUserCards();

    // distribute to players
    for(i=0;i<gameStatus.numberOfPlayers-1;i++)
    {
        for(j=0;j<7;j++)
        {
            gameStatus.players[i].cards.push(deck.pop());
            userCards[i].player="player"+(i+1);
            userCards[i].played=false;
            userCards[i].deck=false;
            deckCount--;
        }
    }
    displayPlayerCards();
}


// function to initialize the game
function initialize()
{
    deckCount=108;
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

// function to display user cards
window.onresize=displayUserCards;
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
            userCards.splice(i,1);
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

   