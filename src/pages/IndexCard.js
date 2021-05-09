import { For, createEffect, createState, useContext } from "solid-js";
import { useHistory } from "solid-router";
import "./IndexItem.css";
import { importLinkCard, loadCards, updateCard } from "../logic/Card";
import { StoreContext } from "../components/StoreProvider";

const filterLabels = ["all", "unused", "used"];
const filters = {
  all: Boolean,
  used: (card) => card.used,
  unused: (card) => !card.used,
};
const sortLabels = ["name", "date"];
const sorts = {
  name: "id",
  date: "createdAt",
};

export default () => {
  const history = useHistory();
  const { notify } = useContext(StoreContext)[1];
  const [state, setState] = createState({
    cards: [],
    sort: sortLabels[0],
    sortDirection: -1,
    filter: filterLabels[0],
  });
  createEffect(() => {
    const cardData = global.location.hash.slice(1);
    if (cardData.length) {
      const newCard = importLinkCard(cardData);
      notify(`Added card #${newCard.id}`);
      global.location.hash = "";
    }

    setState(
      "cards",
      loadCards({
        sort: sorts[state.sort],
        sortDirection: state.sortDirection,
        filter: filters[state.filter],
      })
    );
  });

  const onToggleUsedCard = (targetId) => () => {
    const card = updateCard(targetId, (card) => ({
      ...card,
      used: !card.used,
    }));
    setState("cards", ({ id }) => id === targetId, card);
  };

  const onToggleFilter = () => {
    const filterIndex = filterLabels.findIndex(
      (label) => label === state.filter
    );
    const nextFilter = filterLabels[(filterIndex + 1) % filterLabels.length];
    setState("filter", nextFilter);
  };
  const onToggleSort = () => {
    const sortIndex = sortLabels.findIndex((label) => label === state.sort);
    const nextSort = sortLabels[(sortIndex + 1) % sortLabels.length];
    setState("sort", nextSort);
  };
  const onToggleSortDirection = () => {
    setState("sortDirection", state.sortDirection === -1 ? 1 : -1);
  };

  return (
    <div>
      <ul class="item-list">
        <li class="sort-menu">
          <button onClick={onToggleFilter}>show {state.filter}</button>
          <button onClick={onToggleSort}>sort by {state.sort}</button>
          <button onClick={onToggleSortDirection}>
            {state.sortDirection > 0 ? "▲" : "▼"}
          </button>
        </li>

        <For each={state.cards} fallback={<div class="no-items">No Cards</div>}>
          {(card) => (
            <li class={`${card.used ? "used" : ""}`}>
              <span
                onClick={() =>
                  history.push(`/cards/${global.encodeURIComponent(card.id)}`)
                }
              >
                Card #{card.id} -
                <span>
                  {" "}
                  {card.amount}
                  {card.currency || ""}
                </span>
              </span>
              <button onClick={onToggleUsedCard(card.id)}>
                Mark {card.used ? "unused" : "used"}
              </button>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
};
