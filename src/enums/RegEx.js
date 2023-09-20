export const RegEx = {
    TITLE: new RegExp("^[A-Za-z0-9\\s.'-]*$"),
    DESCRIPTION: new RegExp("^[\\w\\s.,'\":;!?()-]*$"),
    IMG_URL: new RegExp("^((https?://)?\\S+\\.(jpg|png))$"),
    TEST_REGULAR_URL: new RegExp("^(https?://)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)$"),
    REGULAR_URL: new RegExp("^(https?://)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)$")
}