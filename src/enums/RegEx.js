export const RegEx = {
    TITLE: new RegExp("^[A-Za-z0-9\\s.'-]*$"),
    DESCRIPTION: new RegExp("^[\\w\\s.,'\":;!?()-]*$"),
    IMG_URL: new RegExp("^((https?://)?\\S+\\.(jpg|png))$")
}