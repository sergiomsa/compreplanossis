// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiURL: 'developmentApi',
  baseUrl: 'https://api.compreplanos.com.br/api/app',
  firebaseConfig: {
    apiKey: "AIzaSyBOwVTue49ZCXIK4X-Tav45fLiHno0oxGA",
    authDomain: "odontoplano-8fb4d.firebaseapp.com",
    databaseURL: "https://odontoplano-8fb4d.firebaseio.com",
    projectId: "odontoplano-8fb4d",
    storageBucket: "odontoplano-8fb4d.appspot.com",
    messagingSenderId: "661195394453"
  }
};
