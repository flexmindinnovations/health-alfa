import {ProfileFormComponent} from "@components/ProfileFormComponent.jsx";
import {ProfileView} from "@components/ProfileViewComponent.jsx";
import {useAuth} from "@contexts/AuthContext.jsx";
import {useEffect, useState} from "react";
import {Loader} from "@mantine/core";

export function ProfileComponent(
    {data = {}}
) {
    const [loading, setLoading] = useState(true);
    const {showEditForm} = data;
    const {user} = useAuth();
    useEffect(() => {
        if (user) {
            setLoading(false);
        }
    }, [user]);
    if (loading) return (
        <div className={`w-full h-full flex items-center justify-center`}>
            <Loader/>
        </div>
    )
    return showEditForm ? <ProfileFormComponent data={user}/> : <ProfileView data={user}/>
}