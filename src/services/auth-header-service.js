import Cookies from "js-cookie";
export default function getAuthorizationToken() {
    return "Bearer " + Cookies.get("jwtToken");
}