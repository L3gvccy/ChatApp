export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "/api/auth";
export const REGISTER_ROUTE = `${AUTH_ROUTES}/register`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

export const PROFILE_ROUTES = "/api/profile";
export const UPDATE_PROFILE_ROUTE = `${PROFILE_ROUTES}/update-profile`;
export const UPLOAD_PROFILE_IMAGE = `${PROFILE_ROUTES}/upload-profile-image`;
export const DELETE_PROFILE_IMAGE = `${PROFILE_ROUTES}/delete-profile-image`;

export const CONTACT_ROUTES = "/api/contact";
export const SEARCH_CONTACTS_ROUTE = `${CONTACT_ROUTES}/search-contacts`;
export const GET_CONTACTS_DM_ROUTE = `${CONTACT_ROUTES}/get-contacts-dm`;

export const MESSAGES_ROUTES = "/api/messages";
export const GET_MESSAGES_ROUTE = `${MESSAGES_ROUTES}/get-messages`;
export const GET_CHANNEL_MESSAGES_ROUTE = `${MESSAGES_ROUTES}/get-channel-messages`;
export const UPLOAD_FILE_ROUTE = `${MESSAGES_ROUTES}/upload-file`;
export const DOWNLOAD_FILE_ROUTE = `${MESSAGES_ROUTES}/download-file`;
export const MARK_AS_READ_ROUTE = `${MESSAGES_ROUTES}/mark-as-read`;
export const GET_UNREAD_MESSAGES_COUNT_ROUTE = `${MESSAGES_ROUTES}/get-unread-messages-count`;

export const CHANNEL_ROUTES = "/api/channels";
export const GET_CHANNELS_ROUTE = `${CHANNEL_ROUTES}/get-channels`;
export const UPLOAD_CHANNEL_IMAGE = `${CHANNEL_ROUTES}/upload-channel-image`;
export const DELETE_CHANNEL_IMAGE = `${CHANNEL_ROUTES}/delete-channel-image`;
export const UPDATE_CHANNEL_NAME = `${CHANNEL_ROUTES}/update-channel-name`;
export const ADD_CHANNEL_MEMBER = `${CHANNEL_ROUTES}/add-channel-member`;
export const DELETE_CHANNEL = `${CHANNEL_ROUTES}/delete-channel`;
