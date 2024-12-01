//cheat sheet of login

//  ---import
// import Todo from "./types";
// import * as all from "./types";
// import  {isActive} from "./test";

// interface
interface BaiscEntity {
  id: number | string;
  name: string;
}
interface IPerson extends BaiscEntity {
  phone: string;
  address?: Address;
}
interface IUser {
  password?: string;
  userType: EUser;
  updateInfo(user: Partial<this>): void;
}

// type + utility types (Partial(line-18), Readonly(line-78))
type Address = [string, number];
type OnGuestUser = Exclude<EUser, EUser.Guest>;
type Prettify<T> = { [K in keyof T]: T[K] } & {};
type ClientsData = Awaited<ReturnType<typeof countClients>>;
type UserInfo = Prettify<IPerson & IUser>;
type UpdateUserInfo = Pick<UserInfo, "name" | "phone" | "password">;
type UserType = Omit<UserInfo, "id">;
type allUsers = Record<EUser, User[]>;
type login = Required<Pick<UserInfo, "name" | "password">>;
//PWis.ia (instead of an enum){
export const CRM_ACCOUNT_STATUS_LIST = [
  "active-customer",
  "inactive-customer",
  "lead",
] as const;

export type ISalesforceAccountStatus = (typeof CRM_ACCOUNT_STATUS_LIST)[number];
// }

// enum
enum EUser {
  Admin = "Admin",
  Client = "Client",
  Guest = "Guest",
}

// abstract class - implements
abstract class User implements UserType {
  // public - static
  public static userCount = 0;
  // private
  private id?: number | string;
  // protected
  protected isActive: boolean = true;
  name: string;
  phone: string;
  password: string;
  // readonly
  readonly userType: EUser;

  constructor(name: string, password: string, userType: EUser, phone: string) {
    this.name = name;
    this.password = password;
    this.phone = phone;
    this.userType = userType;
    if (userType !== EUser.Guest) {
      this.id = ++User.userCount;
    }
  }
  // abstract, method, utility type(Partial)
  abstract updateInfo(user: Partial<this>): void;
}

// export - extends
export class Client extends User {
  constructor(name: string, password: string, phone: string) {
    super(name, password, EUser.Client, phone);
  }

  updateInfo(user: Partial<UpdateUserInfo>): void {
    Object.assign(this, user);
  }
}

//utility type(Readonly), ...params = []
function allUsersPerType(...users: Readonly<User[]>): allUsers {
  const allUsers: allUsers = {
    [EUser.Admin]: [],
    [EUser.Client]: [],
    [EUser.Guest]: [],
  };

  users.forEach((user) => {
    allUsers[user.userType].push(user);
  });

  return allUsers;
}

//type is
function isClient(user: User): user is Client {
  return user instanceof Client;
}

//overloading, parameter-function
async function countClients(
  func: (user: User) => user is Client,
  users: User
): Promise<Client | boolean>;
async function countClients(
  func: (user: User) => user is Client,
  users: User[]
): Promise<Client[]>;
async function countClients(
  func: (user: User) => user is Client,
  users: User | User[]
): Promise<Client | Client[] | boolean> {
  if (Array.isArray(users)) {
    return users.filter((user) => func(user) && (user as Client));
  }
  return func(users) ? (users as Client) : false;
}

//never, danamic
function Err<T extends ErrorConstructor, K extends keyof T>(
  err: T,
  key: K
): never {
  if (key === "message") throw new Error(`error message: ${err[key]}`);
  else throw new Error("error on a message");
}

// export default
export default Client;
