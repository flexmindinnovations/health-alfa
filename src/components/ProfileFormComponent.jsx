import {Container} from "@mantine/core";
import {useEncrypt} from "@hooks/EncryptData.jsx";
import {useEffect, useState} from "react";
import {AddEditDoctor} from "@modals/AddEditDoctor.jsx";
import {AddEditClient} from "@modals/AddEditClient.jsx";

const userTypes = {
    'CLIENT': 'client',
    'DOCTOR': 'doctor',
    'ADMIN': 'admin',
}

export function ProfileFormComponent(props) {
    const {data} = props;
    const {getEncryptedData} = useEncrypt();
    const [userType, setUserType] = useState(userTypes.ADMIN);
    useEffect(() => {
        const user = getEncryptedData('roles')?.toLowerCase();
        setUserType(user);
    }, [data, userType]);

    const getFormComponent = () => {
        let formComponent;
        switch (userType) {
            case userTypes.CLIENT:
                formComponent = <AddEditClient/>;
                break;
            case userTypes.DOCTOR:
                formComponent = <AddEditDoctor data={data} showCancel={false}/>
                break;
        }
        return formComponent;
    }

    return (
        <Container>
            {getFormComponent()}
        </Container>
    )
}