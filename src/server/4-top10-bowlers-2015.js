const fs = require("fs");
const pathM = "src/data/matches.csv";
const pathD = "src/data/deliveries.csv";
const csv = require("csvtojson");
Promise.all([csv().fromFile(pathM), csv().fromFile(pathD)])
  .then(([data_match, data_deliveries]) => {
    const bowlerRuns = {};
    const bowlerBalls = {};
    for (let i = 0; i < data_match.length; i++) {
      if (data_match[i].season == 2015) {
        const id = data_match[i].id;
        for (let j = 0; j < data_deliveries.length; j++) {
          if (id == data_deliveries[j].match_id) {
            if (!bowlerBalls[data_deliveries[j].bowler]) {
              bowlerBalls[data_deliveries[j].bowler] = 0;
              bowlerRuns[data_deliveries[j].bowler] = 0;
            }
            bowlerBalls[data_deliveries[j].bowler]++;
            bowlerRuns[data_deliveries[j].bowler] += Number(
              data_deliveries[j].total_runs
            );
          }
        }
      }
    }
    const bowlerEconomy = [];
    for (const key in bowlerBalls) {
      const temp = {};
      temp["name"] = key;
      temp["economy"] = bowlerRuns[key] / (bowlerBalls[key] / 6);
      bowlerEconomy.push(temp);
    }

    for(let i=0;i<bowlerEconomy.length;i++) {
        for(let j=i+1;j<bowlerEconomy.length;j++) {
            const economy1 = bowlerEconomy[i].economy
            const economy2 = bowlerEconomy[j].economy
            if(economy1 > economy2) {
                const temp = bowlerEconomy[i]
                bowlerEconomy[i]=bowlerEconomy[j]
                bowlerEconomy[j]=temp                
            }
        }
    }

    const result = bowlerEconomy.splice(0,10)

    fs.writeFile(
      "src/public/output/4-topTenEconomicalBowlersIn2015.json",
      JSON.stringify(result),
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Data updated successfully.");
        }
      }
    );
  })
  .catch((err) => {
    console.error("Error:", err);
  });