import { useCookies } from "react-cookie";
import { DeviceCntApi } from "services/DeviceCntService";

export const useLogoutUser = () => {
  const [cookie, setCookie] = useCookies(["token", "userId"]);
  const [decreaseDevices, {}] = DeviceCntApi.usePatchDeviceCntMutation();

  const logout = async () => {
    try {
      await decreaseDevices({ token: cookie.token, action: "decrease" });
      setCookie("token", "", { expires: new Date(0) });
      setCookie("userId", "", { expires: new Date(0) });
      window.location.reload();
    } catch (error) {
      console.error("Error when logging out of the system:", error);
    }
  };

  return logout;
};
