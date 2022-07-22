import { VStack } from 'native-base';

import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useState } from 'react';
import { Alert } from 'react-native';

import FireStore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export function Register() {

    const navigation = useNavigation();

    const [isLoading, setIsLoading] = useState(false);
    const [patrimony, setPatrimony] = useState('');
    const [description, setDescription] = useState('');

    function HandleNewOrderRegister() {
        if (!patrimony || !description) {
            return Alert.alert('Registrar', 'Preencha todos os campos!');
        }

        setIsLoading(true);

        FireStore()
            .collection('orders')
            .add({
                patrimony,
                description,
                status: 'open',
                created_at: FireStore.FieldValue.serverTimestamp()
            })
            .then(() => {
                Alert.alert('Solicitação', 'Solicitação registrada com sucesso.');
                navigation.goBack();
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
                return Alert.alert('Solicitação', 'Não foi possivel registrar o pedido')
            });
    }

    return (
        <VStack flex={1} p={6} bg="gray.600">
            <Header title="nova solicitação" />

            <Input
                placeholder="Número do patrimonio.."
                mt={4}
                onChangeText={setPatrimony}
            />

            <Input
                placeholder="Descrição do problema.."
                flex={1}
                mt={5}
                multiline
                textAlignVertical='top'
                onChangeText={setDescription}
            />

            <Button
                title="Enviar"
                mt={5}
                isLoading={isLoading}
                onPress={HandleNewOrderRegister}
            />
        </VStack>
    );
}