import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Agenda } from 'react-native-calendars';
import moment from 'moment';
import axios from 'axios';
import FitImage from 'react-native-fit-image';

const WEEKS_IN_YEAR = 52;

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: {},
      loading: true
    };
  }
  componentWillMount() {

    fetch('http://apnaextension.com/eventcalender/wp-json/tribe/events/v1/events')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          dataevents: responseJson,
          loading: false
        });
      }).catch((error) => {
        console.error(error);
      });


  }

  rowHasChanged = (r1, r2) => {
    return r1.name !== r2.name;
  };

  timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  };

  loadItems = (day) => {
    let items = {};

    for (let i = -15; i < 85; i++) {
      const time = day.timestamp + i * 24 * 60 * 60 * 1000;
      const strTime = this.timeToString(time);

      if (!items[strTime]) {
        items[strTime] = [];
      }
    }
    this.setState({
      items: {
        ...items,
        ...this.generateDateItems()
      }
    });
  }
  parseData = (data) => {
    let correctData;
    let firstData = data.split(' ');
    correctData = firstData[0];
    return correctData;
  }
  getDateWithMonth = (date, dateDetails) => {
    var dateToday = new Date(date);
    var locale = "en-us";
    var month = dateToday.toLocaleString(locale, { month: "long" });
    mainDate = `${month} ${dateDetails.day}, ${dateDetails.year}`;
    return mainDate;
  }

  renderItem = (item) => {
    let plase = item.venue.address || 'No place',
      dateBooking = item.date,
      start = this.getDateWithMonth(this.parseData(item.start_date), item.start_date_details),
      end = this.getDateWithMonth(this.parseData(item.end_date), item.end_date_details),
      timeStart = `${item.start_date_details.hour}:${item.start_date_details.minutes}`,
      timeEnd = `${item.end_date_details.hour}:${item.end_date_details.minutes}`;


    return (
      <View style={styles.item}>
        <View style={styles.image}>
          <FitImage
            source={{ uri: `${item.image.url}` }}
            originalWidth={item.image.width}
            originalHeight={item.image.height}

          />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.row}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
              {`Place`}
            </Text>
            <Text style={{ fontSize: 16 }}>
              {`${plase}`}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
              {`Date Booking`}
            </Text>
            <Text style={{ fontSize: 16 }}>
              {`${dateBooking}`}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
              {`Start`}
            </Text>
            <Text style={{ fontSize: 16 }}>
              {`${start}`}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
              {`End`}
            </Text>
            <Text style={{ fontSize: 16 }}>
              {`${end}`}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
              {`Time Start`}
            </Text>
            <Text style={{ fontSize: 16 }}>
              {`${timeStart}`}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
              {`TimeEnd`}
            </Text>
            <Text style={{ fontSize: 16 }}>
              {`${timeEnd}`}
            </Text>
          </View>
        </View>

      </View>
    );
  };

  generateDateItems = () => {
    let items = {};

    this.state.dataevents.events.forEach((event) => {
      let events = [event];

      events.forEach((eventItem) => {
        let correctDate = this.parseData(eventItem.start_date);

        if (!items[correctDate]) {
          items[correctDate] = [{
            ...eventItem
          }];
        } else {
          items[correctDate].push({
            ...eventItem
          });
          items[correctDate].sort((event1, event2) => {
            return moment(`${event1.dateString} ${event1.time}`).valueOf() - moment(`${event2.dateString} ${event2.time}`).valueOf();
          });
        }
      });
    });
    return items;
  };


  renderEmptyDate = () => {
    return (
      <View />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {!this.state.loading ?

          <Agenda
            items={this.state.items}
            loadItemsForMonth={this.loadItems}
            renderItem={this.renderItem}
            renderEmptyDate={this.renderEmptyDate}
            rowHasChanged={this.rowHasChanged}
            theme={{
              dotColor: '#1EE188',
              selectedDayBackgroundColor: '#1EE188',
              agendaDayTextColor: '#333',
              agendaDayNumColor: '#333',
              agendaTodayColor: '#1EE188',
              agendaKnobColor: '#1EE188',
              todayTextColor: '#1EE188',
              backgroundColor: '#ddd',
            }}
          />
          :
          <ActivityIndicator style={styles.indicator} size="large" color="#1EE188" />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    marginTop: Platform.OS === 'ios' ? 22 : 0,
  },
  indicator: {
    flex: 1
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    padding: 15,
    marginRight: 10,
    marginTop: 17,
    borderRadius: 5,
    alignItems: 'stretch'
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  },
  image: {
    flex: 1,
    borderRadius: 5,
    overflow: 'hidden'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
});

