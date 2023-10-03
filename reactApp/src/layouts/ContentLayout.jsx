import ContextMenu from "../components/ContextMenu";
import News from "../components/News";

const ContentLayout = () => {
    return (

        // <>
        //     <div className="sidebar">
        //         <ContextMenu />
        //     </div>
        //     <div className="body">
        //         <News />
        //     </div>
        // </>
        <div className="content-layout">
            <div className="sidebar">
                <ContextMenu />
            </div>
            <div className="main-content">
                <News />
            </div>
        </div>
    );
};

export default ContentLayout;