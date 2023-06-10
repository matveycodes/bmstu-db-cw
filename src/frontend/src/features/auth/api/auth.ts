import { client } from "features/api";

import {
  ProceedAuthBody,
  ProceedAuthResponse,
  RequestAuthBody,
  RequestAuthResponse,
} from "../types/api";

const requestAuth = async (
  body: RequestAuthBody
): Promise<RequestAuthResponse> => {
  const { data } = await client.post<RequestAuthResponse>(
    "/auth/request/",
    body
  );

  return data;
};

const proceedAuth = async (
  body: ProceedAuthBody
): Promise<ProceedAuthResponse> => {
  const { data } = await client.post<ProceedAuthResponse>(
    "/auth/proceed/",
    body
  );

  return data;
};

export { requestAuth, proceedAuth };
