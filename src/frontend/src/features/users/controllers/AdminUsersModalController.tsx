import { useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import NiceModal, { useModal } from "@ebay/nice-modal-react";

import { handleErrors } from "features/api";
import { User } from "features/user";

import { blockUser } from "../api/users";

import { useUsers } from "../hooks/useUsers";
import { useInvalidateUsers } from "../hooks/useInvalidateUsers";

import { UsersModal } from "../views/UsersModal";

const AdminUsersModalController = NiceModal.create(() => {
  const modal = useModal();
  const toast = useToast();

  const { data: users = [], isLoading } = useUsers({ keepPreviousData: true });

  const { invalidateUsers } = useInvalidateUsers();

  const blockMutation = useMutation({
    mutationFn: (user: User) => blockUser(user.id),
    onSuccess: async () => {
      await invalidateUsers();
      toast({ title: "Пользователь успешно заблокирован", status: "success" });
    },
    onError: (error) =>
      handleErrors(error, (title) => toast({ title, status: "error" })),
  });

  return (
    <UsersModal
      users={users}
      isLoading={isLoading}
      isOpen={modal.visible}
      onClose={modal.hide}
      onCloseComplete={modal.remove}
      onBlock={blockMutation.mutate}
    />
  );
});

export { AdminUsersModalController };
