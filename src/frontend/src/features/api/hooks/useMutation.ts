import {
  useMutation as useReactMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

const useMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> => {
  return useReactMutation(options);
};

export { useMutation };
