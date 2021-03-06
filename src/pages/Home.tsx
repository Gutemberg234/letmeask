import { FormEvent, useState } from 'react';
import Modal from 'react-modal';
import { useHistory } from 'react-router-dom';

import illustrationImg from '../assets/illustration.svg';
import logoImg from '../assets/logo.svg';
import googleIconImg from '../assets/google-icon.svg';

import '../styles/auth.scss';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

export function Home() {
    const history = useHistory();
    const { user, signInWithGoogle } = useAuth()
    const [roomCode, setRoomCode] = useState('')
    const [modalClosed, setModalClosed] = useState(false)
    const [modalDont, setModalDont] = useState(false)

    async function handleCreateRoom(){
        if (!user) {
            await signInWithGoogle()
        }

        history.push('/rooms/new');
    }

    async function handleJoinRoom(event: FormEvent){
        event.preventDefault();

        if(roomCode.trim() === ''){
            return
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if(!roomRef.exists()){
            setModalDont(true)
            return
        }

        if(roomRef.val().endedAt){
            setModalClosed(true)
            return
        }

        history.push(`/rooms/${roomCode}`);
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real.</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <button className="create-room" onClick={handleCreateRoom}>
                        <img src={googleIconImg} alt="Logo do Google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">
                        ou entre em uma sala
                    </div>
                    <form action="" onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode( event.target.value )}
                            value={roomCode}
                        />
                        <Button type="submit">Entrar na sala</Button>
                    </form>
                </div>
            </main>
            <Modal className="modal" overlayClassName="modal-overlay" onRequestClose={() => setModalClosed(false)} isOpen={modalClosed}>
                <p>Falha!</p>
                <span>Esta sala já foi encerrada.</span>
            </Modal>
            <Modal className="modal" overlayClassName="modal-overlay" onRequestClose={() => setModalDont(false)} isOpen={modalDont}>
                <p>Falha!</p>
                <span>Sala não existente.</span>
            </Modal>
        </div>
    )
}