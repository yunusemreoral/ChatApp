import { signOut } from "firebase/auth";
import {auth} from "../firebase";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

const RoomPage = () => {
  const user = useOutletContext();
  const navigate = useNavigate();
  
  // odaya gir
  const handleSubmit = (e) => {
    e.preventDefault();

    // ınputtaki girdiyi al
    const room = e.target[0].value.toLowerCase().replaceAll(" ","-");

    // kullancıyı sohbet odasına yonlendir
    navigate(`/chat/${room}`);
  };



  // oturumu kapat
  const handleLogout = () => {
    signOut(auth);
    toast.info("Oturum Kapandı");
  };

  return (
    <div className="wrapper">
    <form onSubmit={handleSubmit} className="box rounded-[10px] flex flex-col gap-10 text-center">
      
      <h1 className="text-4xl">Oda Seçme Sayfası</h1>
      <p className="text-zinc-500">Selam, {user.displayName}, <br/> Hangi odaya gireceksiniz?</p>

      <input type="text" 
      className="border border-gray-300 rounded-md shadow-lg p-2 px-4" 
      placeholder="örn: haftaiçi"/>

      <button type="submit" className="btn bg-zinc-700 text-white">Odaya Gir</button>

      <button type="button" className="btn bg-red-500 text-white" onClick={handleLogout} >Çıkış Yap</button>
    </form>
    </div>
  )
}

export default RoomPage
