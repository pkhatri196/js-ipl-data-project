const fs = require("fs");
const path = "src/data/matches.csv";
const csv = require("csvtojson");
csv()
  .fromFile(path)
  .then((data) => {
    const totalMatchesPerYear = {};
    for (let i = 0; i < data.length; i++) {
      if (!totalMatchesPerYear[data[i].season]) {
        totalMatchesPerYear[data[i].season] = 1;
      } else {
        totalMatchesPerYear[data[i].season] += 1;
      }
    }
    fs.writeFile(
      "src/public/output/matchesPerYear.json",
      JSON.stringify(totalMatchesPerYear),
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