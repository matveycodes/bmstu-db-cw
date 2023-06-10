import { ComponentProps, FC } from "react";
import { useToast } from "@chakra-ui/react";

import { handleErrors, useMutation } from "features/api";

import { proceedAuth } from "../api/auth";

import { CodeForm } from "../views/CodeForm";

interface Props extends ComponentProps<typeof CodeForm> {
  phone: string;
  signature: string;
  onTokenAcquired?: (token: string) => void;
}

const CodeFormController: FC<Props> = ({
  phone,
  signature,
  onTokenAcquired,
  ...props
}) => {
  const toast = useToast();

  const proceedMutation = useMutation({
    mutationFn: proceedAuth,
    onSuccess: ({ token }) => onTokenAcquired?.(token),
    onError: (error) =>
      handleErrors(error, (title) => toast({ title, status: "error" })),
  });

  return (
    <CodeForm
      phone={phone}
      onFill={(code) => proceedMutation.mutate({ code, signature })}
      isDisabled={proceedMutation.isLoading}
      {...props}
    />
  );
};

export { CodeFormController };
