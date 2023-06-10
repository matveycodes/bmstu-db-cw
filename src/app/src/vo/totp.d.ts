interface TOTP {
  code: number;
  dateSent: Date;
  phone: string;
  signature: string;
  dateUsed?: Date;
}

export { TOTP };
