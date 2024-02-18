import { FC, HTMLProps, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { ClanApi } from "services/ClanService";
import classes from "./EditLinks.module.scss";
import deleteWhite from "assets/images/techImages/deleteWhite.svg";
import { ManagerApi } from "services/ManagerSerevice";
import Button7x from "components/UI/Button7x/Button7x";
import { FormattedMessage, useIntl } from "react-intl";

interface ITeamResource {
  id: number;
  teamId: number;
  url: string;
  name: string;
}

interface IManagerResource {
  id: number;
  userId: number;
  url: string;
}

interface IProps extends HTMLProps<HTMLDivElement> {
  teamResources?: ITeamResource[];
  managerResources?: IManagerResource[];
}

const EditLinks: FC<IProps> = ({ ...props }) => {
  const [timeouts] = useState<{
    [key: number]: [
      NodeJS.Timeout | undefined,
      NodeJS.Timeout | undefined,
      NodeJS.Timeout | undefined
    ];
  }>({});
  const [managerResources, setManagerResources] = useState<IManagerResource[]>(
    []
  );
  const [teamResources, setTeamResources] = useState<ITeamResource[]>([]);
  const [patchTeamUrl, {}] = ClanApi.usePatchClanResUrlMutation();
  const [patchTeamName, {}] = ClanApi.usePatchClanResNameMutation();
  const [patchManagerUrl, {}] = ManagerApi.usePatchManagerContactMutation();
  const [deleteManagerUrl, {}] = ManagerApi.useDeleteManagerContactMutation();
  const [deleteTeamRes, {}] = ClanApi.useDeleteClanResMutation();
  const [postTeamRes, { data: newTeamRes }] = ClanApi.usePostClanResMutation();
  const [postManagerRes, { data: newManagerRes }] =
    ManagerApi.usePostManagerContactMutation();
  const [cookies] = useCookies(["token", "userId"]);
  const intl = useIntl();

  useEffect(() => {
    if (props.managerResources) {
      setManagerResources(props.managerResources);
    }
    if (props.teamResources) {
      setTeamResources(props.teamResources);
    }
  }, [props.managerResources, props.teamResources]);

  const handleUpdateTeamName = (id: number, value: string) => {
    if (timeouts[id] && timeouts[id][0]) clearTimeout(timeouts[id][0]);
    timeouts[id] = [
      setTimeout(() => {
        patchTeamName({ token: cookies.token, id: id, data: value });
      }, 2000),
      timeouts[id] && timeouts[id][1] ? timeouts[id][1] : undefined,
      timeouts[id] && timeouts[id][2] ? timeouts[id][2] : undefined,
    ];
  };

  const handleUpdateTeamUrl = (id: number, value: string) => {
    if (timeouts[id] && timeouts[id][1]) clearTimeout(timeouts[id][1]);
    timeouts[id] = [
      timeouts[id] && timeouts[id][0] ? timeouts[id][0] : undefined,
      setTimeout(() => {
        patchTeamUrl({ token: cookies.token, id: id, data: value });
      }, 2000),
      timeouts[id] && timeouts[id][2] ? timeouts[id][2] : undefined,
    ];
  };

  const handleUpdateManagerUrl = (id: number, value: string) => {
    if (timeouts[id] && timeouts[id][2]) clearTimeout(timeouts[id][2]);
    timeouts[id] = [
      timeouts[id] && timeouts[id][0] ? timeouts[id][0] : undefined,
      timeouts[id] && timeouts[id][1] ? timeouts[id][1] : undefined,
      setTimeout(() => {
        patchManagerUrl({ token: cookies.token, id: id, data: value });
      }, 2000),
    ];
  };

  const handleDeleteManagerUrl = (id: number) => {
    deleteManagerUrl({ token: cookies.token, id: id });
    setManagerResources(managerResources.filter((m) => m.id !== id));
  };

  const handleDeleteTeamRes = (id: number) => {
    deleteTeamRes({ token: cookies.token, id: id });
    setTeamResources(teamResources.filter((t) => t.id !== id));
  };

  const handlePostTeamRes = () => {
    postTeamRes({ token: cookies.token });
  };

  const handlePostManagerRes = () => {
    postManagerRes({ token: cookies.token });
  };

  useEffect(() => {
    if (
      newTeamRes &&
      teamResources.findIndex((t) => t.id === newTeamRes.id) === -1
    ) {
      setTeamResources([
        ...teamResources,
        { id: newTeamRes.id, name: "", url: "", teamId: newTeamRes.teamId },
      ]);
    }
  }, [newTeamRes]);

  useEffect(() => {
    if (
      newManagerRes &&
      managerResources.findIndex((m) => m.id === newManagerRes.id) === -1
    ) {
      setManagerResources([
        ...managerResources,
        { id: newManagerRes.id, userId: cookies.userId, url: "" },
      ]);
    }
  }, [newManagerRes]);

  return (
    <div className={classes.container}>
      <h3>
        <FormattedMessage id="teamResources" />
      </h3>
      <div className={`${classes.resource}`}>
        <h3 className={classes.title}>
          <FormattedMessage id="linkTitle" />
        </h3>
        <div className={classes.titleBox}>
          <h3 className={classes.title}>
            <FormattedMessage id="link" />
          </h3>
          <span className={classes.titlePlaceholder}></span>
        </div>
      </div>
      {teamResources &&
        teamResources.map((resource) => (
          <div className={classes.resource} key={resource.id}>
            <input
              className={classes.input}
              type="text"
              placeholder={intl.formatMessage({ id: "linkTitle" })}
              defaultValue={resource.name}
              onChange={(e) => {
                handleUpdateTeamName(resource.id, e.target.value);
              }}
            />
            <div className={classes.inputBox}>
              <input
                className={classes.input}
                type="text"
                placeholder={intl.formatMessage({ id: "link" })}
                defaultValue={resource.url}
                onChange={(e) => {
                  handleUpdateTeamUrl(resource.id, e.target.value);
                }}
              />
              <img
                className={classes.delete}
                src={deleteWhite}
                alt="delete"
                onClick={() => handleDeleteTeamRes(resource.id)}
              />
            </div>
          </div>
        ))}
      <Button7x className={classes.button} onClick={handlePostTeamRes}>
        <FormattedMessage id="addResource" />
      </Button7x>
      <h3>
        <FormattedMessage id="managerContacts" />
      </h3>
      {managerResources &&
        managerResources.map((resource) => (
          <div
            key={resource.id}
            className={`${classes.managerResource} ${classes.resource}`}
          >
            <input
              className={classes.input}
              type="text"
              placeholder={intl.formatMessage({ id: "link" })}
              defaultValue={resource.url}
              onChange={(e) =>
                handleUpdateManagerUrl(resource.id, e.target.value)
              }
            />
            <img
              className={classes.delete}
              src={deleteWhite}
              alt="delete"
              onClick={() => handleDeleteManagerUrl(resource.id)}
            />
          </div>
        ))}
      <Button7x className={classes.button} onClick={handlePostManagerRes}>
        <FormattedMessage id="addContact" />
      </Button7x>
    </div>
  );
};

export default EditLinks;
