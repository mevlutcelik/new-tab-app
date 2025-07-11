import { weatherIcons } from '@/icons/weatherIcons'

export function getBase64Icon(iconCode) {
  switch (iconCode) {
    case '01d':
      return weatherIcons.day.sunny;
      break;
    case '01n':
      return weatherIcons.night.moon;
      break;
    case '02d':
      return weatherIcons.day.partlyCloudy;
      break;
    case '02n': weatherIcons.night.partlyMoon;
      break;
    case '03d':
    case '03n':
    case '04d':
    case '04n':
      return weatherIcons.day.cloud;
      break;
    case '09d':
      return weatherIcons.day.rain;
      break;
    case '09n':
      return weatherIcons.night.rain;
      break;
    default:
      return weatherIcons.day.rain;
  }
}