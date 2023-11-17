import React, { useContext, useState } from 'react'
import { useSelectedComponent } from '../../contexts/SelectedComponentContext';
import MembersList from './MembersList';
import UsInfo from './UsInfo';
import OurResources from './OurResources';
import { UserContext } from '../../contexts/UserContext';


const MembersContainer = () => {
    const { userInfo } = useContext(UserContext);
    const { selectedComponent } = useSelectedComponent();
    const [membersCount, setMembersCount] = useState(0);

    const updateMembersCount = (memberCount) => {
        setMembersCount(memberCount);
    };

    return (
        <div className='news-main-layout'>
            {[2, 3, 4].includes(userInfo?.role.role_id) ? 

                <>
                    {(selectedComponent.menu === 0) ? 
                        <>
                            <h1>Nosotros / Información</h1>
                            <UsInfo />
                        </>
                    :null}
                    {(selectedComponent.menu === 1) ? 
                        <>
                            <h1>Nosotros / Miembros ({membersCount})</h1>
                            <MembersList updateCount={updateMembersCount} />
                        </>
                    :null}
                    {(selectedComponent.menu === 2) ? 
                        <>
                            <h1>Nosotros / Recursos e Implementos</h1>
                            <OurResources />
                        </>
                    :null}
                </>
            :
                <>
                    {(selectedComponent.menu === 0) ? 
                        <>
                            <h1>Nosotros / Información</h1>
                            <UsInfo />
                        </>
                    :null}
                </>
            
            }
        </div>
    )
}

export default MembersContainer