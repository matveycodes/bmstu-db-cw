import { ComponentPropsWithoutRef, FC, useState } from "react";
import { Stack, useToast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { handleErrors } from "features/api";

import { User } from "../types/user";
import { UserInfoFormData } from "../types/user-info-form";

import { USER_INFO_FORM_SCHEMA } from "../validation/user-info-form";

import { UserInfoFormPersonal } from "./UserInfoFormPersonal";
import { UserInfoFormActions } from "./UserInfoFormActions";

interface Props
  extends Omit<ComponentPropsWithoutRef<"form">, "children" | "onSubmit"> {
  user: User;
  onSubmit?: (data: UserInfoFormData) => Promise<void>;
}

const UserInfoForm: FC<Props> = ({ user, onSubmit, ...props }) => {
  const toast = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<UserInfoFormData>({
    resolver: zodResolver(USER_INFO_FORM_SCHEMA),
    defaultValues: {
      first_name: user.first_name || undefined,
      last_name: user.last_name || undefined,
      middle_name: user.middle_name || undefined,
      birthdate: user.birthdate || undefined,
      email: user.email || undefined,
    },
  });

  const onBeforeSubmit = async (data: UserInfoFormData) => {
    setIsSubmitting(true);

    try {
      await onSubmit?.(data);
    } catch (error) {
      console.log(error);
      handleErrors(error, (title) => toast({ title, status: "error" }), form);
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={form.handleSubmit(onBeforeSubmit)} {...props}>
      <Stack spacing={7}>
        <UserInfoFormPersonal form={form} isEditing={isEditing} />
        <UserInfoFormActions
          onCancelClick={() => setIsEditing(false)}
          onEditClick={() => setIsEditing(true)}
          isEditing={isEditing}
          isSubmitting={isSubmitting}
        />
      </Stack>
    </form>
  );
};

export { UserInfoForm };
