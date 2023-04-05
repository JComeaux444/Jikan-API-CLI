const yargs = require('yargs/yargs');

const app = require('./app.js');



yargs(process.argv.slice(2))
    // $0 expands the file name
    // <> indicate that the command is manadatory
    // [] indicate that options are optional
    .usage('$0: Usage <command> [options]')
    .command(
        // command
        // <> indicates the command argument required
        'search <catagory_name>',
        // description for the command
        'Searches for anime based on the string you gave it, '+
        'make sure you use option [anime]. Ex: node cli.js search anime -n [anime name]',
        // builder function to build out our command arguments and options
        // the argument inside the function below represents an instance of yargs
        (yargs) => {
            // configures a command argument based off the name
            // first argument below must match the name given in the <>
            // second agument is an options object
            return (
                yargs
                    .positional('catagory_name', {
                        describe: 'name of the catagory you want to use.',
                        type: 'string',
                        choices: ['anime','manga','character'] // Our api also has other choices we only use anime option
                    })
                    // options aka flags that exists on our command
                    // first argument is the short or long form for the option name (ex: long form)
                    // alias is opposite form of the first argument (ex: short form)
                    .options('name', {
                        // remember, to use this option and not get default, use -n then name, or --name
                        alias: 'n',
                        describe:
                            'Type the name of the anime you are looking for, default is Zipang',
                        default: 'Zipang'
                    })
            );
        },
        // handler functions for handling parsed command, command arguments, and options
        (args) => {
            if (args.catagory_name === 'anime') {
                
                // ------------------------------
                // Basically shows what is above in .options but it's slightly different. 
                //console.log('in the if === anime area, args:',args); // helped for debugging
                app.searchAnime(args); 
                // you can put args.name here but may limit what can be input into here if expanded
                // ------------------------------

            } else if (args.catagory_name === 'manga') {

                //Searches for the manga the user is looking for
                app.searchManga(args);
            
            } else if (args.catagory_name === 'character') {

                //Searches for the manga the user is looking for
                app.searchCharacter(args);

                //console.log(`${args.catagory_name} is not available, too many characters to memorize`);
            
            } else {
                console.log(`${args.catagory_name} is not available`);
            }
        }
    )
    .help().argv;
