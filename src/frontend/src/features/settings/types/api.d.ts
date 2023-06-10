import { Response } from "features/api";

import { Setting } from "./setting";

type GetSettingsResponse = Response<Setting[]>;

export { GetSettingsResponse };
