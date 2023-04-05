const superagent = require('superagent');
const fs = require('fs');


const writeToJSON = async ( results, searchTerm, type='unknown' ) => {
    
    try {

        const data = {
            resultCount : results,
            search : searchTerm,
            searchType : type
        };

        // Checks if the history.json file exists, if not it will make one. await is important here
        // seems to hit a race condition otherwise.
        await fs.promises.access('history.json')
            .catch(() => {
                console.log('The file history.json Does Not exist! Creating File...');
                fs.promises.writeFile( 'history.json',  JSON.stringify( [] ) );
            });
        
        //Gets everything from the file
        const prevHistory = JSON.parse( await fs.promises.readFile('history.json') );

        // console.log(prevHistory);

        // Pushes on the new data the user is asking for
        prevHistory.push(data);

        // Writes the appened history to the file
        await fs.promises.writeFile('history.json', JSON.stringify(prevHistory) );

        // NOTE: we use JSON.stringify since the data being put into that file needs to be a String or other type
        // fs.writeFile also creates a file if it doesn't already exist, but still needs to be made into a valid JSON

    } catch (error) {
        console.log(error);
        console.log('ran into the error catch area in history.js');
    }
};



module.exports = {
    writeToJSON
};