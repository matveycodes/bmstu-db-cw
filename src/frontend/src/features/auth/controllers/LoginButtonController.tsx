import { ComponentProps, FC } from "react";
import NiceModal from "@ebay/nice-modal-react";

import { LoginButton } from "../views/LoginButton";

import { LoginModalController } from "./LoginModalController";

type Props = Omit<ComponentProps<typeof LoginButton>, "onClick">;

const LoginButtonController: FC<Props> = (props) => {
  return <LoginButton onClick={onClick} {...props} />;
};

const onClick = () => NiceModal.show(LoginModalController);

export { LoginButtonController };
