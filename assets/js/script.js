import { realdb, ref, get, child } from "./config.js";
(() => {
  const sidebarOpen = document.getElementById("menu_open");
  const sidebarClose = document.getElementById("close_menu");

  sidebarOpen.addEventListener("click", () => {
    const sidebar = document.querySelector(".sidebar");
    sidebar.style.display = "flex";
  });

  sidebarClose.addEventListener("click", () => {
    const sidebar = document.querySelector(".sidebar");
    sidebar.style.display = "none";
  });

  document.addEventListener("DOMContentLoaded", () => {
    fetch("assets/localblog/blog.json")
      .then((response) => response.json())
      .then((data) => {
        const blogCardsContainer = document.getElementById("blog-cards");
        // const title_top = document.getElementById("title_top");
        data.blogs.forEach((blog) => {
          const card = document.createElement("div");
          card.classList.add("blog-card");
          card.innerHTML = `
            <img src="${blog.image}" alt="${blog.title}">
            <a><h2>${blog.title.substring(0, 70)}</h2></a>
            <p>${blog.description.substring(0, 82)}</p>
          `;

          card.addEventListener("click", () => {
            window.location.href = `Blog_Detils.html?id=${blog.id}`;
          });
          blogCardsContainer.appendChild(card);
          // title_top.innerText = blog.title;
        });

        initializeSlider();
      });

    function initializeSlider() {
      const blogCards = document.querySelector(".blog-cards");
      const prevBtn = document.querySelector(".prev-btn");
      const nextBtn = document.querySelector(".next-btn");
      let currentIndex = 0;

      prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateSlider();
        }
      });

      nextBtn.addEventListener("click", () => {
        if (currentIndex < blogCards.children.length - 1) {
          currentIndex++;
          updateSlider();
        }
      });

      function updateSlider() {
        const cardWidth = blogCards.children[0].getBoundingClientRect().width;
        blogCards.style.transform = `translateX(${
          -currentIndex * (cardWidth + 20)
        }px)`;
      }

      window.addEventListener("resize", updateSlider);
    }
  });

  const blogList = document.getElementById("productDiv");

  const dbRef = ref(realdb);

  get(child(dbRef, "blogs")).then((snapshot) => {
    if (snapshot.exists()) {
      const blogs = snapshot.val();
      for (let key in blogs) {
        const blog = blogs[key];
        const blogCard = document.createElement("div");
        blogCard.classList.add("card");

        blogCard.innerHTML = `
          <img class='thumb' onclick="viewBlog('${key}')"  src="${
          blog.mainImage
        }" alt="${blog.title}">
          <div class="card-content">
           <a> <h1 onclick="viewBlog('${key}')">${blog.title.substring(
          0,
          70
        )}</h1></a>
            <p onclick="viewBlog('${key}')">${blog.description.substring(
          0,
          150
        )}...</p>
          </div>
        `;
        blogList.appendChild(blogCard);
      }
    }
  });

  window.viewBlog = function (key) {
    window.location.href = `Blog_Detils.html?key=${key}`;
  };
})();
