import React from 'react';
import {
  StyleSheet,
  Text,
  AppState,
  AsyncStorage,
  View,
  TouchableHighlight,
  SafeAreaView,
} from 'react-native';
import Card from './components/Card';
import Loader from './components/Loader';
import {connect} from 'react-redux';
import {updateData, updateTime, resetdata, nextLevel} from './Actions';
import helpers from './helpers';

let prevIndex = -1;
let isTestingInProgress = false;
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.renderCards = this.renderCards.bind(this);
    this.restartGame = this.restartGame.bind(this);
    this.state = {
      isStoreLoading: true,
      resultScreen: false,
    };

    this.tick = this.tick.bind(this);
    this.timeData = {
      min: 0,
      sec: 0,
    };
  }

  componentWillMount() {
    var self = this;
    AppState.addEventListener('change', this._handleAppStateChange.bind(this));
    AsyncStorage.getItem('completeStore')
      .then((value) => {
        if (value && value.length) {
          let initialStore = JSON.parse(value);
          this.props.dispatch(updateData(initialStore));
        }
      })
      .catch((error) => {});
    self.setState({isStoreLoading: false});
    this.intervalHandle = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    AppState.removeEventListener(
      'change',
      this._handleAppStateChange.bind(this),
    );
  }
  _handleAppStateChange(currentAppState) {
    let storingValue = JSON.stringify(this.props.cardsData);
    AsyncStorage.setItem('completeStore', storingValue);
  }

  render() {
    let finalscore = 0;
    for (var i = 0; i < this.props.cardsData.level; i++) {
      finalscore = finalscore + (i * 10);
    }
    console.log(this.props);
    if (this.state.isStoreLoading) {
      return <Loader />;
    } else if (this.state.resultScreen) {
      return (
        <View style={styles.resultScreenContainer}>
          <Text style={styles.resultScreenScoreTitle}>Your Score</Text>
          <Text style={styles.resultScreenScoreText}>{finalscore}</Text>
          <TouchableHighlight
            style={styles.resultScreenBtn}
            onPress={() => {
              this.setState({resultScreen: false}, () => {
                this.props.dispatch(resetdata());
                this.intervalHandle = setInterval(this.tick, 1000);
              });
            }}>
            <Text style={styles.resultScreenBtnText}>Restart</Text>
          </TouchableHighlight>
        </View>
      );
    }
    return (
      <SafeAreaView style={styles.fullFlex}>
        <View style={styles.container}>
          <View style={styles.alignViewToCenter}>
            <Text style={styles.homeScreenMemoryTitle}>Memory Game</Text>
            <View style={styles.homeScreenScoreLevelContainer}>
              <View style={styles.homeScreenAlignCenter}>
                <Text>Level</Text>
                <Text style={styles.redColor}>
                  {this.props.cardsData.level}
                </Text>
              </View>
              <View style={styles.homeScreenAlignCenter}>
                <Text>Score</Text>
                <Text style={styles.redColor}>{finalscore}</Text>
              </View>
            </View>
            <View style={styles.homeScreenAlignCenter}>
              <Text>Time Left</Text>
              <Text style={styles.redColor}>
                {this.timeData.min}:{this.timeData.sec}
              </Text>
            </View>
          </View>
          <View style={styles.body}>{this.renderRows.call(this)}</View>
        </View>
      </SafeAreaView>
    );
  }

  restartGame() {
    this.setState(
      {
        resultScreen: true,
      },
      () => {
        AsyncStorage.clear();
      },
    );
  }

  renderRows() {
    let contents = this.getRowContents(this.props.cardsData.cards);
    return contents.map((cards, index) => {
      return (
        <View key={index} style={styles.row}>
          {this.renderCards(cards)}
        </View>
      );
    });
  }

  renderCards(cards) {
    return cards.map((card, index) => {
      return (
        <Card
          key={index}
          position={card.matchingPairKey}
          is_open={card.is_open}
          clickCard={this.clickCard.bind(this, card.index)}
        />
      );
    });
  }

  clickCard(position) {
    if (!isTestingInProgress) {
      let cardsData = this.props.cardsData;
      let selected_pairs = cardsData.selected_pairs;
      let current_selection = cardsData.current_selection;

      let index = cardsData.cards.findIndex((card) => {
        return card.index == position;
      });

      let cards = cardsData.cards;
      if (prevIndex == -1) {
        prevIndex = index;
      }
      if (
        cards[index].is_open == false &&
        selected_pairs.indexOf(cards[index].matchingPairKey) == -1
      ) {
        cards[index].is_open = true;
        cardsData.current_selection.push({
          matchingPairKey: cards[index].matchingPairKey,
        });
        if (current_selection.length == 2) {
          isTestingInProgress = true;
          if (
            current_selection[0].matchingPairKey ==
            current_selection[1].matchingPairKey
          ) {
            cardsData.score += 1;
            cardsData.selected_pairs.push(cards[index].matchingPairKey);
            isTestingInProgress = false;
            prevIndex = -1;
          } else {
            setTimeout(() => {
              cards[index].is_open = false;
              if (prevIndex != -1) {
                cards[prevIndex].is_open = false;
                prevIndex = -1;
              }
              this.props.dispatch(updateData(cardsData));
              isTestingInProgress = false;
            }, 500);
          }

          cardsData.current_selection = [];
        }
        this.props.dispatch(updateData(cardsData));
        if (cardsData.score == cards.length / 2) {
          this.addTwoItems();
          prevIndex = -1;
        }
      }
    }
  }

  getRowContents(cards) {
    let contents_r = [];
    let contents = [];
    let count = 0;
    cards.forEach((item, index) => {
      count += 1;
      contents.push(item);
      if (
        count === Math.floor(Math.sqrt(this.props.cardsData.cards.length)) ||
        (index === cards.length - 1 && contents && contents.length > 0)
      ) {
        contents_r.push(contents);
        count = 0;
        contents = [];
      }
    });

    return contents_r;
  }

  addTwoItems() {
    this.props.dispatch(nextLevel());
  }

  tick() {
    this.secondsRemaining = this.props.cardsData.seconds;
    var timeInMin = Math.floor(this.secondsRemaining / 60);
    var timeInSec = this.secondsRemaining - (timeInMin * 60);
    if (timeInSec < 10) {
      this.timeData.sec = '0' + timeInSec;
    } else {
      this.timeData.sec = timeInSec;
    }

    if (timeInMin < 10) {
      this.timeData.min = '0' + timeInMin;
    } else {
      this.timeData.min = timeInMin;
    }

    if (timeInMin === 0 && timeInSec === 0) {
      clearInterval(this.intervalHandle);
      this.restartGame();
    }

    this.secondsRemaining--;

    if (this.secondsRemaining >= 0) {
      this.props.dispatch(updateTime(this.secondsRemaining));
    }
  }
}

const styles = StyleSheet.create({
  fullFlex: {
    flex: 1,
  },
  alignViewToCenter: {
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#fff',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  body: {
    flex: 18,
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 20,
  },
  resultScreenContainer: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  resultScreenScoreTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#228B22',
    fontSize: 20,
  },
  resultScreenScoreText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#228B22',
    margin: 10,
    fontSize: 20,
    marginBottom: 50,
  },
  resultScreenBtn: {
    width: '70%',
    height: 50,
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#228B22',
  },
  resultScreenBtnText: {
    color:'#eee',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  homeScreenMemoryTitle: {
    color: '#5abcdb',
    fontWeight: 'bold',
  },
  homeScreenScoreLevelContainer: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
  },
  homeScreenAlignCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  redColor: {
    color: '#800000',
  },
});

const mapStateToProps = (state) => {
  return {
    cardsData: state.homeReducer,
  };
};

export default connect(mapStateToProps)(Home);
