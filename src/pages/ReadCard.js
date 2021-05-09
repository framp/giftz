import { createEffect, createState, useContext, Show, For } from "solid-js";
import { useHistory } from "solid-router";
import "./ReadItem.css";
import { StoreContext } from "../components/StoreProvider";
import { loadCard, decryptCard, deleteCard, updateCard } from "../logic/Card";
import { prettyDate, renderDate } from "../logic/date";
import { loadKey } from "../logic/Key";
import Barcode from "../components/Barcode";
import OnScreenKeyboard from "../components/OnScreenKeyboard";

const parseBarcode = (barcode) => {
  try {
    const parsedBarcode = JSON.parse(barcode);
    if (parsedBarcode && parsedBarcode.constructor === Object) {
      return parsedBarcode;
    }
  } catch (e) {}
  return {
    value: barcode,
  };
};

export default ({ cardId }) => {
  const [store, { notify, rememberPassword }] = useContext(StoreContext);
  const history = useHistory();
  const [state, setState] = createState({
    card: {},
    password: {
      content: "",
    },
    newNote: "",
    requirePassword: false,
    submittedPassword: false,
    displayConfirmDelete: false,
  });
  createEffect(async () => {
    const loadedCard = loadCard(cardId);
    const savedPassword =
      store.passwords[loadedCard.keyId] &&
      store.passwords[loadedCard.keyId].password;
    try {
      const key = await loadKey(
        loadedCard.keyId,
        (state.submittedPassword && state.password && state.password.content) ||
          savedPassword
      );
      if (!key) {
        notify("Key not found for this card");
        history.push("/cards");
        return;
      }
      const decryptedCard = await decryptCard(key, loadedCard);
      if (state.submittedPassword && state.password && state.password.content) {
        rememberPassword(state.password.content, loadedCard.keyId);
      }
      setState("card", decryptedCard);
    } catch (e) {
      setState({
        password: { content: "" },
        submittedPassword: false,
      });
      if (e.message === "password-required") {
        setState("requirePassword", true);
      } else {
        console.log(e);
        notify("Wrong password");
      }
    }
  });

  const onToggleUsedCard = (e) => {
    const newCard = updateCard(cardId, (card) => ({
      ...card,
      used: !card.used,
    }));
    setState("card", "used", newCard.used);
  };
  const onDeleteCard = (e) => {
    e.preventDefault();
    setState("displayConfirmDelete", true);
  };
  const onCancelDeleteClick = (e) => {
    e.preventDefault();
    setState("displayConfirmDelete", false);
  };
  const onConfirmDeleteClick = (e) => {
    e.preventDefault();
    deleteCard(cardId);
    notify("Card deleted");
    history.push("/cards");
  };
  const onSubmitPassword = () => {
    setState("submittedPassword", true);
  };
  const onChangeAmount = (e) => {
    const newCard = updateCard(cardId, (card) => ({
      ...card,
      amount: e.target.value,
    }));
    setState("card", "amount", newCard.amount);
  };
  const onChangeNewNote = (e) => {
    setState("newNote", e.target.value);
  };
  const onSubmitNewNote = (e) => {
    if (!state.newNote) {
      return;
    }
    const newCard = updateCard(cardId, (card) => ({
      ...card,
      notes: [{ content: state.newNote, createdAt: Number(new Date()) }].concat(
        card.notes || []
      ),
    }));
    setState("card", "notes", newCard.notes);
    setState("newNote", "");
  };
  const onDeleteNote = (getIndex) => () => {
    const index = getIndex();
    const newCard = updateCard(cardId, (card) => ({
      ...card,
      notes: card.notes.slice(0, index).concat(card.notes.slice(index + 1)),
    }));
    setState("card", "notes", newCard.notes);
  };

  const card = state.card;

  return (
    <div class={`${card.used ? "used" : ""} item`}>
      <div class="buttons3">
        <button onClick={() => history.push("/cards")}>Back to List</button>
        <button onClick={onDeleteCard}>Delete</button>
        <button onClick={onToggleUsedCard}>
          Mark as {card.used ? "unused" : "used"}
        </button>
      </div>
      <Show when={state.displayConfirmDelete}>
        <div class="confirm-delete">
          <span>Are you sure you want to delete this card?</span>{" "}
          <span> Your card data will be lost</span>
          <div class="buttons">
            <button onClick={onCancelDeleteClick}>Cancel</button>
            <button onClick={onConfirmDeleteClick}>Delete</button>
          </div>
        </div>
      </Show>
      <Show
        when={
          !state.displayConfirmDelete &&
          state.requirePassword &&
          !state.submittedPassword
        }
      >
        <OnScreenKeyboard
          value={state.password}
          onInput={(value) => setState("password", "content", value)}
          onSubmit={onSubmitPassword}
        />
      </Show>
      <Show when={!state.displayConfirmDelete && state.card.id}>
        <div class="data">
          <h2>
            Card #{card.id} - {card.amount}
            {card.currency || ""}
          </h2>
          <a class="date" data-date={renderDate(new Date(card.createdAt))}>
            <Show when={new Date(card.createdAt)}>
              Added {prettyDate(card.createdAt)}
            </Show>
          </a>
          {String(card.barcode).match(/^data:image/) ? (
            <img src={card.barcode} alt="barcode" />
          ) : (
            <Barcode {...parseBarcode(card.barcode || card.number)} />
          )}

          <span class="card-number">
            {card.number &&
              [
                card.number.slice(0, 4),
                card.number.slice(4, 8),
                card.number.slice(8, 12),
                card.number.slice(12, 16),
                card.number.slice(16),
              ].join(" ")}
          </span>
          <span class="card-pin">
            <strong>PIN:</strong> {card.pin}
          </span>
        </div>
        <div class="operations">
          <div class="row">
            <div class="name">Amount:</div>
            <div class="input amount">
              <input
                type="number"
                step="any"
                value={card.amount}
                onInput={onChangeAmount}
              />
              <button>{card.currency || "?"}</button>
            </div>
          </div>
          <div class="row">
            <div class="name">Note:</div>
            <div class="input">
              <input
                type="text"
                value={state.newNote}
                onInput={onChangeNewNote}
              />
              <button onClick={onSubmitNewNote}>Submit</button>
            </div>
          </div>
        </div>
        <div class="notes">
          <For each={card.notes}>
            {(note, index) => (
              <div>
                <p>{note.content}</p>
                <a
                  class="date"
                  data-date={renderDate(new Date(note.createdAt))}
                >
                  <Show when={note.createdAt}>
                    Added {prettyDate(note.createdAt)}
                  </Show>
                </a>
                <a class="delete" onClick={onDeleteNote(index)}>
                  ✕
                </a>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};
