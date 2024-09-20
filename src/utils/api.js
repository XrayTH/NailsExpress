import axios from 'axios';

const userService = axios.create({
  baseURL: ""+process.env.REACT_APP_USERS_URL,
  timeout: 1000,
});

const profileService = axios.create({
  baseURL: ""+process.env.REACT_APP_PROFILE_URL,
  timeout: 1000,
});

const imageService = axios.create({
  baseURL: ""+process.env.REACT_APP_IMAGES_URL,
  timeout: 1000,
});

export { userService, profileService, imageService };

