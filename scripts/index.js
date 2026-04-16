const editProfileBtn = document.querySelector(".profile__edit");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");

const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input",
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input",
);

const newPostBtn = document.querySelector(".profile__add");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostForm = newPostModal.querySelector(".modal__form");
const newPostImageLinkInput = newPostModal.querySelector("#card-image-input");
const newPostCaptionInput = newPostModal.querySelector(
  "#profile-description-input",
);

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__subtitle");

// OPEN / CLOSE MODALS
editProfileBtn.addEventListener("click", () => {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  editProfileModal.classList.add("modal_is-opened");
});

editProfileCloseBtn.addEventListener("click", () => {
  editProfileModal.classList.remove("modal_is-opened");
});

newPostBtn.addEventListener("click", () => {
  newPostModal.classList.add("modal_is-opened");
});

newPostCloseBtn.addEventListener("click", () => {
  newPostModal.classList.remove("modal_is-opened");
});

// FORM HANDLERS
editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
  editProfileModal.classList.remove("modal_is-opened");
});

newPostForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  console.log(
    "New post:",
    newPostImageLinkInput.value,
    newPostCaptionInput.value,
  );
  newPostModal.classList.remove("modal_is-opened");
});
