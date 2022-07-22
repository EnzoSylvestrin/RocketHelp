import { Box, Circle, HStack, Text, useTheme, VStack, Pressable, IPressableProps } from 'native-base';

import { FontAwesome } from '@expo/vector-icons';

export type OrderProps = {
    id: string;
    patrimony: string;
    when: string;
    status: 'open' | 'closed';
}

type Props = IPressableProps & {
    data: OrderProps;
}

export function Order({ data, ...rest }: Props) {

    const { colors } = useTheme()


    const statusColor = data.status === 'open' ? colors.secondary[700] : colors.green[300];

    return (
        <Pressable {...rest}>
            <HStack
                bg="gray.600"
                mb={4}
                alignItems="center"
                justifyContent="space-between"
                rounded="sm"
                overflow="hidden"
            >
                <Box h="full" w={2} bg={statusColor} />

                <VStack flex={1} my={5} ml={5}>
                    <Text color="white" fontSize="md">
                        Patrimonio: {data.patrimony}
                    </Text>

                    <HStack alignItems="center">
                        <FontAwesome name="clock-o" size={15} color={colors.gray[300]} />
                        <Text color={colors.gray[200]} fontSize="xs" ml={1}>
                            {data.when}
                        </Text>
                    </HStack>
                </VStack>

                <Circle bg="gray.500" h={12} w={12} mr={5}>
                    {
                        data.status === "closed"
                            ? <FontAwesome name="check-circle" size={24} color={statusColor} />
                            : <FontAwesome name="hourglass-o" size={24} color={statusColor} />
                    }
                </Circle>

            </HStack>
        </Pressable>
    );
}