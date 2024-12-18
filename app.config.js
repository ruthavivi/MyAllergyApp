
export default {
  expo: {
    name: "my-new-project",
    slug: "my-new-project",
    extra: {
      firebaseConfig: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID,
      },
      googleVisionApiKey: process.env.GOOGLE_VISION_API_KEY,
      googleTranslateApiKey: process.env.GOOGLE_TRANSLATE_API_KEY,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
    },
  },
};
