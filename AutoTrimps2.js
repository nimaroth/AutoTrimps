// ==UserScript==
// @name         AutoTrimps
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  try to take over the world!
// @author       zininzinin, spindrjr
// @include        *trimps.github.io*
// @grant        none
// ==/UserScript==



////////////////////////////////////////
//Variables/////////////////////////////
////////////////////////////////////////
var runInterval = 200; //How often to loop through logic
var enableDebug = true; //Spam console?

////////////////////////////////////////
//List Variables////////////////////////
////////////////////////////////////////
var jobList = [{
    name: 'Explorer',
    max: -1,
    ratio: 10
}, {
    name: 'Trainer',
    max: -1,
    ratio: 99
}, {
    name: 'Miner',
    max: -1,
    ratio: 10
}, {
    name: 'Farmer',
    max: -1,
    ratio: 10
}, {
    name: 'Lumberjack',
    max: -1,
    ratio: 10
}, {
    name: 'Scientist',
    max: -1,
    ratio: 1
}];

var equipmentList = {
    'Dagger': {
        Upgrade: 'Dagadder',
        Stat: 'attack',
        Resource: 'metal',
        Equip: true
    },
    'Mace': {
        Upgrade: 'Megamace',
        Stat: 'attack',
        Resource: 'metal',
        Equip: true
    },
    'Polearm': {
        Upgrade: 'Polierarm',
        Stat: 'attack',
        Resource: 'metal',
        Equip: true
    },
    'Battleaxe': {
        Upgrade: 'Axeidic',
        Stat: 'attack',
        Resource: 'metal',
        Equip: true
    },
    'Greatsword': {
        Upgrade: 'Greatersword',
        Stat: 'attack',
        Resource: 'metal',
        Equip: true
    },
    'Boots': {
        Upgrade: 'Bootboost',
        Stat: 'health',
        Resource: 'metal',
        Equip: true
    },
    'Helmet': {
        Upgrade: 'Hellishmet',
        Stat: 'health',
        Resource: 'metal',
        Equip: true
    },
    'Pants': {
        Upgrade: 'Pantastic',
        Stat: 'health',
        Resource: 'metal',
        Equip: true
    },
    'Shoulderguards': {
        Upgrade: 'Smoldershoulder',
        Stat: 'health',
        Resource: 'metal',
        Equip: true
    },
    'Breastplate': {
        Upgrade: 'Bestplate',
        Stat: 'health',
        Resource: 'metal',
        Equip: true
    },
    'Arbalest': {
        Upgrade: 'Harmbalest',
        Stat: 'attack',
        Resource: 'metal',
        Equip: true
    },
    'Gambeson': {
        Upgrade: 'GambesOP',
        Stat: 'health',
        Resource: 'metal',
        Equip: true
    },
    'Shield': {
        Upgrade: 'Supershield',
        Stat: 'health',
        Resource: 'wood',
        Equip: true
    },
    'Gym': {
        Upgrade: 'Gymystic',
        Stat: 'block',
        Resource: 'wood',
        Equip: false
    }
};

var upgradeList = ['Coordination', 'Speedminer', 'Speedlumber', 'Speedfarming', 'Speedscience', 'Megaminer', 'Megalumber', 'Megafarming', 'Megascience', 'Efficiency', 'Potency', 'TrainTacular', 'Miners', 'Scientists', 'Trainers', 'Explorers', 'Blockmaster', 'Battle', 'Bloodlust', 'Bounty', 'Egg', 'Anger', 'Formations', 'Dominance', 'Barrier', 'UberHut', 'UberHouse', 'UberMansion', 'UberHotel', 'UberResort', 'Trapstorm'];
var buildingList = ['Hut', 'House', 'Gym', 'Mansion', 'Hotel', 'Resort', 'Gateway', 'Collector', 'Warpstation', 'Tribute', 'Nursery']; //NOTE THAT I REMOVED WORMHOLE TEMPORARILY UNTILL I FIGURE OUT WHAT TO DO WITH IT
var pageSettings = [];
var bestBuilding;

var preBuyAmt = game.global.buyAmt;
var preBuyFiring = game.global.firing;
var preBuyTooltip = game.global.lockTooltip;


