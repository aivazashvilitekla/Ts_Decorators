import { getUserById, User } from "./users";
function memo(x: number): any {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const c = new Map();

    descriptor.value = async function () {
      const id = (<HTMLInputElement>input).value;
      if (!c.has(id)) {
        console.log("user from method");

        const user: User = await originalMethod(id);
        c.set(id, user);
        console.log("user saved in cache");
        methodUser.innerText = user.firstname;
        setTimeout(() => {
          c.delete(id);
          console.log("deleted");
        }, x * 60 * 1000);
      } else {
        console.log("user from cache");
        cacheUser.innerText = c.get(id).firstname;
      }
    };
  };
}

class UsersService {
  @memo(1) // <- Implement This Decorator
  getUserById(id: number): Promise<User> {
    return getUserById(id);
  }
}
const usersService = new UsersService();
const cacheUser = <HTMLElement>(
  document.getElementById("userFromCache").children[1]
);
const methodUser = <HTMLElement>(
  document.getElementById("userFromMethod").children[1]
);
const btn = document.getElementById("btn");
const input = document.getElementById("userId");
const loading = document.getElementById("loading");
btn.addEventListener("click", async () => {
  loading.innerHTML = "loading";
  await usersService
    .getUserById(+(input as HTMLInputElement).value)
    .then((x) => console.log(x));
  loading.innerHTML = "";
});
