import { ComponentProps, FC } from "react";

import { serializePhone } from "utils/phone";

import { requestAuth } from "../api/auth";

import { LoginFormData } from "../types/login-form";

import { LoginForm } from "../views/LoginForm";

interface Props extends Omit<ComponentProps<typeof LoginForm>, "onSubmit"> {
  onSignatureAcquired: (signature: string, data: LoginFormData) => void;
}

const LoginFormController: FC<Props> = ({ onSignatureAcquired, ...props }) => {
  const onSubmit = async (data: LoginFormData) => {
    const phone = serializePhone(data.phone);

    const { signature } = await requestAuth({ phone });

    onSignatureAcquired(signature, data);
  };

  return <LoginForm onSubmit={onSubmit} {...props} />;
};

export { LoginFormController };
