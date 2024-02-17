const events = new EventSource("//127.0.0.1:3000/sse", {withCredentials: true});

events.onopen = (e) => {
    console.info("onopen: ", e);
}
events.onmessage = (event) => {
  const parsedData = JSON.parse(event.data);

  const objData = JSON.parse(`"${parsedData}"`);
  console.log(objData);

  console.log(parsedData);
};
events.onerror = (e) => {
    console.error("onerror: ", e);
}