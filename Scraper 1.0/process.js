//  Required Modules
var mysql = require('mysql');
var async = require('async');
var fs = require('fs');
var check = require('validator').check, sanitize = require('validator').sanitize;

// Mysql Information
var client = mysql.createConnection({ 
   host: '',
   port: 3306,
   user: '', 
   password: '', 
   database: ''
  });

// Global Variables
var playerName = sanitize(fs.readFileSync("name.txt", 'utf8')).trim('\r\n\t');
var wins = sanitize(fs.readFileSync("wins.txt", 'utf8').substring(0,1)).trim('\r\n\t');
var opponent = sanitize(fs.readFileSync("opponent.txt", 'utf8')).trim('\r\n\t');
var oppchar = sanitize(fs.readFileSync("oppchar.txt", 'utf8')).trim('\r\n\t');
var namechar = sanitize(fs.readFileSync("namechar.txt", 'utf8')).trim('\r\n\t');
var date = new Date();

// Write Data to Designated Table
tableWrite = function() {
	if (wins === "" ) {
    	console.log(wins);
		console.log("Menu Screen or un-readable data...");
	}
  else if (playerFinal === "fuck") {
		client.query('insert into temp (playername, wins, opponent, oppchar, namechar) values ("' + playerName + '","' + wins + '","' + opponent + '","' + oppchar + '","' + namechar + '")',
		function selectCb(err, results, fields) {
			if (err) throw err;
			else console.log('Player ' + playerName + ' has been inserted into buffer table with a win streak of ' + wins + '.');
		});
   }
	else if (playerFinal !== playerName && wins == 1) {
		client.query('insert into players (playername, wins, opponent, date, oppchar, namechar) values ("' + playerFinal + '","' + winsFinal + '","' + opponentFinal + '","NOW()","' + oppcharFinal + '","' + namecharFinal + '")',
		function selectCb(err, results, fields) {
			if (err) throw err;	
			else 
      console.log('Player ' + playerFinal + ' is on a win streak of ' + winsFinal + '. Results recorded. New player...');			
		});
		client.query('TRUNCATE TABLE temp',
		function selectCb(err, results, fields) {
			if (err) throw err;
			else console.log('Buffer Table Rebooted.');
		});	
	}
	else if (playerFinal === playerName && wins - 1 === winsFinal) {
		client.query('insert into players (playername, wins, opponent, date, oppchar, namechar) values ("' + playerFinal + '","' + winsFinal + '","' + opponentFinal + '","NOW()","' + oppcharFinal + '","' + namecharFinal + '")',
		function selectCb(err, results, fields) {
			if (err) throw err;
			else console.log('Player ' + playerFinal + ' is on a win streak of ' + winsFinal + '. Results recorded...');			
		});
		client.query('TRUNCATE TABLE temp',
		function selectCb(err, results, fields) {
			if (err) throw err;
			else console.log('Buffer Table Rebooted.');
		});
	}
	else {
		client.query('insert into temp (playername, wins, opponent, oppchar, namechar) values ("' + playerName + '","' + wins + '","' + opponent + '","' + oppchar + '","' + namechar + '")',
		function selectCb(err, results, fields) {
			if (err) throw err;
			else console.log('Player ' + playerName + ' has been inserted into buffer table with a win streak of ' + wins + '.');
		});
	}	
};

// Process Temp Table
async.series([
    function(cb) {
		client.query('SELECT opponent, COUNT(*) AS magnitude FROM temp GROUP BY opponent ORDER BY magnitude DESC LIMIT 1',
			function(err, rows, fields) {
				if (err) throw err;
					if (rows.length == 0) {
						client.query('insert into temp (playername, wins, opponent, oppchar, namechar) values ("fuck","the","police","you","too")',
						function selectCb(err, results, fields) {
							if (err) throw err;
							else console.log('Inserted Hot Cop Action');
						});
					} else {
						var code = rows[0].opponent;
					}
				cb(null, code);
        });
    },
    function(cb) {
		client.query('SELECT wins, COUNT(*) AS magnitude FROM temp GROUP BY wins ORDER BY magnitude DESC LIMIT 1',
			function(err, rows, fields) {
				if (err) throw err;
				var code = rows[0].wins;
				cb(null, code);
        });
    },
    function(cb) {
		client.query('SELECT playername, COUNT(*) AS magnitude FROM temp GROUP BY playername ORDER BY magnitude DESC LIMIT 1',
			function(err, rows, fields) {
				if (err) throw err;
				var code = rows[0].playername;
				cb(null, code);
        });
    },
    function(cb) {
		client.query('SELECT oppchar, COUNT(*) AS magnitude FROM temp GROUP BY oppchar ORDER BY magnitude DESC LIMIT 1',
			function(err, rows, fields) {
				if (err) throw err;
				var code = rows[0].oppchar;
				cb(null, code);
        });
    },
    function(cb) {
		client.query('SELECT namechar, COUNT(*) AS magnitude FROM temp GROUP BY namechar ORDER BY magnitude DESC LIMIT 1',
			function(err, rows, fields) {
				if (err) throw err;
				var code = rows[0].namechar;
				cb(null, code);
        });
    }
], function (err, result) {
	opponentFinal = result[0];
	winsFinal = parseInt(result[1]);
	playerFinal = result[2];
  	oppcharFinal = result[3];
  	namecharFinal = result[4];
	tableWrite();
  	client.end();
	setTimeout(function() {
    	process.exit();
  }, 1000);
});