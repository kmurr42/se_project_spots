const initialCards = [
  {
    name: "A very long bridge, over the forest and through the trees",
    baseUrl:
      "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
];

import Api from "../utils/Api.js";
import avatar from "../images/avatar.jpg";
import "../pages/index.css";
import logo from "../images/Logo.svg";
import editIcon from "../images/edit-profile.svg";
document.querySelector(".header__logo").src = logo;
document.querySelector(".profile__avatar").src = avatar;
document.querySelector(".profile__edit-icon").src = editIcon;
import {
  enableValidation,
  resetValidation,
  settings,
} from "../scripts/validation.js";
import { data } from "autoprefixer";
enableValidation(settings);

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "43f7b8d4-0fb3-4b16-a6ce-870525030cb8",
    "Content-Type": "application/json",
  },
});

const avatarModal = document.querySelector("#edit-avatar-modal");

let selectedCard;
let selectedCardId;
// const deleteModal = document.querySelector("#delete-modal");

// const deleteForm = deleteModal.querySelector(".modal__form");

// Profile elements
const editProfileBtn = document.querySelector(".profile__edit");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileForm = editProfileModal.querySelector(".modal__form");

const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input",
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input",
);

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__subtitle");

// New post elements
const newPostBtn = document.querySelector(".profile__add");
const newPostModal = document.querySelector("#new-post-modal");
const newPostForm = newPostModal.querySelector(".modal__form");
const newPostImageLinkInput = newPostModal.querySelector("#card-image-input");
const newPostCaptionInput = newPostModal.querySelector("#card-caption-input");

// console.log(deleteModal);
console.log(editProfileModal);
console.log(newPostModal);

// Preview modal
const previewModal = document.querySelector("#preview-modal");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewNameEl = previewModal.querySelector(".modal__caption");

// Cards
const cardsList = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template").content;

// Create card element
function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const card = cardElement.querySelector(".card");

  const cardTitleEl = card.querySelector(".card__title");
  const cardImageEl = card.querySelector(".card__img");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  const cardLikeBtnEl = card.querySelector(".card__like-button");
  cardLikeBtnEl.addEventListener("click", () => {
    const isLiked = cardLikeBtnEl.classList.contains(
      "card__like-button_active",
    );

    if (data.isLiked) {
      cardLikeBtnEl.classList.add("card__like-button_active");
    }
    api
      .changeLikeStatus(data._id, isLiked)
      .then((updatedCard) => {
        cardLikeBtnEl.classList.toggle(
          "card__like-button_active",
          updatedCard.isLiked,
        );
      })
      .catch(console.error);
  });
  const deleteModal = card.querySelector(".card__delete-button");
  deleteModal.addEventListener("click", () => {
    handleDeleteCard(card, data);
  });

  function handleDeleteCard(cardElement, data) {
    selectedCard = cardElement;
    selectedCardId = data._id;

    openModal(deleteModal);
  }

  function handleDeleteSubmit(evt) {
    evt.preventDefault();

    // const submitButton = deleteForm.querySelector(".modal__submit-btn");

    submitButton.textContent = "Deleting...";

    api
      .removeCard(selectedCardId)
      .then(() => {
        selectedCard.remove();

        closeModal(deleteModal);
      })
      .catch(console.error)
      .finally(() => {
        submitButton.textContent = "Delete";
      });
  }

  // deleteForm.addEventListener("submit", handleDeleteSubmit);

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewNameEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

let activeModal = null;

function handleEscapeKey(event) {
  if (event.key === "Escape" && activeModal) {
    closeModal(activeModal);
  }
}

function openModal(modal) {
  activeModal = modal;
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscapeKey);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscapeKey);
  activeModal = null;
}

// Edit profile
editProfileBtn.addEventListener("click", () => {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(editProfileForm, settings);
  openModal(editProfileModal);
});

// Select all close buttons that should close a modal
const closeButtons = document.querySelectorAll(".modal__close-btn");

// Attach a listener to each one
closeButtons.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => {
    closeModal(modal);
  });
});

// Close modal when clicking the overlay
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target === modal) {
      closeModal(modal);
    }
  });
});

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

newPostBtn.addEventListener("click", () => {
  newPostForm.reset();
  resetValidation(newPostForm, settings);
  openModal(newPostModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  const submitButton = editProfileForm.querySelector(".modal__submit-btn");

  submitButton.textContent = "Saving...";

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((userData) => {
      profileNameEl.textContent = userData.name;
      profileDescriptionEl.textContent = userData.about;

      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      submitButton.textContent = "Save";
    });
}

function handleNewPostSubmit(evt) {
  evt.preventDefault();

  api
    .addCard({
      name: newPostCaptionInput.value,
      link: newPostImageLinkInput.value,
    })
    .then((data) => {
      renderCard(data);
      newPostForm.reset();
      closeModal(newPostModal);
    });
}

newPostForm.addEventListener("submit", handleNewPostSubmit);

function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  cardsList[method](cardElement);
}

api
  .getAppInfo()
  .then(([userData, cards]) => {
    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;

    document.querySelector(".profile__avatar").src = userData.avatar;

    cards.forEach((card) => {
      renderCard(card, "append");
    });
  })
  .catch(console.error);
