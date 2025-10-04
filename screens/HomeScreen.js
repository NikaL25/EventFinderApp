import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import EventItem from '../components/EventItem';
import { fetchEvents, fetchClassifications } from '../utils/api';
import { Picker } from '@react-native-picker/picker'; 
import debounce from 'lodash.debounce'; 

const HomeScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [segmentId, setSegmentId] = useState('');

  const [segments, setSegments] = useState([]);

  useEffect(() => {
    const loadSegments = async () => {
      try {
        const data = await fetchClassifications();
        const uniqueSegmentsMap = {};
        data.forEach((item) => {
          if (item.segment) {
            uniqueSegmentsMap[item.segment.id] = item.segment;
          }
        });
        setSegments(Object.values(uniqueSegmentsMap));
      } catch (e) {
        Alert.alert('Ошибка', 'Не удалось загрузить типы событий');
      }
    };
    loadSegments();
  }, []);

  const loadEvents = async (reset = false) => {
    if (loading || loadingMore) return;
    try {
      if (reset) {
        setLoading(true);
        setPage(0);
      } else {
        setLoadingMore(true);
      }

      const currentPage = reset ? 0 : page;
      const newEvents = await fetchEvents(
        { keyword, city, classificationName: segmentId },
        currentPage
      );

      if (reset) {
        setEvents(newEvents);
      } else {
        setEvents((prev) => [...prev, ...newEvents]);
      }

      setPage(currentPage + 1);
      setError(null);
    } catch (e) {
      setError('Ошибка загрузки событий');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const debouncedLoadEvents = useCallback(
    debounce(() => {
      loadEvents(true);
    }, 700),
    [keyword, city, segmentId]
  );

  useEffect(() => {
    debouncedLoadEvents();
    return debouncedLoadEvents.cancel;
  }, [keyword, city, segmentId, debouncedLoadEvents]);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return <ActivityIndicator style={{ marginVertical: 20 }} />;
  };

  const handleLoadMore = () => {
    if (!loading && !loadingMore && events.length > 0) {
      loadEvents(false);
    }
  };

  const handlePressEvent = (event) => {
    navigation.navigate('EventDetails', { event });
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterCard}>
        <TextInput
          placeholder="🔍 Keyword"
          style={styles.input}
          value={keyword}
          onChangeText={setKeyword}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="📍 City"
          style={styles.input}
          value={city}
          onChangeText={setCity}
          autoCorrect={false}
          autoCapitalize="words"
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={segmentId}
            onValueChange={(itemValue) => setSegmentId(itemValue)}
            mode="dropdown"
            style={Platform.OS === 'ios' ? styles.pickerIOS : styles.pickerAndroid}
          >
            <Picker.Item label="All Event Types" value="" />
            {segments.map((segment) => (
              <Picker.Item key={segment.id} label={segment.name} value={segment.id} />
            ))}
          </Picker>
        </View>

        <View style={styles.buttons}>
          <View style={styles.button}>
            <Button title="Search" onPress={() => loadEvents(true)} color="#007bff" />
          </View>
          <View style={styles.button}>
            <Button title="Favorites" onPress={() => navigation.navigate('Favorites')} color="#28a745" />
          </View>
        </View>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {loading && events.length === 0 ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventItem event={item} onPress={() => handlePressEvent(item)} />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#f9f9f9',
  },

  filterCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  input: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },

  pickerContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },

  pickerAndroid: {
    height: 50,
  },

  pickerIOS: {
    height: 150,
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  button: {
    flex: 1,
    marginHorizontal: 4,
  },

  errorText: {
    color: 'red',
    marginVertical: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
