var VIDEO_FILES = [

  "video/closet-youtube-snap.mp4",

 "video/sweatblock-deoderant.mp4",

  "video/golden-golen.mp4",
  
  "video/garnik-unboxing.mp4",

];

var PHOTO_FILES = [

  "photos/ice-breakers.jpg",
  "photos/Screenshot_20260414_153454_Gallery.jpg",
  "photos/Screenshot_20260414_150747_Gallery.jpg",
  "photos/Screenshot_20260414_150847_Gallery.jpg",

  "photos/Screenshot_20260414_153346_Gallery.jpg",
 
  "photos/vitamin-b-12.jpg",
  "photos/Screenshot_20260414_150959_Gallery.jpg",
  "photos/Screenshot_20260414_153521_Gallery.jpg",
  "photos/rio-cream-side.jpg",
  "photos/Screenshot_20260414_151010_Gallery.jpg",
  "photos/Screenshot_20260414_153506_Gallery.jpg",
  "photos/Screenshot_20260414_153400_Gallery.jpg",

  "photos/Screenshot_20260414_150708_Gallery.jpg",
  "photos/Screenshot_20260414_153253_Gallery.jpg",

  "photos/Screenshot_20260414_153330_Gallery.jpg",
  "photos/vitamin-b-12-blue.jpg"
];

function filenameFromPath(path) {
  return path.split("/").pop() || path;
}

function labelFromFilename(name) {
  var base = name.replace(/\.[^.]+$/, "");
  return base.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

function mountNavToggle() {
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("nav-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", function () {
    var open = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function createVideoTile(src, index) {
  var tile = document.createElement("div");
  tile.className = "media-tile media-tile--video";

  var video = document.createElement("video");
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("loop", "");
  video.setAttribute("preload", "none");
  video.dataset.src = src;
  video.tabIndex = 0;

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "media-tile-ctrl";
  btn.textContent = "Controls";
  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    if (video.hasAttribute("controls")) {
      video.removeAttribute("controls");
      btn.textContent = "Controls";
    } else {
      video.setAttribute("controls", "");
      btn.textContent = "Hide";
    }
  });

  var caption = document.createElement("div");
  caption.className = "media-tile-caption";

  var strong = document.createElement("strong");
  strong.textContent = labelFromFilename(filenameFromPath(src));

  var span = document.createElement("span");
  span.textContent = "Video " + String(index + 1).padStart(2, "0");

  caption.appendChild(strong);
  caption.appendChild(span);

  tile.appendChild(video);
  tile.appendChild(btn);
  tile.appendChild(caption);

  function togglePlay() {
    if (!video.src) return;
    if (video.paused) video.play().catch(function () {});
    else video.pause();
  }

  tile.addEventListener("click", togglePlay);
  tile.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      togglePlay();
    }
  });

  return { tile: tile, video: video };
}

function createPhotoTile(src, index) {
  var tile = document.createElement("a");
  tile.className = "media-tile media-tile--photo";
  tile.href = src;
  tile.target = "_blank";
  tile.rel = "noopener";
  tile.setAttribute("aria-label", "Open photo " + (index + 1));

  var img = document.createElement("img");
  img.loading = "lazy";
  img.decoding = "async";
  img.alt = "Portfolio photo " + (index + 1);
  img.src = src;

  tile.appendChild(img);
  return tile;
}

function mountVideos() {
  var grid = document.getElementById("video-grid");
  if (!grid) return;

  var items = VIDEO_FILES.map(function (src, idx) {
    return createVideoTile(src, idx);
  });

  items.forEach(function (it) {
    grid.appendChild(it.tile);
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        var video = entry.target;
        if (entry.isIntersecting) {
          if (!video.src) {
            // encodeURI handles spaces in filenames
            video.src = encodeURI(video.dataset.src || "");
          }
          video.play().catch(function () {});
        } else {
          video.pause();
        }
      });
    },
    { rootMargin: "200px 0px", threshold: 0.15 }
  );

  items.forEach(function (it) {
    observer.observe(it.video);
  });
}

function mountPhotos() {
  var grid = document.getElementById("photo-grid");
  if (!grid) return;

  PHOTO_FILES.forEach(function (src, idx) {
    grid.appendChild(createPhotoTile(src, idx));
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var year = document.getElementById("y");
  if (year) year.textContent = new Date().getFullYear();

  mountNavToggle();
  mountVideos();
  mountPhotos();
});
