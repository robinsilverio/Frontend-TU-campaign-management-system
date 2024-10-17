import Cookies from "js-cookie";
export default function getAuthorizationToken() {

    let jwtToken = Cookies.get('jwtToken');

    if (!jwtToken) {
        return null
    }

    return "Bearer " + jwtToken;
}