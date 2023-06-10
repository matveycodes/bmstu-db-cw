interface SMSGateway {
  sendMessage(phone: string, message: string): Promise<void>;
}

export { SMSGateway };
