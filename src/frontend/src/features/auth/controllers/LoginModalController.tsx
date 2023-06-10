import { useEffect, useState } from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";

import { setAuthToken } from "features/api";
import { useInvalidateCurrentUser } from "features/user";

import { LoginFormData } from "../types/login-form";

import { LoginModal } from "../views/LoginModal";

import { CodeFormController } from "./CodeFormController";
import { LoginFormController } from "./LoginFormController";

const LoginModalController = NiceModal.create(() => {
  const modal = useModal();

  const [phone, setPhone] = useState("");
  const [signature, setSignature] = useState("");

  const { invalidateCurrentUser } = useInvalidateCurrentUser();

  const onSignatureAcquired = (signature: string, data: LoginFormData) => {
    setSignature(signature);
    setPhone(data.phone);
  };

  const onTokenAcquired = async (token: string) => {
    setAuthToken(token);
    void modal.hide();
    await invalidateCurrentUser();
  };

  useEffect(() => {
    if (!modal.visible) {
      setPhone("");
      setSignature("");
    }
  }, [modal.visible]);

  return (
    <LoginModal
      isOpen={modal.visible}
      onClose={modal.hide}
      onCloseComplete={modal.remove}
    >
      {phone ? (
        <CodeFormController
          phone={phone}
          signature={signature}
          onTokenAcquired={onTokenAcquired}
        />
      ) : (
        <LoginFormController onSignatureAcquired={onSignatureAcquired} />
      )}
    </LoginModal>
  );
});

export { LoginModalController };
