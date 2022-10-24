import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';


//const URL_BASE = 'http://192.168.100.31:8080';

const URL_BASE = 'http://192.168.0.131:8080'

const gasolineraApi = axios.create({
    baseURL: URL_BASE
});

gasolineraApi.interceptors.request.use(
    async (config: any) => {
        const token = await AsyncStorage.getItem('token')
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    }
)
export default gasolineraApi;

