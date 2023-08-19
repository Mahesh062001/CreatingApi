let express = require("express");


let { open } = require("sqlite");
let sqlite3 = require("sqlite3");
let path = require("path");
let app= express();
app.use(express.json())
let dp = null;
let requiredPath = path.join(__dirname, "cricketTeam.db");
let initializeDbAndServer = async () => {
  db = await open({
    filename: requiredPath,
    driver: sqlite3.Database,
  });
  app.listen(3000);
};
const caseConvert = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};
//initialiseDbAndServer();
app.get("/players/", async (request, response) => {
  let getData = `
    SELECT *
    FROM cricket_team;
    `;
  let result = await db.all(getData);
  //console.log(result);
  response.send(result.map((eachPlayer) => caseConvert(eachPlayer)));
});
app.post("/players/", async (request, response) => {
  const data = request.body;
  let { playerName, jerseyNumber, role } = data;
  let postData = `
     INSERT INTO cricket_team (player_name,jersey_number,role)
     VAlUES ("${playerName}"
        ${jerseyNumber},"${role}");
    `;
  const result = await db.run(postData);
  response.send("Player Added to Team");
});
app.get("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const getData = `
    SELECT *
    FROM cricket_team
    where player_id=${playerId};
    `;
  const data = await db.get(getData);
  response.send(caseConvert(data)));
});
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.
    params;
  const data = request.body;
  const { playerName, role } = data;
  const putData = `
    UPDATE 
    cricket_team
    SET "player_name"="${playerName}",
    "player_id"=${playerId},
    "role"="${role}"
    WHERE player_id=${playerId};
    `;
  await db.run(putData);
  response.send("Player Details Updated");
});
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteData = `
    DELETE FROM cricket_team
    WHERE "player_id"=${playerId};
    `;
  response.send("Player Remove");
});
initializeDbAndServer();

module.exports = app;
