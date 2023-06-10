import { terminal } from "terminal-kit";

import { client } from "../api/client";

const parkingsGetEndpoint = async () => {
  try {
    const { data } = await client.get("/parkings/");
    terminal.green(JSON.stringify(data, null, 2));
  } catch (error) {
    terminal.red(error);
  }
};

export { parkingsGetEndpoint };
