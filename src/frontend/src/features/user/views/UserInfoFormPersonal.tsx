import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  SimpleGrid,
} from "@chakra-ui/react";
import { FC } from "react";
import { UseFormReturn } from "react-hook-form";

import { UserInfoFormData } from "../types/user-info-form";

interface Props {
  form: UseFormReturn<UserInfoFormData>;
  isEditing?: boolean;
}

const UserInfoFormPersonal: FC<Props> = ({ form, isEditing }) => {
  return (
    <SimpleGrid columns={2} spacing={3}>
      <FormControl isInvalid={!!form.formState.errors.first_name}>
        <FormLabel>Имя</FormLabel>
        <Input readOnly={!isEditing} {...form.register("first_name")} />
        {form.formState.errors.first_name && (
          <FormErrorMessage>
            {form.formState.errors.first_name.message}
          </FormErrorMessage>
        )}
      </FormControl>

      <FormControl isInvalid={!!form.formState.errors.last_name}>
        <FormLabel>Фамилия</FormLabel>
        <Input readOnly={!isEditing} {...form.register("last_name")} />
        {form.formState.errors.last_name && (
          <FormErrorMessage>
            {form.formState.errors.last_name.message}
          </FormErrorMessage>
        )}
      </FormControl>

      <FormControl isInvalid={!!form.formState.errors.middle_name}>
        <FormLabel>Отчество</FormLabel>
        <Input readOnly={!isEditing} {...form.register("middle_name")} />
        {form.formState.errors.middle_name && (
          <FormErrorMessage>
            {form.formState.errors.middle_name.message}
          </FormErrorMessage>
        )}
      </FormControl>

      <FormControl isInvalid={!!form.formState.errors.birthdate}>
        <FormLabel>Дата рождения</FormLabel>
        <Input
          type="date"
          readOnly={!isEditing}
          {...form.register("birthdate")}
        />
        {form.formState.errors.birthdate && (
          <FormErrorMessage>
            {form.formState.errors.birthdate.message}
          </FormErrorMessage>
        )}
      </FormControl>

      <FormControl isInvalid={!!form.formState.errors.email}>
        <FormLabel>Электронная почта</FormLabel>
        <Input type="email" readOnly={!isEditing} {...form.register("email")} />
        {form.formState.errors.email && (
          <FormErrorMessage>
            {form.formState.errors.email.message}
          </FormErrorMessage>
        )}
      </FormControl>
    </SimpleGrid>
  );
};

export { UserInfoFormPersonal };