////////////////////////////////////////
//Page Changes//////////////////////////
////////////////////////////////////////
document.getElementById("buyHere").innerHTML += '<div id="autoContainer" style="display: block; font-size: 12px;"> <div id="autoTitleDiv" class="titleDiv"> <div class="row"> <div class="col-xs-4"><span id="autoTitleSpan" class="titleSpan">Automation</span> </div> </div> </div> <br> <div class="autoBox" id="autoHere"> </div> <table style="text-align: left; vertical-align: top; width: 90%;" border="0" cellpadding="0" cellspacing="0"> <tbody> <tr> <td style="vertical-align: top;"> Loops <br> <input id="chkBuyStorage" title="Will buy storage when resource is almost full" type="checkbox">Buy Storage <br> <input id="chkManualStorage" title="Will automatically gather resources and trap trimps" type="checkbox">Manual Gather <br> <input id="chkBuyJobs" title="Buys jobs based on ratios configured" type="checkbox">Buy Jobs <br> <input id="chkBuyBuilding" title="Will buy non storage buildings as soon as they are available" type="checkbox">Buy Buildings <br> <input id="chkBuyUpgrades" title="autobuy non eqipment Upgrades" type="checkbox">Buy Upgrades <br>  <input id="chkAutoStance" title="automate setting stance" type="checkbox">Auto Stance</td> <td style="vertical-align: top;"> Equipment <br> <input id="chkBuyEquipH" title="Will buy the most efficient armor available" type="checkbox">Buy Armor <br> <input id="chkBuyPrestigeH" title="Will buy the most efficient armor upgrade available" type="checkbox">Buy Armor Upgrades <br> <input id="chkBuyEquipA" title="Will buy the most efficient weapon available" type="checkbox">Buy Weapons <br> <input id="chkBuyPrestigeA" title="Will buy the most efficient weapon upgrade available" type="checkbox">Buy Weapon Upgrades <br><br> Misc Settings <br> <input id="chkTrapTrimps" title="automate trapping trimps" type="checkbox">Trap Trimps<br><input id="geneticistTargetBreedTime" title="Breed time in seconds to shoot for using geneticists" style="width: 20%;color: #000000;font-size: 12px;" value="5">&nbsp;Geneticist Timer<br></td> </tr> <tr> <td style="vertical-align: middle; text-align: left;"> <br>Max Buildings to build <br> <input id="maxHut" style="width: 20%;color: #000000;font-size: 12px;" value="100">&nbsp; Hut <br> <input id="maxHouse" style="width: 20%;color: #000000;font-size: 12px;" value="100">&nbsp; House <br> <input id="maxMansion" style="width: 20%;color: #000000;font-size: 12px;" value="100">&nbsp; Mansion <br> <input id="maxHotel" style="width: 20%;color: #000000;font-size: 12px;" value="100">&nbsp; Hotel <br> <input id="maxResort" style="width: 20%;color: #000000;font-size: 12px;" value="100">&nbsp; Resort <br> <input id="maxGateway" style="width: 20%;color: #000000;font-size: 12px;" value="100">&nbsp; Gateway <br> <input id="maxCollector" style="width: 20%;color: #000000;font-size: 12px;" value="100">&nbsp; Collector <br> <input id="maxWarpstation" style="width: 20%;color: #000000;font-size: 12px;" value="-1">&nbsp; Warpstation <br> <input id="maxGym" style="width: 20%;color: #000000;font-size: 12px;" value="-1">&nbsp; Gym <br> <input id="maxTribute" style="width: 20%;color: #000000;font-size: 12px;" value="-1">&nbsp; Tribute <br> <input id="maxNursery" style="width: 20%;color: #000000;font-size: 12px;" value="-1">&nbsp; Nursery <br> <br> </td> <td style="text-align: left; vertical-align: top;"> <br>Maps <br> <input id="chkAutoUniqueMap" title="Auto run unique maps" type="checkbox"> Auto run unique maps <br> <input id="chkAutoProgressMap" title="Runs maps when cannot defeat current level" type="checkbox">Auto map when stuck <br> <input id="maxHitsTillStuck" style="width: 10%; color: #000000;" value="10">&nbsp;Max hits to kill enemy before stuck<br><br>Ratios&nbsp&nbsp;Max<br><input id="FarmerRatio" style="width: 10%; color: #000000;" value="10"><input id="FarmerMax" style="width: 10%; color: #000000;" value="-1">&nbsp;Farmer<br><input id="LumberjackRatio" style="width: 10%; color: #000000;" value="10"><input id="LumberjackMax" style="width: 10%; color: #000000;" value="-1">&nbsp;Lumberjack<br><input id="MinerRatio" style="width: 10%; color: #000000;" value="10"><input id="MinerMax" style="width: 10%; color: #000000;" value="-1">&nbsp;Miner<br><input id="ScientistRatio" style="width: 10%; color: #000000;" value="10"><input id="ScientistMax" style="width: 10%; color: #000000;" value="-1">&nbsp;Scientist<br><input id="TrainerRatio" style="width: 10%; color: #000000;" value="10"><input id="TrainerMax" style="width: 10%; color: #000000;" value="-1">&nbsp;Trainer<br><input id="ExplorerRatio" style="width: 10%; color: #000000;" value="10"><input id="ExplorerMax" style="width: 10%; color: #000000;" value="-1">&nbsp;Explorer</td> </tr> </tbody> </table></div>';


