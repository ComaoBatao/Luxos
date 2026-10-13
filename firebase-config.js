// Configuração pública do Firebase (encontra-a em Definições do projeto > As tuas apps > Web).
// É NORMAL este ficheiro ser público no GitHub Pages. A segurança vem das regras do Firestore/Storage,
// das credenciais Firebase Authentication e de verificações de UID — NUNCA de esconder esta configuração.
export const firebaseConfig = {
  apiKey: "COLOCA_AQUI_A_API_KEY",
  authDomain: "COLOCA_AQUI.firebaseapp.com",
  projectId: "COLOCA_AQUI",
  storageBucket: "COLOCA_AQUI.firebasestorage.app",
  messagingSenderId: "COLOCA_AQUI",
  appId: "COLOCA_AQUI"
};

// Copia o UID do teu utilizador em Firebase Console > Authentication > Users.
// O MESMO UID tem de estar nas regras firestore.rules e storage.rules, publicadas no Firebase.
export const ADMIN_UID = "COLOCA_AQUI_O_TEU_UID";
