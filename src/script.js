// global variables


var numberOfPlayers=2,gameOngoing=false;
var userCards=[];
var playerCount=document.querySelector(".player_count");
var userCardsDisplay=document.querySelector(".user_cards");
var leftButton=document.querySelector(".move_left");
var rightButton=document.querySelector(".move_right");
var playerCardsCount=[];
var startReset=document.querySelector(".start_reset");
var deck=[];
var deckCount=0;
var colors=["red","yellow","green","blue"];
var sequence=true;


//
//
//


// event handlers




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


}
createDeck();


//
//
//


// object functions


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


// function to select the choice of computer player
function computerChoice(cards,currentCard)
{
    // cards = array of cards that the player has
    // currentCard = currentCard on top of the pile

    let currentColor = currentCard.color;
    let currentSymbol = currentCard.symbol;
}


// function to distribute cards initially
function distributeCards()
{

}


// function to initialize the game
function initialize()
{
    deckCount=108;
    gameOngoing=true;
    startReset.textContent="Reset";
    numberOfPlayers=playerCount.value;
    for(var i=0;i<numberOfPlayers;i++)
        playerCardsCount.push(7);
    distributeCards();
}



















/* tmp experiment 

var display=document.querySelector(".tmp_display_cards");
for(var i=0;i<deck.length;i++)
    {
        var img=document.createElement("img");
        img.src="./assets/cards/"+deck[i].folder+deck[i].img;
        display.appendChild(img);
    }

    */