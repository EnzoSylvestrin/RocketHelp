import { useEffect, useState } from 'react';
import { HStack, VStack, useTheme, Text, ScrollView, Box } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';

import { FontAwesome } from '@expo/vector-icons';
import { DesktopTower, Clipboard, CircleWavyCheck } from 'phosphor-react-native';

import { Header } from '../components/Header';
import { OrderProps } from '../components/Order';
import { Loading } from '../components/loading';
import { CardDetails } from '../components/CardDetails';

import { dateFormat } from '../utils/FireStoreDateFormat';

import FireStore from '@react-native-firebase/firestore';
import { OrderFireStoreDTO } from '../DTOs/OrderDto';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Alert } from 'react-native';


type RouteParams = {
    orderId: string;
}

type OrderDetails = OrderProps & {
    description: string;
    solution: string;
    closed: string;
}

export function Details() {

    const navigation = useNavigation();

    const [isLoading, setIsLoading] = useState(true);
    const [solution, setSolution] = useState('');
    const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);

    const route = useRoute();
    const { orderId } = route.params as RouteParams;

    const { colors } = useTheme();

    function HandleOrderClose() {
        if (!solution) {
            return Alert.alert('Solicitação', 'Informe a solução para encerrar a solicitação')
        }

        FireStore()
            .collection<OrderFireStoreDTO>('orders')
            .doc(orderId)
            .update({
                status: 'closed',
                solution,
                closed_at: FireStore.FieldValue.serverTimestamp()
            })
            .then(response => {
                Alert.alert('Solicitação', 'Solicitação encerrada')
                navigation.goBack();
            })
            .catch(err => {
                console.log(err);
                Alert.alert('Solicitação', 'Não foi possivel encerrar a solicitação')
            });
    }

    useEffect(() => {
        const describer = FireStore()
            .collection<OrderFireStoreDTO>('orders')
            .doc(orderId)
            .get()
            .then(doc => {
                const { patrimony, description, status, closed_at, solution, created_at } = doc.data();

                const closed = closed_at ? dateFormat(closed_at) : null;

                setOrder({
                    id: doc.id,
                    patrimony,
                    description,
                    status,
                    solution,
                    when: dateFormat(created_at),
                    closed
                });

                setIsLoading(false);

            });
    }, [])

    if (isLoading) {
        return (<Loading />)
    }

    return (
        <VStack flex={1} bg="gray.700">
            <Box px={6} bg="gray.600">
                <Header title="Solicitação" />
            </Box>

            <HStack bg="gray.500" justifyContent="center" p={4}>
                {
                    order.status === 'closed'
                        ? <FontAwesome name="check-circle" size={22} color={colors.green[300]} />
                        : <FontAwesome name="hourglass-o" size={22} color={colors.secondary[700]} />
                }

                <Text
                    fontSize="sm"
                    color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
                    ml={2}
                    textTransform="uppercase"
                >
                    {order.status === 'closed' ? 'finalizado' : 'em andamento'}
                </Text>
            </HStack>

            <ScrollView mx={5} showsVerticalScrollIndicator={false}>
                <CardDetails
                    title='Equipamento'
                    description={`Patrimônio ${order.patrimony}`}
                    icon={DesktopTower}
                    footer={order.when}
                />

                <CardDetails
                    title='Descrição do problema'
                    description={order.description}
                    icon={Clipboard}
                />

                <CardDetails
                    title='solução'
                    icon={CircleWavyCheck}
                    description={order.solution}
                    footer={order.closed && `Encerrado em ${order.closed}`}
                >
                    {
                        order.status === 'open' &&
                        <Input
                            placeholder="Descrição da solução"
                            onChangeText={setSolution}
                            textAlignVertical="top"
                            multiline
                            h={24}
                        />
                    }

                </CardDetails>
            </ScrollView>

            {
                order.status === "open" &&
                <Button
                    title="Encerrar solicitação"
                    m={5}
                    onPress={HandleOrderClose}
                />
            }

        </VStack>
    );
}