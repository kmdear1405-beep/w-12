import { Credentail, logout } from "@/data/credential";
import { useRouter } from "next/navigation";
type Router = ReturnType<typeof useRouter>;
export const checkLogin = (router: Router, returnPath: string) => {
  //check credentail
  localStorage.setItem("returnPath", returnPath);
  const credentailString = localStorage.getItem("credentail");
  if (credentailString !== null) {
    const { token, email, name, role }: Credentail =
      JSON.parse(credentailString);
    if (
      token === undefined ||
      email === undefined ||
      name === undefined ||
      role === undefined
    ) {
      router.replace("/login");
      router.refresh();
    } else {
      //success
      router.replace(returnPath);
      router.refresh();
    }
  } else {
    router.replace("/login");
    router.refresh();
  }
};

export const doLogout = (router: Router, returnPath: string) => {
  const credentailString = localStorage.getItem("credentail");
  if (credentailString !== null) {
    const { token }: Credentail = JSON.parse(credentailString);

    logout(token)
      .then(() => {})
      .catch(()=>{})
      .finally(() => {
        localStorage.removeItem('credentail')
        router.replace(returnPath)
        router.refresh()
      });

  } else {
    router.replace(returnPath);
    router.refresh();
  }
};
