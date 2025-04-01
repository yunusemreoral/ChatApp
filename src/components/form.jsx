import React, { useEffect, useRef, useState } from 'react'
import { db } from '../firebase';
import { addDoc, collection,serverTimestamp } from 'firebase/firestore';
import EmojiPicker from "emoji-picker-react";

const Form = ({user,room}) => {
    
    const [isOpen,setIsOpen] = useState(false);
    const [text,setText] = useState("");
    const emojiPickerRef = useRef(null);
    const buttonRef = useRef(null);

    // emoji picker alanının dışarısına tıklanınca modlaı kapat
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isOpen && 
                emojiPickerRef.current &&
            !emojiPickerRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target) 
    ) {
        setIsOpen(false);
    }
 };

 document.addEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // form gönderilince
    const handleSubmit = async (e) => {
e.preventDefault();

//form temizle
setText("");
setIsOpen(false);

// mesajı kaydedileceği kolleksiyonun referasnını al
const colletionRef = collection(db,"messages");

//mesajı veritabanındaki messages kolleksiyonuna ekle
await addDoc(colletionRef, {
    text,
    room,
    author:{
        id: user.uid,
        name: user.displayName,
        photo: user.photoURL,
    },
    createdAt: serverTimestamp(),
});



    };

// inputtaki seçili alana empji ekle
const handleEmojiClick = (e) => {
    const input = document.querySelector("input[type='text']");

    if (input) {
        // inputta seçili karakterlerin başlangıç sırası
        const start = input.selectionStart;
        // inputta seçili karakterlerin bitiş sırası
        const end = input.selectionEnd;
        // seçili alana emojiyi ekle
        const newText = text.substring(0, start) + e.emoji + text.substring(end);
        // state'i güncelle
        setText(newText);
    }
};

  return (
   <form onSubmit={handleSubmit} className='p-5 border border-gray-200 shadow-lg flex justify-center gap-3'>
    <input type='text' 
     placeholder='mesajınızı yazınız...'
    className='border border-gray-200 shadow-sm p-2 px-4 rounded-md w-1/2'
    value={text}
    onChange={(e) => setText(e.target.value)}
/>

<div className='relative'>
    {isOpen && (
    <div className='absolute top-[-470px] right-[-140px]' ref={emojiPickerRef}>
        <EmojiPicker open={isOpen} onEmojiClick={handleEmojiClick}/>
    </div>
    )}

    <button ref={buttonRef}  type='button' className='btn text-base'onClick={() => setIsOpen(!isOpen)}>😂</button>
</div>
    <button disabled={text.length < 1 } type='submit' className='btn bg-black text-white disabled:brightness-75'>Gönder</button>
   </form>
  )
}

export default Form
