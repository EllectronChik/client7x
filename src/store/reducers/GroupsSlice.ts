import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IClan } from "models/IClan";
import { IGroup } from "models/IGroup";
import { RootState } from "store/store";


interface IGroupSlice {
    groups: IGroup[],
    undistributedTeams: IClan[],
}

const initialState: IGroupSlice = {
    groups: [],
    undistributedTeams: [],
}


const groupsSlice = createSlice({
    name: 'groupsManager',
    initialState,
    reducers: {
        setGroups: (state, action) => {
            state.groups = action.payload;
        },
        setUndistributedTeams: (state, action) => {
            state.undistributedTeams = action.payload;
        },
        updateGroupTeams: (state, action: PayloadAction<{ groupId: number; team: IClan }>,) => {
            const { groupId, team } = action.payload;
            let isTeamInPastGroup = false;
            let isTeamInCurrentGroup = false;
            state.groups = state.groups.map((group) => {
                const teamKey = team.id;
                    if (group.id === groupId) {                        
                        group.teams.map((team) => {
                            if (team.id === teamKey) {
                                isTeamInPastGroup = true;
                            } 
                        })
                        if (!isTeamInPastGroup) {
                            return {
                                ...group,
                                teams: [...group.teams, team]
                            }
                        } else {
                            return group;
                        }
                    } else {                     
                        group.teams.map((team) => {
                            if (team.id === teamKey) {
                                isTeamInCurrentGroup = true;
                            }
                        })
                        if (!isTeamInCurrentGroup) {
                            return group;
                        } else {
                            return {
                                ...group,
                                teams: group.teams.filter((team) => team.id !== teamKey)
                            }
                        }
                    }

                }
            )
        },
        addGroup: (state) => {
            let newGroupMark;
            if (state.groups.length > 0) {
                newGroupMark = String.fromCharCode(state.groups[state.groups.length - 1].groupMark.charCodeAt(0) + 1);
            } else {
                newGroupMark = 'A';
            }
            state.groups = [...state.groups, {
                id: state.groups.length,
                groupMark: newGroupMark,
                teams: []
            }]
        }
    }
})

export const selectGroups = (state: RootState) => state.groupsManager.groups;
export const selectUndistributedTeams = (state: RootState) => state.groupsManager.undistributedTeams;

export const { setGroups, setUndistributedTeams, updateGroupTeams, addGroup } = groupsSlice.actions;
export default groupsSlice.reducer