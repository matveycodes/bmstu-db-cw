import NiceModal, { useModal } from "@ebay/nice-modal-react";
import pickBy from "lodash/pickBy";

import { useMutation } from "features/api";

import { useCurrentUser } from "../hooks/useCurrentUser";
import { useInvalidateCurrentUser } from "../hooks/useInvalidateCurrentUser";

import { updateCurrentUser } from "../api/user";

import { UserInfoFormData } from "../types/user-info-form";

import { UserInfoModal } from "../views/UserInfoModal";

const CurrentUserInfoModalController = NiceModal.create(() => {
  const modal = useModal();

  const { data: user } = useCurrentUser();
  const { invalidateCurrentUser } = useInvalidateCurrentUser();

  const updateMutation = useMutation({
    mutationFn: (data: UserInfoFormData) =>
      updateCurrentUser(pickBy(data, Boolean)),
    onSuccess: invalidateCurrentUser,
  });

  if (!user) {
    return null;
  }

  return (
    <UserInfoModal
      user={user}
      onSubmit={updateMutation.mutateAsync}
      isOpen={modal.visible}
      onClose={modal.hide}
      onCloseComplete={modal.remove}
    />
  );
});

export { CurrentUserInfoModalController };
