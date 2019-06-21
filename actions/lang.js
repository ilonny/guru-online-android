import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from 'react-native-restart';

export const setLang = lang => {
    console.log('set lang fired', lang);
    AsyncStorage.setItem('lang', lang);
    setTimeout(() => {
        console.log('restart app')
        RNRestart.Restart(); 
    }, 2000);

};

export const setLangInside = lang => {
    return {
        type: 'SET_LANG',
        lang
    }
} 