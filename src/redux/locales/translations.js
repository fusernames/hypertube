// ["en", "fr"]
const translations = {
  global: {
    username: ["Username", "Nom d'utilisateur"],
    email: ["Email", "Email"],
    password: ["Password", "Mot de passe"],
    lastname: ["Last name", "Nom de famille"],
    firstname: ["First name", "Prénom"],
    repassword: ["Repeat password", "Repetez votre mot de passe"],
    new_password: ["New password", "Nouveau mot de passe"],
    cancel: ["Cancel", "Annuler"],
    send: ["Send", "Envoyer"],
  },
  navbar: {
    login: ["Login", "Connexion"],
    register: ["Register", "S'enregister"],
    logout: ["Logout", "Deconnexion"],
    notifications: ["Notifications", "Notifications"],
    search: ["Search...", "Rechercher..."],
    profile: ["Profile", "Profil"],
    my_account: ["My account", "Mon compte"],
    home: ["Home", "Accueil"],
    movies: ["Your movies", "Vos films"]
  },
  login: {
    btn: ["Log In", "Se connecter"],
    title: ["Sign in", "Connexion"],
    forgot_password: ["Forgot password ?", "Mot de passe oublié ?"]
  },
  resetpw: {
    title: ["Reset your password", "Réinitilisez votre mot de passe"],
    btn: ["Reset", "Réinitiliser"]
  },
  ask_reset: {
    title: ["Send a reset link", "Envoyer un lien de réinitialisation"]
  },
  register: {
    btn: ["Register", "S'enregister"],
    title: ["Register", "Creer un compte"],
    upload: ["Upload avatar", "Importer un avatar"]
  },
  account: {
    btn: ["Update", "Mettre à jour"],
    change_password: ["Change password", "Changer le mot de passe"]
  },
  search : {
    no_results: ["There is no results for you research", "Il n'y a aucun résultat pour votre recherche"]
  },
  sort: {
    sort: ["Sort by", "Trier par"],
    rating: ["Rating", "Note"],
    title: ["Title", "Titre"],
    year: ["Production year", "Annee de production"],
    none: ["None", "Aucun"]
  },
  movie: {
    synopsis: ["Synopsis", "Synopsis"],
    production: ["Production", "Production"],
    time: ["Duration", "Durée"],
    genres: ["Genres", "Genres"],
    trailer: ["Trailer", "Bande annonce"],
    download: ["Download", "Télécharger"],
    rating: ["Rating", "Note"],
    torrents: ["Torrents", "Torrents"],
    comment: ["Enter a comment", "Entrez un commentaire"],
    time_display: ["en", "fr"],
    view: ["viewed", "vu"]
  },
  alerts: {
    // login
    LOGIN_SUCCESS: ["Logged successfully", "Connexion réussie"],
    LOGIN_ERROR: ["Invalid password or username", "Mot de passe ou nom d'utilisateur invalide"],
    // register
    REGISTER_SUCCESS: ["You have successfully register", "Inscription réussie"],
    REGISTER_USERNAME_TOOK: ["This username is already took", "Ce nom d'utilisateur existe déjà"],
    REGISTER_EMAIL_TOOK: ["This email is already took", "Cet email existe déjà"],
    REGISTER_BAD_PICTURE: ["You can't upload this file", "Vous ne pouvez pas importer ce fichier"],
    REGISTER_EMPTY_PICTURE: ["You need to upload an avatar", "Vous devez ajouter un avatar"],
    REGISTER_TOO_BIG_PICTURE: ["Your avatar is too big, must be 1Mb max", "Votre avatar est trop lourd, 1Mb maximum"],
    // reset
    RESET_SENT: ["We successfully sent a reset link, check your mails", "Nous avons bien envoyé un lien de réinitialisation, regardez vos mails"],
    // user
    USER_NOT_FOUND: ["User not found", "Utilisateur non trouvé"],
    USER_EDIT_SUCCESS: ["Your informations has been updated", "Vos informations ont bien étés éditées"],
    USER_BAD_PASSWORD: ["This password is not correct", "Le mot de passe n'est pas correct"],
    USER_EDIT_PASSWORD_SUCCESS: ["Password updated successfully", "Votre mot de passe a bien été mis à jour"],
    // oauth
    OAUTH_ERROR: ["This account is already register", "Ce compte existe déjà"],
    // other
    API_ERROR: ["Error while fetching extern API", "Erreur pendant le chagrement de l'api externe"],
    AJAX_ERROR: ["Error while fetching datas", "Erreur lors de chargement des donnees"],
    MOVIE_NOT_FOUND: ["This movie does not exists", "Ce film n'éxiste pas"],
    INVALID_MESSAGE: ["Error adding the comment", "une erreur est survenue lors du post de votre commentaire"]
  },
  validator: {
    TOO_SHORT: ["Too short", "Trop court"],
    TOO_LONG: ["Too long", "Trop long"],
    DIFFERENT: ["Not the same", "Ne correspond pas"],
    IS_NULL: ["Can't be null", "Ne peut pas être nul"],
    INVALID_EMAIL: ["Invalid email", "Email invalide"],
    NOT_ALPHABETIC: ["Must be alphabetic", "Doit être alphabétique"],
    INVALID_PASSWORD: ["Invalid password, must contain at least 8 characters, one uppercase letter and a number ", "Mot de passe invalide, le mot de passe doit etre de 8 caracteres minimum et contenir au moins 1 majuscule et 1 chiffre"]
  },
  genres: {
    action: ['Action', 'Action'],
    adventure: ['Adventure', 'Aventure'],
    animation: ['Animation', 'Animation'],
    comedy: ['Comedy', 'Comédie'],
    crime: ['Crime', 'Criminel'],
    disaster: ['Disaster', 'Désastre'],
    drama: ['Drama', 'Drame'],
    documentary: ['Documentary', 'Documentaire'],
    eastern: ['Eastern', 'Eastern'],
    family: ['Family', 'Famille'],
    fantasy: ['Fantasy', 'Fantaisie'],
    'film-noir': ['Film noir', 'Film noir'],
    history: ['History', 'Histoire'],
    horror: ['Horror', 'Horreur'],
    music: ['Music', 'Musique'],
    mystery: ['Mystery', 'Mystère'],
    none: ['None', 'Aucun'],
    romance: ['Romance', 'Romance'],
    'science-fiction': ['Science fiction', 'Science Fiction'],
    'sci-fi': ['Science fiction', 'Science Fiction'],
    sports: ['Sports', 'Sport'],
    thriller: ['Thriller', 'Thriller'],
    war: ['War', 'Guerre'],
    western: ['Western', 'Western'],
    biography: ['Biography', 'Biographie'],
    musical: ['Musical', 'Comedie Musicale']
  }
}

export default translations
