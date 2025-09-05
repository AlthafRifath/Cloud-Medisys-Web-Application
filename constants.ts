
// WARNING: Replace with your actual AWS Cognito and API Gateway details.
const COGNITO_DOMAIN = 'eu-north-11jw023fua.auth.eu-north-1.amazoncognito.com';
const COGNITO_CLIENT_ID = '7f77khh92gghia6130j98dbdf0';
const COGNITO_REDIRECT_URI = 'http://localhost:5173/auth/callback';
export const API_BASE_URL = 'https://i7g7do3kia.execute-api.eu-north-1.amazonaws.com/prod';

export const COGNITO_LOGIN_URL = `https://${COGNITO_DOMAIN}/login?client_id=${COGNITO_CLIENT_ID}&response_type=token&scope=email+openid+profile&redirect_uri=${encodeURIComponent(COGNITO_REDIRECT_URI)}`;
export const COGNITO_LOGOUT_URL = `https://${COGNITO_DOMAIN}/logout?client_id=${COGNITO_CLIENT_ID}&logout_uri=${encodeURIComponent('http://localhost:5173')}`;