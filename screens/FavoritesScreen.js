import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventItem from '../components/EventItem';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);

  const loadFavorites = async () => {
    const stored = await AsyncStorage.getItem('favorites');
    setFavorites(stored ? JSON.parse(stored) : []);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadFavorites);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventItem
            event={item}
            onPress={() => navigation.navigate('EventDetails', { event: item })}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
});

export default FavoritesScreen;