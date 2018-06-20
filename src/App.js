import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} from 'react-native';
import { Agenda } from 'react-native-calendars';
import moment from 'moment';
import axios from 'axios';

const WEEKS_IN_YEAR = 52;

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: {},
      data: [
        {
          id: 1,
          dateString: '2018-06-19',
          text: 'lorem'
        },
        {
          id: 2,
          dateString: '2018-06-21',
          text: 'lorem'
        },
        {
          id: 3,
          dateString: '2018-06-23',
          text: 'lorem'
        },
      ]
    };
  }
  componentWillMount() {
    axios(`http://apnaextension.com/eventcalender/wp-json/tribe/events/v1/events`)
      .then((response) => {
        console.log(response.JSON());
      })
      .catch((error) => {

        console.log(error);
      });

    fetch('http://apnaextension.com/eventcalender/wp-json/tribe/events/v1/events')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
      })
      .catch((error) => {
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

  renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text>{item.text}</Text>
        <Text>{item.text}</Text>
        <Text>{item.text}</Text>
        <Text>{item.text}</Text>
        <Text>{item.text}</Text>
        <Text>{item.text}</Text>
        <Text>{item.text}</Text>
      </View>
    );
  };

  generateDateItems = () => {
    let items = {};

    this.state.data.forEach((trip) => {
      let trips = [trip];

      trips.forEach((tripItem) => {
        if (!items[tripItem.dateString]) {
          items[tripItem.dateString] = [{
            ...tripItem
          }];
        } else {
          items[tripItem.dateString].push({
            ...tripItem
          });
          items[tripItem.dateString].sort((trip1, trip2) => {
            return moment(`${trip1.dateString} ${trip1.time}`).valueOf() - moment(`${trip2.dateString} ${trip2.time}`).valueOf();
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6'
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    borderRadius: 5,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  },
  tripTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: 'black'
  }
});

