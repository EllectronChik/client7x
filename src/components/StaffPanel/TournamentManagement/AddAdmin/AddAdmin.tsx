import { FC, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { UsersApi } from "services/UserService";
import classes from "./AddAdmin.module.scss";
import { FormattedMessage, useIntl } from "react-intl";

interface IUserDict {
  [key: number]: {
    username: string;
    isStaff: boolean;
  };
}

/**
 * AddAdmin Component
 * 
 * This component allows administrators to manage user roles and permissions. 
 * Administrators can view a list of users, filter them by username, and toggle their 'isStaff' status.
 */
const AddAdmin: FC = () => {
  const [cookies] = useCookies(["token", "userId"]);
  const { data: allUsers } = UsersApi.useFetchAllUsersQuery(cookies.token);
  const [setIsStaff, {}] = UsersApi.useSetStaffUserMutation();
  const [users, setUsers] = useState<IUserDict>({});
  const [usersFilter, setUsersFilter] = useState<IUserDict>({});
  const intl = useIntl();

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

  useEffect(() => {
    setUsersFilter(users);
  }, [users]);

  return (
    <div className={classes.container}>
      <div className={classes.headerTop}>
        <h2><FormattedMessage id="username" /></h2>
        <h2><FormattedMessage id="isStaff" /></h2>
      </div>
      <div className={classes.header}>
        <input placeholder={intl.formatMessage({ id: "usernameFilter" })} type="text" className={classes.input} onChange={(e) => {
          setUsersFilter(
            Object.keys(users)
              .filter((userId) => users[Number(userId)].username.toLowerCase().includes(e.target.value.toLowerCase()))
              .reduce((acc, userId) => {
                acc[Number(userId)] = users[Number(userId)];
                return acc;
              }, {} as IUserDict)
          )
        }}/>
      </div>
      {Object.keys(usersFilter)
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
