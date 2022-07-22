import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import { SignIn } from '../pages/SignIn';
import { AppRoutes } from './app.routes'
import { Loading } from '../components/loading';


export function Routes() {

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<FirebaseAuthTypes.User>();

    useEffect(() => {
        const subscriber = Auth()
            .onAuthStateChanged(response => {
                setUser(response);
                setLoading(false);
            });

        return subscriber;
    }, []);

    if (loading) {
        return <Loading />
    }

    return (
        <NavigationContainer>
            {user ? <AppRoutes /> : <SignIn />}
        </NavigationContainer>
    );
}