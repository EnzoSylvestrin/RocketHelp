import { NativeBaseProvider, StatusBar } from "native-base";

import { THEME } from './src/styles/theme';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

import { Loading } from './src/components/loading';
import { Routes } from './src/routes';

export default function App() {
  const [FontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {FontsLoaded ? <Routes /> : <Loading />}
    </NativeBaseProvider>
  );
}
