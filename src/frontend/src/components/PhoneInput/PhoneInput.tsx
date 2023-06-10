import { ComponentProps, forwardRef } from "react";
import { PatternFormat } from "react-number-format";
import { Input } from "@chakra-ui/react";

import { PHONE_FORMAT } from "utils/phone";

type Props = Omit<
  ComponentProps<typeof PatternFormat<ComponentProps<typeof Input>>>,
  "format"
>;

const PhoneInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return (
    <PatternFormat
      allowEmptyFormatting
      mask="_"
      customInput={Input}
      type="tel"
      {...props}
      format={PHONE_FORMAT}
      getInputRef={ref}
    />
  );
});

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
