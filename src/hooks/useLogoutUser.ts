import { useCookies } from "react-cookie";
import { UsersApi } from "services/UserService";

export const useLogoutUser = () => {
  const [cookie, setCookie] = useCookies(["token", "userId"]);
  const [logoutUser, {}] = UsersApi.useLogoutUserMutation();

  const logout = async () => {
    try {
      await logoutUser(cookie.token);
      setCookie("token", "", { expires: new Date(0) });
      setCookie("userId", "", { expires: new Date(0) });
      window.location.reload();
    } catch (error) {
      console.error("Error when logging out of the system:", error);
    }
  };

  return logout;
};
