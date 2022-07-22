import { HStack, StyledProps, Heading, useTheme, IconButton } from 'native-base';

import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

type Props = StyledProps & {
    title: string
}

export function Header({ title, ...rest }: Props) {

    const navigation = useNavigation();

    const { colors } = useTheme();

    function HandleGoBack() {
        navigation.goBack();
    }

    return (
        <HStack
            w="full"
            justifyContent="space-between"
            alignItems="center"
            bg="gray.600"
            pb={6}
            pt={12}
            {...rest}
        >

            <IconButton
                icon={<FontAwesome name="caret-left" color={colors.gray[300]} size={28} />}
                onPress={HandleGoBack}
            />

            <Heading color={colors.gray[100]} fontSize="lg" ml={-6} flex={1} textAlign="center">
                {title}
            </Heading>

        </HStack>
    );
}