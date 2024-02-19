import { FC, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { UsersApi } from "services/UserService";
import classes from "./AddAdmin.module.scss";

interface IUserDict {
  [key: number]: {
    username: string;
    isStaff: boolean;
  };
}

const AddAdmin: FC = () => {
  const [cookies] = useCookies(["token", "userId"]);
  const { data: allUsers } = UsersApi.useFetchAllUsersQuery(cookies.token);
  const [setIsStaff, {}] = UsersApi.useSetStaffUserMutation();
  const [users, setUsers] = useState<IUserDict>({});

  useEffect(() => {
    if (allUsers) {
      setUsers(
        allUsers.reduce((acc, user) => {
          acc[user.id] = {
            username: user.username,
            isStaff: user.isStaff,
          };
          return acc;
        }, {} as IUserDict)
      );
    }
  }, [allUsers]);

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h2>Username</h2>
        <h2>Is staff</h2>
      </div>
      {Object.keys(users)
        ?.filter((userId) => userId !== String(cookies.userId))
        .map((userId) => (
          <div key={userId} className={classes.user}>
            <h3>{users[Number(userId)].username}</h3>
            <input
              type="checkbox"
              checked={users[Number(userId)].isStaff}
              onChange={() => {
                setIsStaff({
                  token: cookies.token,
                  id: Number(userId),
                  state: users[Number(userId)].isStaff ? 0 : 1,
                });
                setUsers({
                  ...users,
                  [userId]: {
                    ...users[Number(userId)],
                    isStaff: !users[Number(userId)].isStaff,
                  },
                });
              }}
            />
          </div>
        ))}
    </div>
  );
};

export default AddAdmin;
