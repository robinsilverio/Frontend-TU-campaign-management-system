export const RegEx = {
    TITLE: new RegExp("^[A-Za-z0-9\\s.'-]*$"),
    DESCRIPTION: new RegExp("^[\\w\\s.,'\":;!?()-]*$"),
    IMG_URL: new RegExp("^((https?://)?\\S+\\.(jpg|png))$"),
    REGULAR_URL: new RegExp("^(https?://)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}(\\.[a-z]{2,6})?\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)$"),
    NUMBER: new RegExp("^(\\d+|[0-9]+([.,][0-9]{2})?)$"),
}