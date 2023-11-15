import Input7x from "components/UI/Input7x/Input7x";
import classes from './MediaForm.module.scss';
import { IResorce } from "models/IResorce";


export const handleAddMediaForm = (
    resForms: React.JSX.Element[],
    setResForms: React.Dispatch<React.SetStateAction<React.JSX.Element[]>>,
    setResorces: React.Dispatch<React.SetStateAction<IResorce[]>>,
) => {
    const newId = resForms.length;
    const newMediaForm = <div className={classes.mediaForm} key={newId}>
      <div className={classes.mediaFormBox}>
      <label>Media {resForms.length + 1} url:</label>
        <Input7x type="text" onChange={(e) => {
        const newValue = e.target.value;

    setResorces((resorces) => {
      const updatedResources = [...resorces];
      if (!updatedResources[newId]) {
        updatedResources[newId] = {
          id: newId,
          url: newValue,
        }
        
      } else {
        updatedResources[newId].url = newValue;
      }
      return updatedResources
    })
  }}/>
      </div>
    </div>
    setResForms([...resForms, newMediaForm]);
  }