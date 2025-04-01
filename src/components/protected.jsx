import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom"
import { auth } from "../firebase";
import Loader from "./loader";

// Protected component'ı içerisine alınan route'lara sadece oturumu açık olan kullanıcılar erişebilecek
const Protected = () => {
    
    
    // aktif kullanıcı (oturum açık) state'i
    const [user, setUser] = useState(undefined);

    //aktif kullanıcı verisini al
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setUser(user ? user : null);
        });
    }, []);

    // kullanıcı verisi yükleniyorsa loader bas
if(user === undefined) return <Loader/>;

    // kullanıcı oturumunu kapalıysa logine yönlendir
    if(user === null) return <Navigate to="/" replace/>;

    // kullanıcı hesabı açıksa sayfayı göster

    // kapsayıcı parent route içerisinde alt child routenin elementini ekrana bas

  return <Outlet context={user}/>;
}

export default Protected
