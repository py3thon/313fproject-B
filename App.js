import { StatusBar } from 'expo-status-bar';
import React,{useEffect,useState} from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location'
import WeatherInfo from './components/WeatherInfo'
import UnitsPicker from './components/UnitsPicker'
import ReloadIcon from './components/ReloadIcon'
import {colors} from './utils/index'
import WeatherDetails from './components/WeatherDetails'

const WEATHER_API_KEY = 'f51934130452d9c3e07bd32cfb0f95ff'
const BASE_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?'
export default function App() {

  const [errorMessage,setErrorMessage] = useState(null)
  const [currentWeather,setCurrentWeather] = useState(null)
  const [unitSystem,setUnitSystem] = useState('metric')
  useEffect(()=>{
    load()
  },[unitSystem])
  async function load(){
    setCurrentWeather(null)
    setErrorMessage(null)
    try{
      let { status } = await Location.requestForegroundPermissionsAsync()
      if(status !== 'granted'){
        setErrorMessage("Acces to loaction is needed to run this app")
        return 
      }
      const location = await Location.getCurrentPositionAsync()

      const {latitude,longitude} = location.coords

      const weatherUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitSystem}&appid=${WEATHER_API_KEY}`
    
      const response = await fetch(weatherUrl)

      const result = await response.json()
      if(response.ok){
        setCurrentWeather(result)
      } else{
        setErrorMessage(result.message)
      }
    } catch(error){
    }
  }
  if(currentWeather){
    
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.main}>
          <UnitsPicker unitSystem={unitSystem} setUnitSystem={setUnitSystem}/>
          <ReloadIcon load={load}/>
          <WeatherInfo currentWeather={currentWeather}/>
        </View>
        <WeatherDetails currentWeather={currentWeather} unitSystem={unitSystem}/>
      </View>
    )
  } else if (errorMessage) {
    return (
      <View style={styles.container}>
        <Text style={{textAlign:"center"}}>{errorMessage}</Text>
        <StatusBar style="auto" />
      </View>
    )
  } else{
    return(
      <View style={styles.container}>
           <ActivityIndicator size="large" color={colors.PRIMARY_COLOR} />
          <StatusBar style="auto" />
      </View>
    )
    
  }
 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  main:{
    justifyContent:'center',
    flex:1
  }
});
