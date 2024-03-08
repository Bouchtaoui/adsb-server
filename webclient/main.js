const events = new EventSource("//127.0.0.1:3000/sse", {
  withCredentials: true,
});

events.onopen = (e) => {
  console.info("onopen: ", e);

  const demo = JSON.parse(`{
  "message_type":"MSG",
  "transmission_type":3,
  "session_id":null,
  "aircraft_id":null,
  "hex_ident":"4CA73B",
  "flight_id":null,
  "generated_date":null,
  "generated_time":null,
  "logged_date":null,
  "logged_time":null,
  "callsign":null,
  "altitude":37925,
  "ground_speed":369,
  "track":271,
  "lat":51.93447,
  "lon":4.07475,
  "vertical_rate":-768,
  "squawk":"3101",
  "alert":false,
  "emergency":false,
  "spi":false,
  "is_on_ground":true
}`);

  // console.log(demo);
};
events.onmessage = (event) => {
  const parsedData = JSON.parse(event.data);

//   console.log(parsedData);

  if (typeof parsedData === 'string') {
    const objData = JSON.parse(`${parsedData}`);
    console.log(objData);
  }
};
events.onerror = (e) => {
  console.error("onerror: ", e);
};
