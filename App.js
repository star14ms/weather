import React from "react";
import { Alert } from "react-native";
import Loading from "./Loading";
import * as Location from "expo-location";
import axios from "axios";
import Weather from "./weather";

var firstUpdate = false
var havePermission = false, askPermission = false
var lat = 91, long = 0
const API_KEY = "8131be73db829c98d37cc6aa18a20247";

export default class extends React.Component {
  state = { loadingState: 0, oneMinute: false, dateInfo: {min: null} };

  getDate() {
    var intMonth = new Date().getMonth() + 1
    var intdate = new Date().getDate()
    var intHours = new Date().getHours()
    var intMin = new Date().getMinutes()
    var intSec = new Date().getSeconds()

    var hours = (intHours > 9) ? String(intHours) : "0"+String(intHours)
    var min = (intMin > 9) ? String(intMin) : "0"+String(intMin)
    var sec = (intSec > 9) ? String(intSec) : "0"+String(intSec)
    // var date = moment()
    //   .utcOffset('+05:30')
    //   .format('YYYY-MM-DD hh:mm:ss a');
    if (this.state.dateInfo.min != min) {
      this.state.oneMinute = true
    } 

    if (this.state.loadingState == 0) {
      this.setState({ 
        dateInfo: {hours, min, sec, month:String(intMonth), date:String(intdate)}
      })
    } else {
      this.setState({ 
        dateInfo: {hours, min, sec, month:String(intMonth), date:String(intdate)}
      })
    }  
  };

  getLocation = async () => {
    try {
      if (havePermission == false && askPermission == false) {
        askPermission = true
        const response = await Location.requestPermissionsAsync();
        this.setState({ loadingState: 1 })
        askPermission = false
      }
      // const coords = await Location.getCurrentPositionAsync();
      // console.log(coords);
      const {
        coords: {latitude, longitude}
      } = await Location.getCurrentPositionAsync();
      lat = latitude, long = longitude
      havePermission = true
      // lat = 37.49, long = 126.87;

    } catch (error) { // throw Error();
      havePermission = false
      Alert.alert("?????????", "?????? ?????? ??? ??????\n?????? ????????? ??? ?????????");
      // Alert.alert("Can't find you.", "So sad")
    }

    if (this.state.loadingState == 1) {
      this.setState({ loadingState: 2 })
    }
    this.getWeather();
  };

  getWeather = async () => { // Send to API and get weather!
    try {
      var { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`
        );
      // console.log(data.weather[0].main) // ?????? ??????
      // console.log(lat, long) // ?????? ??????
      // console.log(data) // ?????? ??????
      this.setState({
        loadingState: 3,
        temp: data.main.temp,
        condition: data.weather[0].main,
      })
    } catch (error) {
      this.setState({
        loadingState: 3,
        temp: -273,
        condition: "Empty",
      });
    }
    firstUpdate = true
  };

  updateScreenInfo() {
    console.log("===================== 1???")
    this.getDate();
    if (this.state.oneMinute) {
      this.state.oneMinute = false
      console.log("??????, ?????? ????????????")
      this.getLocation();
    }
  };

  componentDidMount() {
    this.updateScreenInfo()
    setInterval(()=>(
      firstUpdate ? this.updateScreenInfo()
      : console.log("===================== 1???")
    ),1000); // 10???(10000ms) ?????? ??????
  };

  render() {
      const { loadingState, dateInfo, temp, condition } = this.state;
      switch (loadingState) {
        case 0:
          console.log("screen update:", loadingState)
          return <Loading loadingState={loadingState} />
        case 1:
          console.log("screen update:", loadingState)
          return <Loading loadingState={loadingState} />
        case 2:
          console.log("screen update:", loadingState)
          return <Loading loadingState={loadingState} />
        case 3:
          console.log("screen update:", loadingState)
          return <Weather dateInfo={dateInfo} temp={Math.round(temp)} condition={condition} />
      };
  }
}