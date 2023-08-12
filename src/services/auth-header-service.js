export default function getAuthorizationToken() {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return `Bearer ${user.token}`;
    } else {
        return null;
    }
}