import { ComponentProps, FC } from "react";
import { useToast } from "@chakra-ui/react";

import { handleErrors, useMutation } from "features/api";
import { useInvalidateScooters } from "features/scooters";

import { cancelBooking } from "../api/bookings";

import { Booking } from "../types/booking";

import { useInvalidateBookings } from "../hooks/useInvalidateBookings";
import { useActiveBookings } from "../hooks/useActiveBookings";

import { BookingsCard } from "../views/BookingsCard";

type Props = Omit<
  ComponentProps<typeof BookingsCard>,
  "bookings" | "onCancelClick"
>;

const CurrentUserActiveBookingsController: FC<Props> = () => {
  const toast = useToast();

  const { data: bookings = [] } = useActiveBookings({
    refetchInterval: 30 * 1000,
    keepPreviousData: true,
  });

  const { invalidateBookings } = useInvalidateBookings();
  const { invalidateScooters } = useInvalidateScooters();

  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: async () => {
      await invalidateBookings();
      toast({ title: "Бронирование отменено", status: "success" });
      void invalidateScooters();
    },
    onError: (error) =>
      handleErrors(error, (title) => toast({ title, status: "error" })),
  });

  const onBookingExpire = async (booking: Booking) => {
    toast({
      title: `Бронирование самоката ${booking.scooter_number} истекло`,
      status: "warning",
    });

    await invalidateBookings();
    await invalidateScooters();
  };

  return (
    <BookingsCard
      bookings={bookings}
      onCancelClick={(booking) => cancelMutation.mutate(booking.id)}
      onBookingExpire={onBookingExpire}
    />
  );
};

export { CurrentUserActiveBookingsController };
