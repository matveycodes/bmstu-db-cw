import { Response } from "features/api";

import { RestrictedZone } from "./restricted-zone";

type GetRestrictedZonesResponse = Response<RestrictedZone[]>;

export { GetRestrictedZonesResponse };
