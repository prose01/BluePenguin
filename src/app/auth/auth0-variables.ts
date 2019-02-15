interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
  audience: string;
  client_secret: string;
  grant_type: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: 'FoBNP0eS7dEFBs1pTVdgTRjJgdwxvnsB',
  domain: 'bluepenguin.eu.auth0.com',
  callbackURL: 'http://localhost:4200/callback',
  audience: 'https://bluepenguin.eu.auth0.com/api/v2/',
  client_secret: 'JsMX4Byszgyxzy-nxtzhnEweDkZtJDAQgAbifWXFnsedV59nSTZr7MN61TGr618A',
  grant_type: 'client_credentials'
};