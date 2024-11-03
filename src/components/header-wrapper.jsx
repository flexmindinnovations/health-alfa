import {Header} from "./header";

export function HeaderWrapper({onSidebarStateChange}) {

    return <Header onSidebarStateChange={(state) =>onSidebarStateChange(state)}/>
}