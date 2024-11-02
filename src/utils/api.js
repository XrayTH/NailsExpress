import axios from 'axios';

const userService = axios.create({
  baseURL: ""+process.env.REACT_APP_USERS_URL,
  timeout: 30000,
});

const profileService = axios.create({
  baseURL: ""+process.env.REACT_APP_PROFILE_URL,
  timeout: 30000,
});

const domicileService = axios.create({
  baseURL: ""+process.env.REACT_APP_DOMICILE_URL,
  timeout: 30000,
});

const imageService = axios.create({
  baseURL: ""+process.env.REACT_APP_IMAGES_URL,
  timeout: 30000,
});

const emailService = axios.create({
  baseURL: ""+process.env.REACT_APP_EMAIL_URL,
  timeout: 30000,
});

export { userService, profileService, domicileService, imageService, emailService };

