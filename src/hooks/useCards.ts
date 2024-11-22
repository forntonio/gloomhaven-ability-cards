import { CardActions, CardStatus, type Card } from '@/domain/cards.type';
import { useFrosthavenStore } from '@/stores/cards.store';
import { useMemo } from 'react';
import { useShallow } from 'zustand/shallow';

export type Action = 'top' | 'bottom' | 'default';

function newStatusAfterAction(cardActions: Card['actions'], action: Action): CardStatus {
  if (action === 'default') {
    return CardStatus.discarded;
  }
  const cardAction = cardActions[action];
  switch (cardAction) {
    case CardActions.discard:
      return CardStatus.discarded;
    case CardActions.lose:
      return CardStatus.lost;
    case CardActions.activeDiscard:
    case CardActions.activeLost:
      return action === 'top' ? CardStatus.activeTop : CardStatus.activeBottom;
  }
}

function getActiveAction(cardStatus: Card['status']): keyof Card['actions'] {
  if (cardStatus === CardStatus.activeTop) {
    return 'top';
  }
  if (cardStatus === CardStatus.activeBottom) {
    return 'bottom';
  }
  throw new Error('Invalid card status');
}

export function useCards<X extends Card>() {
  const {
    states,
    updateStates,
    currentStateIndex,
    setStateIndex,
  } = useFrosthavenStore(useShallow((store) => ({
    states: store.states,
    updateStates: store.updateStates,
    currentStateIndex: store.currentStateIndex,
    setStateIndex: store.setStateIndex,
  })));
  const currentCards = useMemo(() => states[currentStateIndex] as X[], [states, currentStateIndex]);

  const changeCardStatus = (newStatus: CardStatus, condition?: () => boolean) => (card: X) => {
    if (condition && !condition()) return;
    const otherCards = currentCards.filter(c => c !== card);
    const newState = [...otherCards, { ...card, status: newStatus }];
    updateStates([...states.slice(0, currentStateIndex + 1), newState]);
  };

  const selectCard = changeCardStatus(
    CardStatus.selected,
    () => currentCards.filter(c => c.status === CardStatus.selected).length < 2,
  );
  const discardCard = changeCardStatus(CardStatus.discarded);
  const loseCard = changeCardStatus(CardStatus.lost);
  const recoverCard = changeCardStatus(CardStatus.inHand);

  const playCards = (cardsPlayed: { action: Action; card: X }[]) => {
    const newState = [
      ...currentCards.filter(card => !cardsPlayed.map(({ card }) => card.name).includes(card.name)),
      ...cardsPlayed.map(({ action, card }) => ({ ...card, status: newStatusAfterAction(card.actions, action) })),
    ];

    updateStates([...states.slice(0, currentStateIndex + 1), newState]);
  };

  const moveTokenForward = (card: X) => {
    if (!card.slots) {
      throw new Error(`Card ${card.name} doest not have slots`)
    }

    const cardIndex = currentCards.findIndex(c => c === card);
    const newTokenPosition = (card.tokenPosition ?? 0) + 1;
    if (newTokenPosition >= card.slots.length) {
      const action = getActiveAction(card.status);
      const newStatus = card.actions[action] === CardActions.activeDiscard ? CardStatus.discarded : CardStatus.lost;
      const newState = currentCards.with(cardIndex, { ...card, status: newStatus, tokenPosition: 0 });
      updateStates([...states.slice(0, currentStateIndex + 1), newState]);
    } else {
      const newState = currentCards.with(cardIndex, { ...card, tokenPosition: newTokenPosition });
      updateStates([...states.slice(0, currentStateIndex + 1), newState]);
    }
  };

  const moveTokenBackward = (card: X) => {
    if (!card.slots) {
      throw new Error(`Card ${card.name} doest not have slots`)
    }

    const cardIndex = currentCards.findIndex(c => c === card);
    const newTokenPosition = Math.max(card.tokenPosition ? card.tokenPosition - 1 : 0, 0);
    const newState = currentCards.with(cardIndex, { ...card, tokenPosition: newTokenPosition });
    updateStates([...states.slice(0, currentStateIndex + 1), newState]);
  };

  const makeRest = (lost: X) => {
    const recovered = currentCards
      .filter(({ status }) => status === CardStatus.discarded)
      .filter(({ name }) => name !== lost.name);

    const newState = [
      ...currentCards.filter(c => c.status !== CardStatus.discarded),
      ...recovered.map(c => ({ ...c, status: CardStatus.inHand })),
      { ...lost, status: CardStatus.lost },
    ];
    updateStates([...states.slice(0, currentStateIndex + 1), newState]);
  };

  const undo = () => {
    if (currentStateIndex === 0) return;
    setStateIndex(currentStateIndex - 1);
  };

  const redo = () => {
    if (currentStateIndex === states.length - 1) return;
    setStateIndex(currentStateIndex + 1);
  };

  return {
    currentCards,
    selectCard,
    playCards,
    discardCard,
    loseCard,
    recoverCard,
    moveTokenForward,
    moveTokenBackward,
    makeRest,
    undo,
    redo,
  };
}