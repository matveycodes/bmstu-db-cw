import { Response } from "features/api";

interface RequestAuthBody {
  phone: string;
}

type RequestAuthResponse = Response<{
  signature: string;
}>;

interface ProceedAuthBody {
  signature: string;
  code: number;
}

type ProceedAuthResponse = Response<{
  token: string;
}>;

export {
  RequestAuthBody,
  RequestAuthResponse,
  ProceedAuthBody,
  ProceedAuthResponse,
};
