import Input7x from "components/UI/Input7x/Input7x";
import classes from "./MediaForm.module.scss";
import { IResorce } from "models/IResorce";
import { FormattedMessage } from "react-intl";
import { JSX, Dispatch, SetStateAction } from "react";

/**
 * MediaForm Component
 *
 * This component handles the addition of media forms, allowing users to input media URLs and names.
 * @param {JSX.Element[]} resForms - Array of JSX elements representing media forms
 * @param {function} setResForms - Function to update the state of media forms
 * @param {function} setResources - Function to update the state of resources
 */
export const handleAddMediaForm = (
  resForms: JSX.Element[],
  setResForms: Dispatch<SetStateAction<JSX.Element[]>>,
  setResorces: Dispatch<SetStateAction<IResorce[]>>
) => {
  const newId = resForms.length;
  const newMediaForm = (
    <div className={classes.mediaForm} key={newId}>
      <div className={classes.mediaFormBox}>
        <label>
          <FormattedMessage id="media" /> {resForms.length + 1} name:
        </label>
        <Input7x
          type="text"
          onChange={(e) => {
            const newValue = e.target.value;
            setResorces((resorces) => {
              const updatedResources = [...resorces];
              if (!updatedResources[newId]) {
                updatedResources[newId] = {
                  id: newId,
                  url: "",
                  name: newValue,
                };
              } else {
                updatedResources[newId].name = newValue;
              }
              return updatedResources;
            });
          }}
        />
        <label>
          <FormattedMessage id="media" /> {resForms.length + 1} url:
        </label>
        <Input7x
          type="text"
          onChange={(e) => {
            const newValue = e.target.value;

            setResorces((resorces) => {
              const updatedResources = [...resorces];
              if (!updatedResources[newId]) {
                updatedResources[newId] = {
                  id: newId,
                  url: newValue,
                  name: "",
                };
              } else {
                updatedResources[newId].url = newValue;
              }
              return updatedResources;
            });
          }}
        />
      </div>
    </div>
  );
  setResForms([...resForms, newMediaForm]);
};
