let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  const toyForm = document.querySelector(".add-toy-form");
  toyForm.addEventListener("submit", handleSubmit);

  function renderToyCard(toy) {
    const div = document.createElement("div");
    const h2 = document.createElement("h2");
    const img = document.createElement("img");
    const p = document.createElement("p");
    const likeButton = document.createElement("button");
    const dislikeButton = document.createElement("button");
    div.className = "card";
    h2.textContent = toy.name;
    img.src = toy.image;
    img.className = "toy-avatar";
    p.className = "toy-text";
    p.textContent = `${toy.likes} likes`;

    likeButton.className = "like-btn";
    likeButton.textContent = "like";
    likeButton.id = toy.id;
    likeButton.addEventListener("click", () => {
      toy.likes += 1;
      if(toy.likes < 0)
        p.style.color = "red";
      else if(toy.likes > 0)
        p.style.color = "green";
      else
        p.style.color = "black";
      p.textContent = `${toy.likes} likes`;
      updateLikes(toy);
    });

    dislikeButton.className = "like-btn";
    dislikeButton.textContent = "dislike";
    dislikeButton.id = toy.id;
    dislikeButton.addEventListener("click", () => {
      toy.likes -= 1;
      if(toy.likes < 0)
        p.style.color = "red";
      else if(toy.likes > 0)
        p.style.color = "green";
      else
        p.style.color = "black";
      p["animation-name"] = "grow";
      p["animation-duration"] = "4s";
      p.textContent = `${toy.likes} likes`;
      updateLikes(toy);
    });

    div.appendChild(h2);
    div.appendChild(img);
    div.appendChild(p);
    div.appendChild(likeButton);
    div.appendChild(dislikeButton);

    document.querySelector("#toy-collection").appendChild(div);
  }

  function handleSubmit(e) {
    e.preventDefault();
    let toy = {
      name: e.target.name.value,
      image: e.target.image.value,
      likes: 0,
    };
    newToy(toy);
    renderToyCard(toy);
  }


  function getToys() {
    fetch("http://localhost:3000/toys")
    .then((response) => response.json())
    .then((toys) => toys.forEach(toy => renderToyCard(toy)));
  }

  function newToy(toy) {
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(toy)
    })
    .then(result => result.json())
    .then(toy => console.log(toy));
  }

  function updateLikes(toy) {
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(toy),
    })
    .then(response => response.json())
    .then(toy => console.log(toy));
  }

  getToys();
});
