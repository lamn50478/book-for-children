// Thay vì: const socket = io();
const socket = io({
  auth: {
    userId: document.querySelector("[my-id]").getAttribute("my-id"),
    fullName: document.querySelector("[my-fullname]").getAttribute("my-fullname")
  }
});