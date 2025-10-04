import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const EventItem = ({ event, onPress }) => {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Image
        source={{ uri: event.images?.[0]?.url }}
        style={styles.image}
      />
      <View style={styles.details}>
        <Text style={styles.name}>{event.name}</Text>
        <Text>{event.dates.start.localDate}</Text>
        <Text>{event._embedded?.venues?.[0]?.city?.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  details: {
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: 'bold',
  },
});

export default EventItem;