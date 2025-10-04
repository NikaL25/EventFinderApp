import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EventDetailsScreen = ({ route }) => {
  const { event } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    checkIfFavorite();
  }, []);

  const checkIfFavorite = async () => {
    const stored = await AsyncStorage.getItem('favorites');
    const favorites = stored ? JSON.parse(stored) : [];
    const exists = favorites.find(e => e.id === event.id);
    setIsFavorite(!!exists);
  };

  const saveToFavorites = async () => {
    const stored = await AsyncStorage.getItem('favorites');
    const favorites = stored ? JSON.parse(stored) : [];
    const exists = favorites.find(e => e.id === event.id);

    if (!exists) {
      favorites.push(event);
      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
      Alert.alert('✅ Added', 'Event added to favorites.');
    }
  };

  const removeFromFavorites = async () => {
    const stored = await AsyncStorage.getItem('favorites');
    const favorites = stored ? JSON.parse(stored) : [];
    const updated = favorites.filter(e => e.id !== event.id);
    await AsyncStorage.setItem('favorites', JSON.stringify(updated));
    setIsFavorite(false);
    Alert.alert('🗑 Removed', 'Event removed from favorites.');
  };

  const venue = event._embedded?.venues?.[0];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: event.images?.[0]?.url }}
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.title}>{event.name}</Text>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>📅 Date:</Text>
        <Text style={styles.value}>{event.dates?.start?.localDate || 'Unknown'}</Text>
      </View>

      {venue && (
        <>
          <View style={styles.infoBlock}>
            <Text style={styles.label}>📍 Venue:</Text>
            <Text style={styles.value}>{venue.name}</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>🌆 City:</Text>
            <Text style={styles.value}>{venue.city?.name}, {venue.country?.name}</Text>
          </View>
        </>
      )}

      <View style={styles.descriptionBlock}>
        <Text style={styles.label}>ℹ️ Info:</Text>
        <Text style={styles.description}>{event.info || 'No additional info available.'}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, isFavorite ? styles.removeButton : styles.addButton]}
        onPress={isFavorite ? removeFromFavorites : saveToFavorites}
      >
        <Text style={styles.buttonText}>
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  image: {
    height: 220,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 14,
    textAlign: 'center',
    color: '#333',
  },
  infoBlock: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
    marginRight: 8,
    color: '#444',
  },
  value: {
    color: '#555',
    flexShrink: 1,
  },
  descriptionBlock: {
    marginTop: 12,
    marginBottom: 20,
  },
  description: {
    color: '#666',
    lineHeight: 20,
    marginTop: 4,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#007bff',
  },
  removeButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default EventDetailsScreen;
