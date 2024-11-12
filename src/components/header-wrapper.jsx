import {Header} from "./header";

export function HeaderWrapper({onSidebarStateChange, isExpanded}) {

    return <Header onSidebarStateChange={(state) =>onSidebarStateChange(state)} isExpanded={isExpanded}/>
}