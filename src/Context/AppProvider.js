import { createContext, useContext, useMemo, useState } from 'react';
import { AuthContext } from './AuthProvider';
import useFirestore from '../hooks/useFirestore';

export const AppContext = createContext();

function AppProvider({ children }) {
    const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
    const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState('');

    const {
        user: { uid },
    } = useContext(AuthContext);
    /*
    {
        name: 'room name',
        description: 'desc',
        member: [uid1, uid2,...]
    }
    */
    const roomsCondition = useMemo(() => {
        return {
            fieldName: 'members',
            operator: 'array-contains',
            compareValue: uid,
        };
    }, [uid]);
    const rooms = useFirestore('rooms', roomsCondition);
    console.log(rooms)
    const selectRoom = useMemo(() => rooms.find((room) => room.id === selectedRoomId) || {}, [rooms, selectedRoomId]);
    const usersCondition = useMemo(() => {
        return {
            fieldName: 'uid',
            operator: 'in',
            compareValue: selectRoom.members,
        };
    }, [selectRoom.members]);
    const members = useFirestore('users', usersCondition);

    return (
        <AppContext.Provider
            value={{
                rooms,
                isAddRoomVisible,
                setIsAddRoomVisible,
                selectedRoomId,
                setSelectedRoomId,
                selectRoom,
                members,
                isInviteMemberVisible,
                setIsInviteMemberVisible
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export default AppProvider;
