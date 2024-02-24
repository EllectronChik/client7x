import { useCookies } from "react-cookie";
import { UsersApi } from "services/UserService";

/**
 * Custom React hook for handling user logout functionality.
 * This hook integrates with cookies to clear user authentication tokens upon logout.
 * It also utilizes the `useLogoutUserMutation` function from the UsersApi to perform the logout operation.
 * 
 * @returns {Function} logout - A function to be called when initiating the logout process.
 * @throws {Error} Throws an error if there's any issue encountered during the logout process.
 */
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