////////////////////////////////////////
//Utility Functions/////////////////////
////////////////////////////////////////

//Loads the automation settings from browser cache
function loadPageVariables() {
    var temp = document.getElementById("autoContainer").innerHTML.split('input id="');
    temp.splice(0, 1);
    for (var i in temp) {
        pageSettings.push(temp[i].substring(0, temp[i].indexOf('"')));
    }

    //Set all the saved variables
    for (var index in pageSettings) {
        var setting = pageSettings[index];
        if (localStorage.getItem(setting) != null) {
            // debug(setting + ' is of type ' + document.getElementById(setting).type);
            var local = localStorage.getItem(setting);
            if (document.getElementById(setting).type == 'checkbox') {
                local = (local == 'true');
                if (document.getElementById(setting).checked != local) {
                    // debug('FIRST Setting ' + setting + ' to ' + local + ' from ' + document.getElementById(setting).checked);
                    document.getElementById(setting).checked = local;
                    // debug(setting + ' is set to ' + document.getElementById(setting).checked);
                }
            } else {
                if (document.getElementById(setting).value != localStorage.getItem(setting)) {
                    // debug('FIRST Setting ' + setting + ' to ' + localStorage.getItem(setting));
                    document.getElementById(setting).value = localStorage.getItem(setting);
                    // debug(setting + ' is set to ' + document.getElementById(setting).value);
                }
            }
        }
    }
}

//Saves automation settings to browser cache
function saveSettings() {
    // debug('Saved');
    for (var index in pageSettings) {
        var setting = pageSettings[index];
        // debug('Setting is ' +setting);
        if (document.getElementById(setting).type == 'checkbox') {
            localStorage.setItem(setting, document.getElementById(setting).checked);
        } else {
            localStorage.setItem(setting, document.getElementById(setting).value);
        }
    }
}

//Grabs the automation settings from the page
function getPageSetting(setting) {
    if (document.getElementById(setting).type == 'checkbox') {
        return document.getElementById(setting).checked;
    } else {
        return document.getElementById(setting).value;
    }
}

//Global debug message (need to implement debugging to in game window)
function debug(message) {
    if (enableDebug)
        console.log(timeStamp() + ' ' + message);
}

//Finds an element on the page and does the onClick() function
function clickButton(id) {
    debug('Trying to click button: ' + id);
    if (document.getElementById(id).style.visibility != 'hidden') {
        document.getElementById(id).click();
        setTimeout(function() {}, 10);
        return true;
    } else {
        debug('Cannot click button: ' + id);
        return false;
    }
}

//Simply returns a formatted text timestamp
function timeStamp() {
    var now = new Date();

    // Create an array with the current hour, minute and second
    var time = [now.getHours(), now.getMinutes(), now.getSeconds()];

    // If seconds and minutes are less than 10, add a zero
    for (var i = 1; i < 3; i++) {
        if (time[i] < 10) {
            time[i] = "0" + time[i];
        }
    }
    return time.join(":");
}

//Called before buying things that can be purchased in bulk
function preBuy() {
    preBuyAmt = game.global.buyAmt;
    preBuyFiring = game.global.firing;
    preBuyTooltip = game.global.lockTooltip;
}

//Called after buying things that can be purchased in bulk
function postBuy() {
    game.global.buyAmt = preBuyAmt;
    game.global.firing = preBuyFiring;
    game.global.lockTooltip = preBuyTooltip;
    tooltip('hide');
}

