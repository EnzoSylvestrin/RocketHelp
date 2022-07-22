import { Heading, VStack, Icon, useTheme } from "native-base";
import { Alert } from 'react-native';
import Auth from '@react-native-firebase/auth';
import { useState } from 'react';
import { FontAwesome } from "@expo/vector-icons"

import Logo from '../assets/logo_primary.svg'

import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function SignIn() {

    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { colors } = useTheme();

    function HandleSignIn() {
        if (!email || !password) {
            return Alert.alert('Entrar', 'Informe o email e senha!');
        }

        setIsLoading(true);

        Auth()
            .signInWithEmailAndPassword(email, password)
            .catch((error) => {
                console.log(error);
                setIsLoading(false);

                if (error.code === 'auth/invalid-email') {
                    return Alert.alert('Entrar', 'E-mail inválida.');
                }

                if (error.code === 'auth/invalid-password') {
                    return Alert.alert('Entrar', 'E-mail ou senha inválida.');
                }

                if (error.code === 'auth/user-not-found') {
                    return Alert.alert('Entrar', 'E-mail ou senha inválida.');
                }

                return Alert.alert('Entrar', 'Não foi possivel acessar!');
            });
    }

    return (
        <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
            <Logo />

            <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
                Acesse sua conta!
            </Heading>

            <Input
                mb={4}
                placeholder='E-mail'
                InputLeftElement={<Icon as={<FontAwesome name="envelope" color={colors.gray[300]} />} ml={4} />}
                onChangeText={setEmail}
            />
            <Input
                mb={8}
                placeholder='Senha'
                InputLeftElement={<Icon as={<FontAwesome name="key" color={colors.gray[300]} />} ml={4} />}
                secureTextEntry
                onChangeText={setPassword}
            />

            <Button
                title="Entrar"
                w="full"
                onPress={HandleSignIn}
                isLoading={isLoading}
            />
        </VStack>
    );
}