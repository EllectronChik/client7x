import { IMapsResponse } from "models/IMapsResponse";
import { FC, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { MapsApi } from "services/MapsService";
import classes from "./MapsDistribution.module.scss";
import { IMap } from "models/IMap";
import { SeasonApi } from "services/SeasonService";
import Button7x from "components/UI/Button7x/Button7x";
import { FormattedMessage, useIntl } from "react-intl";

interface IEditingMapValues {
  [key: number]: {
    name: string;
  };
}

/**
 * MapsDistribution component
 * 
 * This component handles the distribution of maps for the current season.
 * It allows users to add, edit, and filter maps, as well as manage the maps for the current season.
 */
const MapsDistribution: FC = () => {
  const [cookies] = useCookies(["token"]);
  const { data: maps } = MapsApi.useFetchMapsQuery(cookies.token);
  const [postMap, {}] = MapsApi.usePostMapMutation();
  const [addMapToSeason, {}] = MapsApi.useAddMapToSeasonMutation();
  const [editMapName, {}] = MapsApi.useChangeMapNameMutation();
  const [mapsData, setMapsData] = useState<IMapsResponse>({} as IMapsResponse);
  const [mapsDataFilter, setMapsDataFilter] = useState<IMapsResponse>(
    {} as IMapsResponse
  );
  const { data: currentSeason } = SeasonApi.useFetchCurrentSeasonQuery();
  const [isMapEditing, setIsMapEditing] = useState<number[]>([]);
  const [editingMapValues, setEditingMapValues] = useState<IEditingMapValues>(
    {}
  );
  const [sliceCnt, setSliceCnt] = useState<number>(5);
  const intl = useIntl();

  useEffect(() => {
    if (maps) {
      setMapsData(maps);
    }
  }, [maps]);

  useEffect(() => {
    setMapsDataFilter(mapsData);
  }, [mapsData]);

  const handlePreviousMapClick = (map: IMap) => {
    setMapsData((prev) => ({
      ...prev,
      otherSeasonMaps: prev.otherSeasonMaps.filter(
        (otherMap) => map.id !== otherMap.id
      ),
      currentSeasonMaps: [
        ...prev.currentSeasonMaps,
        { id: map.id, name: map.name },
      ],
    }));
    addMapToSeason({
      token: cookies.token,
      seasonsNumber: currentSeason?.number || 0,
      id: map.id,
    });
  };

  const handleAddMap = () => {
    const postMapData = postMap({
      token: cookies.token,
      map: "",
      seasonsNumbers: `${currentSeason?.number || 0}`,
    });
    postMapData.unwrap().then((data) => {
      setMapsData((prev) => ({
        ...prev,
        currentSeasonMaps: [
          ...prev.currentSeasonMaps,
          { id: data.id, name: data.name },
        ],
      }));
      setIsMapEditing([...isMapEditing, data.id]);
    });
  };

  const handleEditMapName = (map: IMap, name: string) => {
    if (!(map.name === name)) {
      editMapName({
        token: cookies.token,
        name: name,
        id: map.id,
      });
      setMapsData((prev) => ({
        ...prev,
        currentSeasonMaps: prev.currentSeasonMaps.map((currentMap) => {
          if (currentMap.id === map.id) {
            return { ...currentMap, name: name };
          }
          return currentMap;
        }),
      }));
    }
    setIsMapEditing(isMapEditing.filter((id) => id !== map.id));
  };

  return (
    <div className={classes.maps}>
      <div className={classes.mapBox}>
        <h3><FormattedMessage id="prevSeasonsMaps" /></h3>
        <h4 className={classes.header}><FormattedMessage id="clickToAddMap" values={{ br: <br /> }} /></h4>
        <input
          placeholder={intl.formatMessage({ id: "mapNameFilter" })}
          type="text"
          className={classes.input}
          onChange={(e) => {
            setMapsDataFilter({
              ...mapsData,
              otherSeasonMaps: mapsData?.otherSeasonMaps?.filter((map) =>
                map.name.toLowerCase().includes(e.target.value.toLowerCase())
              ),
            });
          }}
        />
        {mapsDataFilter?.otherSeasonMaps?.slice(0, sliceCnt).map((map) => (
          <h3
            className={classes.map}
            key={map.id}
            onClick={() => handlePreviousMapClick(map)}
          >
            {map.name} &#9658;
          </h3>
        ))}
        {sliceCnt < mapsData?.otherSeasonMaps?.length && (
          <h3
            className={classes.map}
            onClick={() => setSliceCnt(mapsData?.otherSeasonMaps?.length)}
          >
            <FormattedMessage id="showMore" />
          </h3>
        )}
      </div>
      <div className={classes.mapBox}>
        <h3><FormattedMessage id="currentSeasonMaps" /></h3>
        <h4 className={classes.header}><FormattedMessage id="editMapName" values={{ br: <br /> }} /></h4>
        {mapsDataFilter?.currentSeasonMaps?.map((map) => (
          <div className={classes.mapContainer} key={map.id}>
            {!isMapEditing.includes(map.id) ? (
              <h3
                className={classes.map}
                onClick={() => {
                  setIsMapEditing([...isMapEditing, map.id]);
                  setEditingMapValues({
                    ...editingMapValues,
                    [map.id]: { name: map.name },
                  });
                }}
              >
                {map.name}
              </h3>
            ) : (
              <div className={classes.editingMap}>
                <button
                  className={classes.button}
                  onClick={() =>
                    handleEditMapName(map, editingMapValues[map.id].name)
                  }
                >
                  &#10004;
                </button>
                <input
                  type="text"
                  defaultValue={map.name}
                  className={classes.input}
                  onInput={(e) =>
                    setEditingMapValues({
                      ...editingMapValues,
                      [map.id]: { name: (e.target as HTMLInputElement).value },
                    })
                  }
                />
              </div>
            )}
          </div>
        ))}
        <Button7x className={classes.button} onClick={() => handleAddMap()}>
          <FormattedMessage id="addMapLabel" />
        </Button7x>
      </div>
    </div>
  );
};

export default MapsDistribution;
