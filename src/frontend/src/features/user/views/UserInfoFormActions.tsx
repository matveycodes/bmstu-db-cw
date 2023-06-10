import { FC } from "react";
import { Button, Flex, FlexProps } from "@chakra-ui/react";

interface Props extends Omit<FlexProps, "children"> {
  isEditing?: boolean;
  isSubmitting?: boolean;
  onEditClick?: () => void;
  onCancelClick?: () => void;
}

const UserInfoFormActions: FC<Props> = ({
  isEditing,
  isSubmitting,
  onEditClick,
  onCancelClick,
}) => {
  return (
    <Flex gap={3} justifyContent="flex-end">
      {isEditing ? (
        <Button
          colorScheme="blue"
          type="submit"
          key="save"
          isLoading={isSubmitting}
        >
          Сохранить
        </Button>
      ) : (
        <Button colorScheme="blue" variant="outline" onClick={onEditClick}>
          Редактировать
        </Button>
      )}

      {isEditing && (
        <Button colorScheme="blue" variant="outline" onClick={onCancelClick}>
          Отменить
        </Button>
      )}
    </Flex>
  );
};

export { UserInfoFormActions };
