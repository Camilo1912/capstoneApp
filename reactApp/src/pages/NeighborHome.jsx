import ContextMenu from "../components/ContextMenu";
import News from "../components/News/News";
import PollsContainer from "../components/Polls/PollsContainer";
import ProjectsContainer from "../components/ProjectsComp/ProjectsContainer";
import CalendarContainer from "../components/CalendarContainer";
import { useSelectedComponent } from '../contexts/SelectedComponentContext';
import ActivitiesContainer from "../components/Activities/ActivitiesContainer";
import SolicitudContainer from "../components/SolicitudContainer";

const NeighborHome = () => {
    const { selectedComponent } = useSelectedComponent();

    const contextualMenuOptions = {
        "Anuncios": [
            'Ver anuncios'
        ],
        "Proyectos": [
            'Ver proyectos',
            'Crear propuesta',
            'Votaciones'
        ],
        "Calendario": [
            'Todo'
        ],
        "Actividades": [
            'Proximas actividades',
            'Activiades pasadas'
        ],
        "Solicitudes": [
            'Mis solicitudes',
            'Nueva solicitud',
        ]
    };

    let contentComponent;
    let contextualMenuOptionsForComponent;

    switch (selectedComponent['nav']) {
        case 0:
            contentComponent = <News />;
            contextualMenuOptionsForComponent = contextualMenuOptions["Anuncios"];
            break;
        case 1:
            contentComponent = <ProjectsContainer />;
            contextualMenuOptionsForComponent = contextualMenuOptions["Proyectos"];
            break;
        case 2:
            contentComponent = <CalendarContainer />;
            contextualMenuOptionsForComponent = contextualMenuOptions["Calendario"];
            break;
        case 3:
            contentComponent = <ActivitiesContainer />;
            contextualMenuOptionsForComponent = contextualMenuOptions["Actividades"];
            break;
        case 4:
            contentComponent = <SolicitudContainer />;
            contextualMenuOptionsForComponent = contextualMenuOptions["Solicitudes"];
            break;
        default:
            contextualMenuOptionsForComponent = contextualMenuOptions["Anuncios"];
            contentComponent = <News />;
            break;
    }


    return (
        <div className="content-layout">
            <div className="sidebar">
                <ContextMenu data={contextualMenuOptionsForComponent} />
            </div>
            <div className="main-content">
                {contentComponent}
            </div>
        </div>
    );
};

export default NeighborHome;