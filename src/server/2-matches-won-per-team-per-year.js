const fs = require("fs");
const path = "src/data/matches.csv";
const csv = require("csvtojson");
csv()
  .fromFile(path)
  .then((data) => {
    const perYear = {};
    for (let i = 0; i < data.length; i++) {
      if (perYear[data[i].season]) {
        const teamWon = {};
        for (let j = 0; j < data.length; j++) {
          if (data[i].season == data[j].season) {
            if (!teamWon[data[j].winner]) {
              teamWon[data[j].winner] = 1;
            } else {
              teamWon[data[j].winner] += 1;
            }
          }
        }
        perYear[data[i].season] = teamWon;
      } else {
        perYear[data[i].season] = {};
      }
    }
    fs.writeFile(
      "src/public/output/2-matchesWonPerTeamPerYear.json",
      JSON.stringify(perYear),
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