import ContextMenu from "../components/ContextMenu";
import News from "../components/News";
import PollsContainer from "../components/PollsContainer";
import ProjectsContainer from "../components/ProjectsContainer";
import CalendarContainer from "../components/CalendarContainer";
import { useSelectedComponent } from '../contexts/SelectedComponentContext';
import ActivitiesContainer from "../components/ActivitiesContainer";
import SolicitudContainer from "../components/SolicitudContainer";

const NeighborHome = () => {
    const { selectedComponent } = useSelectedComponent();

    const contextualMenuOptions = {
        "Anuncios": [
            'Ver anuncios'
        ],
        "Proyectos": [
            'Ver proyectos',
            'Crar propuesta'
        ],
        "Encuestas": [
            'Activas',
            'Finalizadas',
            'Respondidas'
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

    switch (selectedComponent) {
        case 0:
            contentComponent = <News />;
            contextualMenuOptionsForComponent = contextualMenuOptions["Anuncios"];
            break;
        case 1:
            contentComponent = <ProjectsContainer />;
            contextualMenuOptionsForComponent = contextualMenuOptions["Proyectos"];
            break;
        case 2:
            contentComponent = <PollsContainer />;
            contextualMenuOptionsForComponent = contextualMenuOptions["Encuestas"];
            break;
        case 3:
            contentComponent = <CalendarContainer />;
            contextualMenuOptionsForComponent = contextualMenuOptions["Calendario"];
            break;
        case 4:
            contentComponent = <ActivitiesContainer />;
            contextualMenuOptionsForComponent = contextualMenuOptions["Actividades"];
            break;
        case 5:
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