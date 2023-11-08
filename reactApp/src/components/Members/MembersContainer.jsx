import React, { useState } from 'react'
import { useSelectedComponent } from '../../contexts/SelectedComponentContext';
import MembersList from './MembersList';
import UsInfo from './UsInfo';


const MembersContainer = () => {
    const { selectedComponent } = useSelectedComponent();
    const [membersCount, setMembersCount] = useState(0);

    const updateMembersCount = (memberCount) => {
        setMembersCount(memberCount);
    };

    return (
        <div className='news-main-layout'>

            {(selectedComponent.menu === 0) ? 
                <>
                    <h1>Nosotros / Información</h1>
                    <UsInfo />
                </>
                :
                <>
                    <h1>Nosotros / Miembros ({membersCount})</h1>
                    <MembersList updateCount={updateMembersCount} />
                </>
            }
                

        </div>
    )
}

export default MembersContainer