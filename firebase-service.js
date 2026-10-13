// Carregado apenas depois de configurares o Firebase: o modo demo não necessita de rede.
// SDK oficial modular para browser: https://firebase.google.com/docs/web/setup
const CDN = 'https://www.gstatic.com/firebasejs/12.19.0/';

export async function createFirebaseService(config) {
  const [appModule, authModule, firestoreModule, storageModule] = await Promise.all([
    import(`${CDN}firebase-app.js`), import(`${CDN}firebase-auth.js`),
    import(`${CDN}firebase-firestore.js`), import(`${CDN}firebase-storage.js`)
  ]);
  const { initializeApp } = appModule;
  const { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } = authModule;
  const { getFirestore, collection, doc, onSnapshot, setDoc, deleteDoc, serverTimestamp } = firestoreModule;
  const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } = storageModule;

  const app = initializeApp(config);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const animalsRef = collection(db, 'animals');

  return {
    observeAnimals(onData, onError) {
      return onSnapshot(animalsRef, (snapshot) => {
        onData(snapshot.docs.map((item) => ({ ...item.data(), id: item.id })));
      }, onError);
    },
    observeAuth(onUser) { return onAuthStateChanged(auth, onUser); },
    login(email, password) { return signInWithEmailAndPassword(auth, email, password); },
    logout() { return signOut(auth); },
    async saveAnimal(animal, files, existing) {
      const animalRef = existing ? doc(db, 'animals', existing.id) : doc(animalsRef);
      const images = [...animal.images];
      const uploadPaths = (existing?.uploadPaths || []).filter((item) => images.includes(item.url));
      for (const file of files) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 75);
        const path = `animals/${animalRef.id}/${crypto.randomUUID()}-${safeName}`;
        const fileRef = ref(storage, path);
        await uploadBytes(fileRef, file, { contentType: file.type });
        const url = await getDownloadURL(fileRef);
        images.push(url);
        uploadPaths.push({ path, url });
      }
      const data = {
        ...animal, images, uploadPaths,
        updatedAt: serverTimestamp(),
        ...(existing ? {} : { createdAt: serverTimestamp() })
      };
      await setDoc(animalRef, data, { merge: Boolean(existing) });
      return animalRef.id;
    },
    async deleteAnimal(animal) {
      await deleteDoc(doc(db, 'animals', animal.id));
      // A ficha desaparece mesmo que a limpeza de algum ficheiro antigo falhe.
      for (const item of animal.uploadPaths || []) {
        try { await deleteObject(ref(storage, item.path)); }
        catch (error) { console.warn('Falhou a remoção de uma imagem:', error); }
      }
    }
  };
}
