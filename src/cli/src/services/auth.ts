import { authProceedEndpoint, authRequestEndpoint } from "../endpoints/auth";

const AUTH_SERVICE = {
  key: "auth",
  title: "Авторизация (auth)",
  endpoints: [
    {
      title: "POST /auth/request/",
      handler: authRequestEndpoint,
    },
    {
      title: "POST /auth/proceed/",
      handler: authProceedEndpoint,
    },
  ],
};

export { AUTH_SERVICE };
