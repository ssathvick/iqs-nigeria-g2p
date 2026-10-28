import React, { useState } from 'react';
import { Alert, Image, Linking, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

const services = {
  citizen: [
    { title: 'Household registration', detail: 'Register a household and follow your application.', url: 'https://nigeriag2p.com/registration/' },
    { title: 'Beneficiary portal', detail: 'Open the beneficiary self-service portal.', url: 'https://beneficiary.nigeriag2p.com/selfservice' },
  ],
  staff: [
    { title: 'Staff workspace', detail: 'Review registration work with your assigned staff account.', url: 'https://nigeriag2p.com/registration/login?mode=staff&workspace=1' },
    { title: 'Staff portal', detail: 'Open services available to your staff account.', url: 'https://staff-portal.nigeriag2p.com/' },
  ],
};

async function openService(url) {
  try { await Linking.openURL(url); }
  catch (_) { Alert.alert('Unable to open service', 'Check your connection and try again.'); }
}

export default function App() {
  const [role, setRole] = useState('citizen');
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.header}>
          <Image source={require('./assets/iqs-logo.png')} style={styles.logo} resizeMode="contain" accessibilityLabel="IQS" />
          <View><Text style={styles.brand}>NigeriaG2P</Text><Text style={styles.subbrand}>Mobile services</Text></View>
        </View>
        <View style={styles.notice}><Text style={styles.noticeText}>SANDBOX PREVIEW · Use fictional data. Payments and NIN verification are not live.</Text></View>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>SERVICES FOR YOU</Text>
          <Text style={styles.title}>Your next step, together.</Text>
          <Text style={styles.intro}>Choose a workspace to open the existing service securely in your browser.</Text>
        </View>
        <View style={styles.switcher} accessibilityRole="tablist">
          {[['citizen', 'Beneficiary'], ['staff', 'Staff']].map(([key, label]) => (
            <Pressable key={key} accessibilityRole="tab" accessibilityState={{ selected: role === key }} onPress={() => setRole(key)} style={[styles.tab, role === key && styles.tabActive]}>
              <Text style={[styles.tabText, role === key && styles.tabTextActive]}>{label}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.section}>Choose a service</Text>
        {services[role].map(service => (
          <Pressable key={service.title} accessibilityRole="link" accessibilityLabel={`${service.title}. ${service.detail} Opens in browser.`} onPress={() => openService(service.url)} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
            <View style={styles.cardContent}><Text style={styles.cardTitle}>{service.title}</Text><Text style={styles.cardText}>{service.detail}</Text><Text style={styles.action}>Open service  ↗</Text></View>
          </Pressable>
        ))}
        <Text style={styles.note}>Sign in using your existing account in the browser. A connection is required. This preview does not store beneficiary records or credentials.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f2f7f3' },
  page: { padding: 20, paddingBottom: 40, maxWidth: 720, width: '100%', alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8, marginBottom: 18 },
  logo: { width: 66, height: 45 }, brand: { color: '#183d33', fontWeight: '800', fontSize: 19 }, subbrand: { color: '#63796e', fontSize: 13 },
  notice: { backgroundColor: '#fff4cb', padding: 12, borderRadius: 10, marginBottom: 18 }, noticeText: { color: '#5b4c12', fontSize: 12, lineHeight: 18, fontWeight: '600' },
  hero: { backgroundColor: '#174b3e', borderRadius: 20, padding: 24 }, eyebrow: { color: '#cce8d8', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  title: { color: 'white', fontSize: 30, lineHeight: 36, fontWeight: '800', marginTop: 10 }, intro: { color: '#dbece3', fontSize: 16, lineHeight: 24, marginTop: 10 },
  switcher: { flexDirection: 'row', backgroundColor: '#dfece2', borderRadius: 12, padding: 4, marginTop: 20 }, tab: { flex: 1, alignItems: 'center', padding: 12, borderRadius: 9 }, tabActive: { backgroundColor: '#fff' }, tabText: { color: '#527164', fontWeight: '600' }, tabTextActive: { color: '#174b3e', fontWeight: '800' },
  section: { color: '#193c35', fontSize: 22, fontWeight: '800', marginTop: 26, marginBottom: 12 }, card: { backgroundColor: '#fff', borderColor: '#dce9df', borderWidth: 1, borderRadius: 14, marginBottom: 12 }, cardContent: { padding: 18 }, pressed: { opacity: 0.8 }, cardTitle: { color: '#193c35', fontWeight: '700', fontSize: 18 }, cardText: { color: '#5d7469', lineHeight: 21, marginTop: 6 }, action: { color: '#155d50', fontWeight: '700', marginTop: 14 }, note: { color: '#5d7469', fontSize: 13, lineHeight: 20, marginTop: 10 },
});
