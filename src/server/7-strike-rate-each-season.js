const fs = require("fs");
const pathM = "src/data/matches.csv";
const pathD = "src/data/deliveries.csv";
const csv = require("csvtojson");
Promise.all([csv().fromFile(pathM), csv().fromFile(pathD)])
  .then(([data_match, data_deliveries]) => {
    let strikeRate = {};
    for (const match of data_match) {
      if (!strikeRate[match.season]) {
        strikeRate[match.season] = { balls: 0, runs: 0 };
      } else {
        for (const deliveries of data_deliveries) {
          if (match.id == deliveries.match_id) {
            if (deliveries.batsman) {
              strikeRate[match.season]["balls"] += 1;
              strikeRate[match.season]["runs"] += Number(
                deliveries.batsman_runs
              );
            }
          }
        }
      }
    }
    const result = {};
    for (let key in strikeRate) {
      result[key] = Math.round(
        (strikeRate[key].runs / strikeRate[key].balls) * 100
      );
    }

    fs.writeFile(
      "src/public/output/7-strikeRateOfThePlayerEachSeason.json",
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