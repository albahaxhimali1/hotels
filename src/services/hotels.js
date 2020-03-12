import axios from 'axios'
import {BASE_URL}  from '../../config/env'

export default {
  getHotels() {
    return axios.get(`${BASE_URL}/hotels`);
  }
}
