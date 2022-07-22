import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Auth from '@react-native-firebase/auth';
import FireStore from '@react-native-firebase/firestore'

import { HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center } from 'native-base';

import { FontAwesome } from '@expo/vector-icons';
import Logo from '../assets/logo_secondary.svg';

import { Filter } from '../components/Filter';
import { Order, OrderProps } from '../components/Order';
import { Button } from '../components/Button';

import { Loading } from '../components/loading';

import { dateFormat } from '../utils/FireStoreDateFormat';

export function Home() {

    const [isLoading, setIsLoading] = useState(true);

    const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open')
    const [orders, setOrders] = useState<OrderProps[]>([]);

    const navigation = useNavigation();
    const { colors } = useTheme()

    function HandleNewOrder() {
        navigation.navigate('new');
    }

    function HandleOpenDetails(orderId: string) {
        navigation.navigate('details', { orderId });
    }

    function HandleLogout() {
        Auth()
            .signOut()
            .catch(error => {
                console.log(error);
                return Alert.alert('Sair', 'Não foi possivel sair.');
            });
    }

    useEffect(() => {
        setIsLoading(true);

        const subscriber = FireStore()
            .collection('orders')
            .where('status', '==', statusSelected)
            .onSnapshot(snapshot => {
                const data = snapshot.docs.map(doc => {
                    const { patrimony, description, status, created_at } = doc.data();

                    return {
                        id: doc.id,
                        patrimony,
                        description,
                        status,
                        when: dateFormat(created_at)
                    }
                })
                setOrders(data);
                setIsLoading(false);
            });

        return subscriber;

    }, [statusSelected])

    return (
        <VStack flex={1} bg="gray.700" pb={6}>
            <HStack
                w="full"
                justifyContent="space-between"
                alignItems="center"
                bg="gray.500"
                pt={12}
                pb={5}
                px={6}
            >
                <Logo />
                <IconButton
                    icon={<FontAwesome name="sign-out" size={24} color={colors.gray[300]} />}
                    onPress={HandleLogout}
                />

            </HStack>

            <VStack flex={1} px={6}>
                <HStack w="full" mt={8} mb={4} justifyContent="space-between" alignItems="center">
                    <Heading color="gray.100" fontSize={22}>
                        Solicitações
                    </Heading>
                    <Text color="gray.200">
                        {orders.length}
                    </Text>
                </HStack>

                <HStack space={3} mb={8}>
                    <Filter
                        title="em andamento"
                        type="open"
                        onPress={() => setStatusSelected('open')}
                        isActive={statusSelected === 'open'}
                    />

                    <Filter
                        title="finalizados"
                        type="closed"
                        onPress={() => setStatusSelected('closed')}
                        isActive={statusSelected === 'closed'}
                    />
                </HStack>


                {
                    isLoading ? <Loading /> :
                        <FlatList
                            data={orders}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => <Order data={item} onPress={() => HandleOpenDetails(item.id)} />}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 50 }}
                            ListEmptyComponent={() => (
                                <Center>
                                    <FontAwesome name="commenting-o" color={colors.gray[300]} size={40} />
                                    <Text color={colors.gray[300]} textAlign="center" fontSize="xl" mt={6}>
                                        Você ainda não pussui {'\n'}
                                        solicitações {statusSelected === "open" ? "em andamento" : "finalizadas"}
                                    </Text>
                                </Center>
                            )}
                        />}

                <Button title="Nova solicitação" onPress={HandleNewOrder} />
            </VStack>
        </VStack>
    );
}