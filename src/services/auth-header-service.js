import axios from "axios";
import Cookies from "js-cookie";
import store from "../store";
export default function getAuthorizationToken() {

    let jwtToken = Cookies.get('jwtToken');

    if (!jwtToken) {
        return null
    }

    return "Bearer " + jwtToken;
}

export const validateJwt = async(token) => {     
    return await axios.get(`${store.getters.getBaseUrl}auth/validateJwt?paramToken=${token}`)
    .then(res =>  res.status === 200 ? res.data.roles[0] : '')
    .catch(err => '');
}