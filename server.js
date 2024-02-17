const express = require("express");
const cors = require("cors");
const { createClient } = require("redis");

const app = express();
const port = 3000;
let clients = [];

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors());

const subscriber = createClient();

subscriber.on("error", (err) => console.log("Redis Client Error", err));

(async () => {
  try {
    await subscriber.connect();
    console.log("Subscriber connected!");
  } catch (error) {
    console.log("Subscriber", error);
  }

  try {
    await subscriber.subscribe("airplane", (plane) => {
      console.log(JSON.parse(plane));

      console.log("Total clients: ", clients.length);

      clients.forEach((client) => {
        client.response.write("data: " + JSON.stringify(plane) + "\n\n");
      });
    });
    console.log("Subscriber subscribed!");
  } catch (error) {
    console.log("Subscriber: ", error);
  }
})();

// ---- API endpoints ----
app.get("/", (req, res) => {
  res.send("Ya salam!");
});

app.get("/status", (request, response) =>
  response.json({ clients: clients.length })
);

function eventsHandler(request, response, next) {
  console.log("New SSE connection...");
  const headers = {
    "Content-Type": "text/event-stream",
    'Access-Control-Allow-Origin': '*',
    "Connection": "keep-alive",
    "Cache-Control": "no-cache",
  };
  response.writeHead(200, headers);

  const data = { message: "You're subscribed for ads-b messages" };

  response.write("data: " + JSON.stringify(data) +"\n\n");

  const clientId = Date.now();

  const newClient = {
    id: clientId,
    response,
  };

  clients.push(newClient);

  request.on("close", () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter((client) => client.id !== clientId);
  });
}

app.get("/sse", eventsHandler);

// ---- Server listening ----
app.listen(port, () => {
  console.log(`ADS-B server listening on port ${port}`);
});
