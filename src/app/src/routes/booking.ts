import Router from "@koa/router";

import { IBookingController } from "../interfaces/booking-controller";

const createBookingRouter = (controller: IBookingController) => {
  const bookingRouter = new Router({ prefix: "/bookings" });

  bookingRouter.get("/active/", controller.getActive.bind(controller));
  bookingRouter.post("/", controller.create.bind(controller));
  bookingRouter.delete("/:id/", controller.cancel.bind(controller));

  return bookingRouter;
};

export { createBookingRouter };
