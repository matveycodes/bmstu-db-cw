import { useCurrentUser } from "features/user";

import { AdminMapController } from "./AdminMapController";
import { CustomerMapController } from "./CustomerMapController";
import { GuestMapController } from "./GuestMapController";
import { TechnicianMapController } from "./TechnicianMapController";

const CurrentUserMapController = () => {
  const { data: user } = useCurrentUser();

  if (user?.is_active && user?.role === "admin") {
    return <AdminMapController />;
  }

  if (user?.is_active && user?.role === "technician") {
    return <TechnicianMapController />;
  }

  if (user?.is_active && user?.role === "customer") {
    return <CustomerMapController />;
  }

  return <GuestMapController />;
};

export { CurrentUserMapController };
