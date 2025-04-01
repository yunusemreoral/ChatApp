import { useEffect, useRef, useState } from "react";
import {auth, db} from "../firebase";
import { collection,onSnapshot,query,where,orderBy } from "firebase/firestore";
import Message from "./message";
import Arrow from "./arrow";


const List = ({room}) => {

  const [messages, setMessages] = useState([]);
  const [isAtBottom,setisAtBottom] = useState(true);
  const [unreadCount,setUnreadCount] = useState(0);
  const lastMessageRef = useRef(null);
  const containerRef = useRef(null);
  const prevMessagesLength = useRef(0);
  const audioRef = useRef(new Audio("/notify.mp3"));

  // veri tabanından mesajları at
  useEffect(() => {
    // kolleksiyonun referansını al
    const collectionRef = collection(db, "messages");

    // sorgu ayarlarını yap
    const q = query(collectionRef, where("room", "==",room), orderBy("createdAt","asc"));


    // mesajlar kolleksiyonuna abone ol değişiklik takip edilecek
    // kolleksiyondaki her değişiklikte fonksiyon bize dökümanları getitir
    const unsub = onSnapshot(q, (snapshot) => {
      // dökümanların geçici olarak tutuldugu dizi
      const temp = [];

      // dökümanları dönüp içerisindeki datalara erişip diziye aktar
      snapshot.docs.forEach((doc) => {
        temp.push(doc.data());
      });

      // dökümanları state
      setMessages(temp);
    });

    // componentwillunmount: component ekrandan ayrılınca çalışır
    //unsub ile veri tabanına yapılan aboneliği iptal et
    return () => unsub();
  }, []);

  // her yeni mesaj geldiğinden ekranı aşagı kaydır
  useEffect(() => {
if(messages.length > 1) {
  const lastMsg = messages[messages.length - 1];

  // kullanıcı yukardarken yeni mesaj gelirse unread sayısını artırır
  if (messages.length > prevMessagesLength.current && !isAtBottom) {
    // eğer son mesajı gönderen kullanıcı kendi değil ise

    if (lastMsg.author.id !== auth.currentUser.uid) {
      setUnreadCount((prev) => prev + 1);

      // yukardayken yeni mesaj gelirse bildiirm sesi çal
      playSound();
    }
  }

  prevMessagesLength.current = messages.length;

  if(lastMsg.author.id === auth.currentUser.uid) {
    // eger son mesajı aktif kullanıcı attıysa her koşulda kaydır
    scrollToBottom();
} else if(isAtBottom) {
  // eger son mesajı farklı kullanıcı attıysa kullanıcı aşagıdaysa kaydır
scrollToBottom();

// eger aşagıdadaykeb balkasından mesaj gelirse

  playSound();

}
}
},[messages]);

//kullanıcının aşagıdaki olup olmadıgını tespit eden fonksiyon
const handleScroll = () => {
    // scrollTop: kullanıcı yukarıdan itibaren ne kadar kaydır
    // clientHeight: kullanıncın ekranda gördüğü kısmın yüksekliği
    // scrollHeight: tüm içeriğin yüksekliği (gizli kısımlar dahil)
const {scrollTop,clientHeight,scrollHeight} = containerRef.current;

setisAtBottom(scrollTop + clientHeight >= scrollHeight - 100);
};

// en aşagıya kaydırır
const scrollToBottom = () => {
  lastMessageRef.current.scrollIntoView();

  // okunan mesaj sayısını sıfırla
  setUnreadCount(0);
}


// bildiirm tuşı-unu oynat
const playSound = () => {
  audioRef.current.currentTime = 0;
  audioRef.current.play();
}

  return (
    <main 
    ref={containerRef}
    onScroll={handleScroll} 
    className='flex-1 p-3 flex flex-col gap-3 w-full overflow-y-auto relative'> 

    {messages.length < 1 ? <div className='h-full grid place-items-center text-zinc-400'>
        <p>Sohbete ilk mesajı gönderin</p>
    </div> : messages.map((i,key) => <Message item={i} key={key} />
  )}
    
   <div ref={lastMessageRef}/>

<Arrow isAtBottom={isAtBottom} scrollToBottom={scrollToBottom} unreadCount={unreadCount} />

    </main>
  );
};

export default List
