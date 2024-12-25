import {ProfileFormComponent} from "@components/ProfileFormComponent.jsx";
import {ProfileView} from "@components/ProfileViewComponent.jsx";
import {useAuth} from "@contexts/AuthContext.jsx";

export function ProfileComponent(
    {data = {}}
) {
    const {showEditForm} = data;
    const {user} = useAuth();
    return showEditForm ? <ProfileFormComponent data={user}/> : <ProfileView data={user}/>
}