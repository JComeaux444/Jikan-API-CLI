const prompts = require('prompts');

const api = require('./api.js');
const history = require('./history.js');




// for future _prompt changes, incoming will be a whole object with pagination / data. 
// will need checks for next/prev page in prompt methods and append to beginning and end of display* const


//fancy prompt we use that allows users to look at and chose the anime they were looking for
const _animePrompt = async (animes) => {
    const displayAnimes = animes.map((anime) => {
        return { title: `${anime.title}, Year: ${anime.year}`, value: anime.mal_id };
    });

    return await prompts([
        {
            type: 'select',
            name: 'anime',
            message: 'Select a anime to view',
            choices: displayAnimes
            
        }
    ]);
};


//The thing that will be grabbing the id of anime user selects then prints out the info in a nice way
const _printAnimeInfo = async (anime) => {
    //console.log(anime);
    //console.log(anime.data.genres);
    const genres = [];
    anime.data.genres.forEach(genre => {
        genres.push(genre.name);
        //console.log(genre.name);
    });
    // font colors from https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
    // explains the colors should be able to work on all platforms as it is a standard
    console.log (
        '\x1b[34m',' MyAnimeList URL:','\x1b[0m', anime.data.url,' \n',
        '\x1b[32m','Title:','\x1b[0m', anime.data.title,' \n',
        '\x1b[32m','English Title:','\x1b[0m',anime.data.title_english,' \n',
        '\x1b[32m','Year Released:','\x1b[0m',anime.data.year,' \n',
        '\x1b[32m','User Scores:','\x1b[0m',anime.data.score,' \n',
        '\x1b[32m','Genre(s):','\x1b[0m',genres,' \n',
        '\x1b[35m','Synopsis:','\x1b[0m',anime.data.synopsis,' \n'

    );

};


const searchAnime = async (args) => {

    const { name } = args;
    //console.log('name in app : ',name);

    // get a anime matches.
    // using .name gets from whatever the user input as the option arg, 
    // also isnt object so api can search for that name
    const listOfPicks = await api.findAnimeLike(name);

    //We see everything that the api gives us including other info we may not need
    // if we use .data we will get info from the anime only. each API is different however
    //console.log('list of picks is here!: \n ',listOfPicks); // good for debugging


    // statement makes sure we have something to pick from or exits everything else to prevent freezing
    if(listOfPicks == null){
        console.log('\x1b[41m \x1b[30m',
            `We found 0 results for the search term "${name}"`,
            '\x1b[0m \n');
        return;
    }

    //console.log('\x1b[43m \x1b[30m','test fonts','\x1b[0m','\n');

    //from this we also are given amount of results. We can use the first line 'name' as search term in history.json too.
    console.log('\x1b[43m \x1b[30m',
        `We found ${listOfPicks.pagination.items.total} results for the search term "${name}"`,
        '\x1b[0m \n');
    if(listOfPicks.pagination.items.total > 25){
        console.log('\x1b[43m \x1b[30m',
            `We can only show you ${listOfPicks.pagination.items.count} results at the moment`,
            '\x1b[0m \n');
    }

    // choices for the user to pick from
    const choice = await _animePrompt(listOfPicks.data);

    let mediaType = Object.keys(choice);
    mediaType = mediaType[0];

    // Note that _animePrompt will return value anime.mal_id of selected. This is what log shows as well
    // we get it through .anime when we get here however.
    // console.log('variable "choices" is here!: \n ',choices);
    // console.log('variable "choices.anime" is here!: \n ',choices.anime);

    //Basically we get the id from _animePrompt, then give to another API call/method that gets by ID to return more info

    // uses API to get anime data by ID
    const animeChosen = await api.findAnimeByID(choice.anime);
    // Will print all the data said anime has.
    //console.log('variable "animeChosen" is here!: \n ',animeChosen);


    // Calls a function that prints out the info in a nicer fashion simple and uses console.log
    const animeOutput = await _printAnimeInfo(animeChosen);

    // Where we append the search and results to the history, using historyjs call
    const logHistory = await history.writeToJSON(listOfPicks.pagination.items.total,name,mediaType);

};

// ------------------------------ Manga -----------------------------------

//fancy prompt we use that allows users to look at and chose the anime they were looking for
const _mangaPrompt = async (manga) => {
    const displayManga = manga.map((manga) => {
        // API returns a JSON in which you must get year doing this or similiar
        return { title: `${manga.title}, Year: ${manga.published.prop.from.year}`, value: manga.mal_id };
    });

    return await prompts([
        {
            type: 'select',
            name: 'manga',
            message: 'Select a manga to view',
            choices: displayManga
            
        }
    ]);
};

//The thing that will be grabbing the id of the manga the user selects then prints out the info in a nice way
const _printMangaInfo = async (manga) => {
    //console.log(manga);

    const genres = [];
    
    manga.data.genres.forEach(genre => {
        genres.push(genre.name);
    });
    
    // font colors from https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
    
    console.log (
        '\x1b[34m',' MyAnimeList URL:','\x1b[0m', manga.data.url,' \n',
        '\x1b[32m','Title:','\x1b[0m', manga.data.title,' \n',
        '\x1b[32m','English Title:','\x1b[0m',manga.data.title_english,' \n',
        '\x1b[32m','Status:','\x1b[0m',manga.data.status,' \n',
        '\x1b[32m','Year Published:','\x1b[0m',manga.data.published.string,' \n',
        '\x1b[32m','User Scores:','\x1b[0m',manga.data.score,' \n',
        '\x1b[32m','Genre(s):','\x1b[0m',genres,' \n',
        '\x1b[35m','Synopsis:','\x1b[0m',manga.data.synopsis,' \n'

    );
    

};



const searchManga = async (args) => {
    const { name } = args;

    //returns list of item matching the search term (name)
    const listOfPicks = await api.findMangaLike(name);
    
    // statement makes sure we have something to pick from or exits everything else to prevent freezing
    if(listOfPicks == null){
        console.log('\x1b[41m \x1b[30m',
            `We found 0 results for the search term "${name}"`,
            '\x1b[0m \n');
        return;
    }
    console.log('\x1b[43m \x1b[30m',
        `We found ${listOfPicks.pagination.items.total} results for the search term "${name}"`,
        '\x1b[0m \n');
    if(listOfPicks.pagination.items.total > 25){
        console.log('\x1b[43m \x1b[30m',
            `We can only show you ${listOfPicks.pagination.items.count} results at the moment`,
            '\x1b[0m \n');
    }

    // choices for the user to pick from
    const choice = await _mangaPrompt(listOfPicks.data);
    //console.log(choice);
    let mediaType = Object.keys(choice);
    mediaType = mediaType[0];

    // uses API to get anime data by ID
    const mangaChosen = await api.findMangaByID(choice.manga);
    //prints data given out by above call
    //console.log(mangaChosen);

    const mangaOutput = await _printMangaInfo(mangaChosen);

    const logHistory = await history.writeToJSON(listOfPicks.pagination.items.total,name,mediaType);
};


module.exports = {
    searchAnime,
    searchManga
};