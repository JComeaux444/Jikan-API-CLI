const superagent = require('superagent');
const fs = require('fs');

const writeToJSON = async ( results, searchTerm, type='unknown' ) => {
    try {
        const data = {
            resultCount : results,
            search : searchTerm,
            searchType : type
        };


        // Checks if the history.json file exists, if not it will make one.
        if (!fs.existsSync('history.json')) {
            //console.log('The file history.json Does Not exist! Creating File...');
            fs.writeFileSync('history.json',  JSON.stringify( [] )  );
        } 

        //Gets everything from the file
        const prevHistory = JSON.parse(fs.readFileSync('history.json'));

        //console.log(prevHistory);
        // Pushes on the new data the user is asking for
        prevHistory.push(data);
        // Writes the appened history to the file
        fs.writeFileSync('history.json', JSON.stringify(prevHistory) );
        // NOTE: we use JSON.stringify since the data being put into that file needs to be a String or other type
        // fs.writeFileSync also creates a file if it doesn't already exist, but still needs to be made into a valid JSON
        //console.log('We are saving this to history JSON! Soon:tm: ',data);

    } catch (error) {
        console.log(error);
    }
};



module.exports = {
    writeToJSON
};