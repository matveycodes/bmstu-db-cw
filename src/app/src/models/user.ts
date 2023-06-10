import { CreateUserDto } from "../dto/create-user";
import { BaseModel } from "./base";
import dayjs from "dayjs";

type UserId = string & { _opaque: "User" };

type UserStatus = "pending" | "active" | "blocked";

type UserRole = "customer" | "technician" | "admin";

class User extends BaseModel<UserId> {
  private _status: UserStatus;
  private _role: UserRole;
  private _dateJoined: Date;
  private _middleName?: string;
  private _firstName?: string;
  private _lastName?: string;
  private _email?: string;
  private _phone: string;
  private _birthdate?: Date;

  public constructor(createUserDto: CreateUserDto) {
    super(createUserDto.id);

    this._status = createUserDto.status;
    this._role = createUserDto.role;
    this._dateJoined = createUserDto.dateJoined;
    this._middleName = createUserDto.middleName;
    this._firstName = createUserDto.firstName;
    this._lastName = createUserDto.lastName;
    this._email = createUserDto.email;
    this._phone = createUserDto.phone;
    this._birthdate = createUserDto.birthdate;
  }

  public get status() {
    return this._status;
  }

  public set status(value: UserStatus) {
    this._status = value;
  }

  public get isActive() {
    return this.status === "active";
  }

  public get dateJoined() {
    return this._dateJoined;
  }

  public set dateJoined(value: Date) {
    this._dateJoined = value;
  }

  public get middleName() {
    return this._middleName;
  }

  public set middleName(value: string | undefined) {
    this._middleName = value;
  }

  public get firstName() {
    return this._firstName;
  }

  public set firstName(value: string | undefined) {
    this._firstName = value;
  }

  public get lastName() {
    return this._lastName;
  }

  public set lastName(value: string | undefined) {
    this._lastName = value;
  }

  public get email() {
    return this._email;
  }

  public set email(value: string | undefined) {
    this._email = value;
  }

  public get phone() {
    return this._phone;
  }

  public set phone(value: string) {
    this._phone = value;
  }

  public get birthdate() {
    return this._birthdate;
  }

  public set birthdate(value: Date | undefined) {
    this._birthdate = value;
  }

  public get age() {
    return this.birthdate ? dayjs().diff(this.birthdate, "years") : undefined;
  }

  public get role() {
    return this._role;
  }

  public set role(value: UserRole) {
    this._role = value;
  }

  public toJSON() {
    return {
      ...super.toJSON(),
      status: this.status,
      is_active: this.isActive,
      role: this.role,
      date_joined: this.dateJoined.toISOString(),
      middle_name: this.middleName ?? null,
      last_name: this.lastName ?? null,
      first_name: this.firstName ?? null,
      email: this.email ?? null,
      phone: this.phone,
      birthdate: this.birthdate?.toISOString().split("T")[0] ?? null,
      age: this.age ?? null,
    };
  }
}

export { User, UserId, UserStatus, UserRole };
