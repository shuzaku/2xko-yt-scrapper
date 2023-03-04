const rp = require('request-promise');
const cheerio = require('cheerio');
const rq = require('request');
const axios = require('axios')
let characterMatchupController = require("../controller/character-matchups");

var dbCharacters = null;

function scrapeContent() {
    scrapeCharacterMatchups()
        .then(()=> fetchCharacters)
}

function scrapeCharacterMatchups(){
    return new Promise((resolve, reject) => {
        var url = 'http://ratingupdate.info/matchups';
        console.log('scrapping...')
        rq(url, (err, res, html) => {
            if(err){
                reject();
            }

            let $ = cheerio.load(html);
            var characterRow = $('.table-container:nth-child(3) > .table > tbody > tr:first-child').toArray();
            var rows = $('.table-container:nth-child(3) > .table > tbody > tr:not(:first-child)').toArray();

            characterHeaders = getCharacters(characterRow);
            characterMatchups = rows.map(row => {
                return {
                    characterName: row.children[0].next.children[0].data,
                    matchups: getMatchups(row )
                }
            })

            mapCharacters(characterMatchups);
            resolve();
        });
    });
}


function getMatchups(row){
    var columns = row.children.slice(3);
    var index = 0;
    for (var i = 1; i <= columns.length; i += 1){
        columns.splice(i, 1);
    }

    var matchups = columns.map(column => {
        index++
        return {
            title: column.attribs.title,
            class: column.attribs.class,
            value: column.children[1].children[0].data.trim(),
            opposingCharacter: characterHeaders[index - 1],
            characterId: null,
            opposingCharacterId: null
        }
        
    });

    return matchups ;
};

function getCharacters(row){
    var columns = row[0].children;
    columns = columns.slice(3);

    for (var i = 1; i <= columns.length; i += 1){
        columns.splice(i, 1);
    }
    return columns.map(column => {
        return column.children[0].data
    });
}

const fetchCharacters = new Promise((resolve, reject) => {
    axios
        .get('https://fightme-server.herokuapp.com/characters')
        .then((response) => {
            dbCharacters = response.data.characters.map((character => {
                return {
                    characterName: character.Name,
                    id: character._id
                }
            }))
            resolve();
        })
        .catch((err)=>{
            console.log(err)
            reject();
        });
});

function translateCharacterAbbreviations(abbreviation){
    switch (abbreviation) {
        case 'SO':
            return 'Sol';
        case 'KY':
            return 'Ky';
        case 'MA':
            return 'May';
        case 'AX':            
            return 'Axl';
        case 'CH':            
            return 'Chipp';
        case 'PO':                
            return 'Potemkin';
        case 'FA':            
            return 'Faust';
        case 'MI':            
            return 'Millia';
        case 'ZA':            
            return 'Zato-1';
        case 'RA':            
            return 'Ramlethal';
        case 'LE':            
            return 'Leo';
        case 'NA':              
            return 'Nagoriyuki';
        case 'GI':            
            return 'Giovanna';
        case 'AN':            
            return 'Anji';
        case 'IN':            
            return 'I-No';
        case 'GO':            
            return 'Goldlewis';
        case 'JC':            
            return 'Jack-O\'';
        case 'HA':              
            return 'Happy Chaos';
        case 'BA':            
            return 'Baiken';
        case 'TE':              
            return 'Testament';
        default:
          console.log('error:' + abbreviation);
      }
}

function mapCharacters(characterMatchups){
    characterMatchups.forEach(characterMatchUp => {
        var matchups = characterMatchUp.matchups;
        var characterMatch = dbCharacters.filter(character => character.characterName === characterMatchUp.characterName)[0];
        matchups.forEach(matchup => {
            matchup.opposingCharacter = translateCharacterAbbreviations(matchup.opposingCharacter);
            matchup.characterId = characterMatch.id

            var opposingCharacterMatch = dbCharacters.filter(character => character.characterName === matchup.opposingCharacter)[0];
            matchup.opposingCharacterId = opposingCharacterMatch.id
        })
    });

    characterMatchupController.addCharacterMatchup(characterMatchups)
}


module.exports = {scrapeContent}