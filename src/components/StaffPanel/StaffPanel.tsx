import { useEffect, FC } from "react";
import TourManage from "./TournamentManagement/TourManage";
import { useIntl } from "react-intl";

const StaffPanel: FC = () => {
  const intl = useIntl();

  useEffect(() => {
    document.title = intl.formatMessage({ id: "staff" });
  }, [intl]);

  return (
    <div>
      <TourManage />
    </div>
  );
};

export default StaffPanel;
