import { ScooterId } from "../models/scooter";

type ScooterCommand =
  | "DISPLAY_ON"
  | "DISPLAY_OFF"
  | "UNLOCK"
  | "BEEP"
  | "LIGHTS_ON"
  | "LIGHTS_OFF"
  | "SPEED_LIMIT_ON"
  | "SPEED_LIMIT_OFF";

interface ScooterAPIGateway {
  sendCommand(
    scooterId: ScooterId,
    command: ScooterCommand,
    ...args: unknown[]
  ): Promise<void>;
}

export { ScooterAPIGateway, ScooterCommand };