function safeBuyBuilding(building) {
    for (var b in game.global.buildingsQueue) {
        if (game.global.buildingsQueue[b].includes(building)) return false;
    }
    if (!canAffordBuilding(building)) return false;
    debug('Building ' + building);
    preBuy();
    game.global.buyAmt = 1;
    game.global.firing = false;
    buyBuilding(building);
    postBuy();
    return true;
}

//Outlines the most efficient housing based on gems (credits to Belaith)
function highlightHousing() {
    game.global.buyAmt = 1;
    var allHousing = ["Mansion", "Hotel", "Resort", "Collector", "Warpstation"];
    var unlockedHousing = [];
    for (house in allHousing) {
        if (game.buildings[allHousing[house]].locked == 0) {
            unlockedHousing.push(allHousing[house]);
        }
    }
    if (unlockedHousing.length) {
        var obj = {};
        for (var house in unlockedHousing) {
            var building = game.buildings[unlockedHousing[house]];
            var cost = 0;
            cost += getBuildingItemPrice(building, "gems");
            var ratio = cost / building.increase.by;
            obj[unlockedHousing[house]] = ratio;
            if (document.getElementById(unlockedHousing[house]).style.border = "1px solid #00CC00") {
                document.getElementById(unlockedHousing[house]).style.border = "1px solid #FFFFFF";
                // document.getElementById(unlockedHousing[house]).removeEventListener("click", update);
            }
        }
        var keysSorted = Object.keys(obj).sort(function(a, b) {
            return obj[a] - obj[b]
        });
        bestBuilding = keysSorted[0];
        document.getElementById(bestBuilding).style.border = "1px solid #00CC00";
        // document.getElementById(bestBuilding).addEventListener('click', update, false);
    } else {
        bestBuilding = null;
    }
}

function buyFoodEfficientHousing() {
    var houseWorth = game.buildings.House.locked ? 0 : getBuildingItemPrice(game.buildings.House, "food") / game.buildings.House.increase.by;
    var hutWorth = getBuildingItemPrice(game.buildings.Hut, "food") / game.buildings.Hut.increase.by;

    if (houseWorth > hutWorth && canAffordBuilding('House')){
    	safeBuyBuilding('House');
    } else {
    	safeBuyBuilding('Hut');
    }
}


////////////////////////////////////////
//Main Functions////////////////////////
////////////////////////////////////////

function initializeAutoTrimps() {
    loadPageVariables();
}

//Buys all available non-equip upgrades listed in var upgradeList
function buyUpgrades() {
    for (var upgrade in upgradeList) {
        upgrade = upgradeList[upgrade];
        var gameUpgrade = game.upgrades[upgrade];
        if ((game.jobs.Scientist.locked && upgrade != 'Battle') ? (canAffordTwoLevel(upgrade) && upgrade == 'Scientists') : (gameUpgrade.allowed > gameUpgrade.done && canAffordTwoLevel(upgrade))) {
            buyUpgrade(upgrade);
        }
    }
}

//Buys more storage if resource is over 90% full
function buyStorage() {
    var packMod = 1 + game.portal.Packrat.level * game.portal.Packrat.modifier;
    var Bs = {
        'Barn': 'food',
        'Shed': 'wood',
        'Forge': 'metal'
    };
    for (var B in Bs) {
        if (game.resources[Bs[B]].owned > game.resources[Bs[B]].max * packMod * 0.9) {
            // debug('Buying ' + B + '(' + Bs[B] + ') at ' + Math.floor(window.game.resources[Bs[B]].owned / (window.game.resources[Bs[B]].max * packMod * 0.99) * 100) + '%');
            if (canAffordBuilding(B)) {
                safeBuyBuilding(B);
            }
        }
    }
}

function buyBuildings() {
    highlightHousing();

    //if housing is highlighted
    if (bestBuilding != null) {
        //insert gigastation logic here ###############
        if (!safeBuyBuilding(bestBuilding)) {
            buyFoodEfficientHousing();
        }
    } else {
    	buyFoodEfficientHousing();
    }
}



////////////////////////////////////////
//Logic Loop////////////////////////////
////////////////////////////////////////

initializeAutoTrimps();

setInterval(function() {
    if (getPageSetting('chkBuyUpgrades')) buyUpgrades();
    if (getPageSetting('chkBuyStorage')) buyStorage();
    if (getPageSetting('chkBuyBuilding')) buyBuildings();

    saveSettings();
}, runInterval);
