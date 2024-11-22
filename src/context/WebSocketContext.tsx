'use client';

import Menu from '@/app/Menu';
import Modal from '@/app/_components/layout/Modal';
import ConnectForm from '@/app/_components/secretary/ConnectForm';
import { connectToSecretary } from '@/app/_components/secretary/webSocketClient';
import type { CharacterState } from '@/domain/secretary/game.state';
import { mapCharacterNameToSecretary } from '@/domain/secretary/secretary-character.mapper';
import { getClass } from '@/stores/class.store';
import { getGameState, setGameState } from '@/stores/game.store';
import { createContext, useEffect, useState, type ReactNode } from 'react';

type WsGameStateUpdate = (state: Partial<CharacterState>, info: string[]) => void;

export const WebSocketContext = createContext<{
  isConnected: boolean;
  id: string;
  update?: WsGameStateUpdate | null;
}>({
  isConnected: false,
  id: '',
});

export default function WebSocketProvider({ children }: { children: ReactNode }) {
  const [wsClient, setWsClient] = useState<WebSocket | null>(null);
  const [secretaryId, setSecretaryId] = useState<string>('');
  const [isConnectModalOpen, setConnectModalOpen] = useState(false);

  const updateGameState = (state: Partial<CharacterState>, info: string[]) => {
    if (!wsClient) return;
    const oldGameState = getGameState();
    if (!oldGameState) return;
    const currentClass = getClass();
    if (!currentClass) return;

    const {
      characters,
      revision,
      ...rest
    } = oldGameState;
    const currentCharacterIndex = characters
      .findIndex(({ name }) => name === mapCharacterNameToSecretary(currentClass.name));
    const character = characters[currentCharacterIndex];

    const newGameState = {
      ...rest,
      revision: revision + 1,
      characters: characters.with(currentCharacterIndex, {
        ...character,
        ...state,
      }),
    }
    info.splice(1, 0, character.title);
    wsClient.send(JSON.stringify({
      code: secretaryId,
      password: secretaryId,
      type: "game",
      payload: newGameState,
      revision: 0,
      undoinfo: info,
      undolength: 1,
    }));
    setGameState(newGameState);
  }

  useEffect(() => {
    const host = localStorage.getItem('secretary-host');
    const id = localStorage.getItem('secretary-id');
    if (!id || !host) return;
    connectToSecretary({ host, id }).then((client) => {
      setWsClient(client);
      setSecretaryId(id);
    });
    return () => wsClient?.close();
  }, []);

  return <WebSocketContext value={{
    isConnected: !!wsClient,
    id: secretaryId,
    update: updateGameState
  }}>
    {isConnectModalOpen && <Modal onCancel={() => setConnectModalOpen(false)}>
      <ConnectForm onConnect={({ client, id }) => {
        setWsClient(client);
        setSecretaryId(id);
        setConnectModalOpen(false);
      }} />
    </Modal>}
    <Menu onOpenConnectModal={() => setConnectModalOpen(true)} />
    {children}
  </WebSocketContext>;
}
