import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="processing" />
      <Stack.Screen name="result" />
      <Stack.Screen name="explainer" />
    </Stack>
  );
}
