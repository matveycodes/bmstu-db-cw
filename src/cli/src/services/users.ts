import {
  usersBlockEndpoint,
  usersGetCurrentEndpoint,
  usersUpdateCurrentEndpoint,
} from "../endpoints/users";

const USERS_SERVICE = {
  key: "users",
  title: "Пользователи (users)",
  endpoints: [
    {
      title: "GET /users/current/",
      handler: usersGetCurrentEndpoint,
    },
    {
      title: "PATCH /users/current/",
      handler: usersUpdateCurrentEndpoint,
    },
    {
      title: "POST /users/:id/block/",
      handler: usersBlockEndpoint,
    },
  ],
};

export { USERS_SERVICE };
