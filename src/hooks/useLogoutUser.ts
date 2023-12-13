import { useCookies } from "react-cookie";
import { DeviceCntApi } from "services/DeviceCntService";
import { returnToInitialState as AccountReturnToInitialState } from "store/reducers/AccountSlice";
import { returnToInitialState as DragPlayerReturnToInitialState } from "store/reducers/DragPlayerSlice";
import { useAppDispatch } from "./reduxHooks";

export const useLogoutUser = () => {
    const [cookie, setCookie] = useCookies(['token', 'userId']);
    const [decreaseDevices, {}] = DeviceCntApi.usePatchDeviceCntMutation();
    const dispatch = useAppDispatch();
  
    const logout = async () => {
      try {
        await decreaseDevices({token: cookie.token, action: 'decrease'});
        setCookie('token', '', { expires: new Date(0) });
        setCookie('userId', '', { expires: new Date(0) });
        dispatch(AccountReturnToInitialState());
        dispatch(DragPlayerReturnToInitialState());
      } catch (error) {
        console.error("Error when logging out of the system:", error);
      }
    };
  
    return logout; 
  };
  