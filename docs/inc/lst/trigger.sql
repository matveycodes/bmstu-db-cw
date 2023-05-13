CREATE TRIGGER prevent_user_delete
BEFORE DELETE ON users
FOR EACH ROW
WHEN EXISTS (
    SELECT 1 FROM rentals 
    WHERE user_id = OLD.user_id AND date_finished IS NULL
)
BEGIN
    RAISE EXCEPTION 'Нельзя удалить пользователя, имеющего активные аренды';
END;