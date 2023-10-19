import { useCookies } from "react-cookie";
import { UsersApi } from "services/UserService";


export const useLogoutUser = () => {
    const [cookie, setСookie] = useCookies(['token', 'userId']);
    const [logoutUser, {}] = UsersApi.useLogoutUserMutation();
  
    const logout = async () => {
      try {
        await logoutUser(cookie.token);
        setСookie('token', '', { expires: new Date(0) });
        setСookie('userId', '', { expires: new Date(0) });
      } catch (error) {
        console.error("Error when logging out of the system:", error);
      }
    };
  
    return logout; 
  };
  