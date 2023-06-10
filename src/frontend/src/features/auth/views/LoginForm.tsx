import { ComponentPropsWithoutRef, FC, useState } from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { handleErrors } from "features/api";

import { PhoneInput } from "components/PhoneInput";

import { LoginFormData } from "../types/login-form";

import { LOGIN_FORM_VALIDATION_SCHEMA } from "../validation/login-form";

interface Props
  extends Omit<ComponentPropsWithoutRef<"form">, "onSubmit" | "children"> {
  onSubmit: (data: LoginFormData) => Promise<void>;
}

const LoginForm: FC<Props> = ({ onSubmit, ...props }) => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LOGIN_FORM_VALIDATION_SCHEMA),
  });

  const onBeforeSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);

    try {
      await onSubmit(data);
    } catch (error) {
      handleErrors(
        error,
        () => toast({ title: "Не удалось отправить код", status: "error" }),
        form
      );
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={form.handleSubmit(onBeforeSubmit)} {...props}>
      <Stack spacing={5}>
        <FormControl isInvalid={!!form.formState.errors.phone}>
          <FormLabel>Номер телефона</FormLabel>

          <PhoneInput {...form.register("phone")} />

          {form.formState.errors.phone ? (
            <FormErrorMessage>
              {form.formState.errors.phone.message}
            </FormErrorMessage>
          ) : (
            <FormHelperText>
              На него будет отправлен короткий код авторизации.
            </FormHelperText>
          )}
        </FormControl>

        <Button colorScheme="blue" isLoading={isSubmitting} type="submit">
          Отправить
        </Button>
      </Stack>
    </form>
  );
};

export { LoginForm };
