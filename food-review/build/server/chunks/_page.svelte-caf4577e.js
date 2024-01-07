import { c as create_ssr_component, v as validate_component, b as each, d as add_attribute, e as escape, i as is_promise, n as noop } from './ssr-bc1c205b.js';
import { w as writable } from './index-6f70483f.js';

const imageStore = writable({
  photos: [],
  infos: []
});
const avgRatingStore = writable({});
const css$5 = {
  code: ".form-container.svelte-13a1nx8{max-width:500px;margin:0 auto;padding:20px;background:#eee;border-radius:10px}.form-control.svelte-13a1nx8{display:flex;flex-direction:column;margin-bottom:10px}label.svelte-13a1nx8{font-weight:bold}input.svelte-13a1nx8,textarea.svelte-13a1nx8{padding:10px;border-radius:5px;border:1px solid #ccc}",
  map: null
};
const PhotoCreate = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let title = "";
  $$result.css.add(css$5);
  return `<div class="form-container svelte-13a1nx8"><form id="uploadForm"> <div class="form-control svelte-13a1nx8"><label for="title" class="svelte-13a1nx8" data-svelte-h="svelte-kpfkpc">Title:</label> <input id="title" class="svelte-13a1nx8"${add_attribute("value", title, 0)}></div>  <div class="form-control svelte-13a1nx8"><label for="desc" class="svelte-13a1nx8" data-svelte-h="svelte-yzlbq7">Description:</label> <textarea id="desc" class="svelte-13a1nx8">${escape("")}</textarea></div>  <div class="form-control svelte-13a1nx8"><label for="image" class="svelte-13a1nx8" data-svelte-h="svelte-1m41r27">Upload Image:</label> <input type="file" id="imageInput" class="svelte-13a1nx8"></div>  <button type="submit" id="submitBtn" data-svelte-h="svelte-1wgguaz">Submit</button></form> <div id="uploadStatus"></div> </div>`;
});
const css$4 = {
  code: ".star.svelte-5wo2q9{cursor:pointer;font-size:25px;background:none;border:none}.rating.svelte-5wo2q9{display:inline-block;vertical-align:top}textarea.svelte-5wo2q9{width:500px;height:100px;margin-bottom:10px;padding:10px;font-family:Arial;object-fit:cover;display:inline-block;vertical-align:top}.submit-btn.svelte-5wo2q9{background:#6c0000;color:white;border:none;border-radius:5px;padding:8px 20px;font-size:16px;cursor:pointer}.review-container.svelte-5wo2q9{margin-bottom:20px;padding-bottom:20px}",
  map: null
};
const ReviewCreate = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { photoId } = $$props;
  let rating = 0;
  if ($$props.photoId === void 0 && $$bindings.photoId && photoId !== void 0)
    $$bindings.photoId(photoId);
  $$result.css.add(css$4);
  return `<div class="review-container svelte-5wo2q9"><form><div class="review-content"><textarea placeholder="Write your review here..." class="svelte-5wo2q9">${escape("")}</textarea></div> <div class="rating svelte-5wo2q9">${each([1, 2, 3, 4, 5], (star) => {
    return `<button type="button" class="star svelte-5wo2q9">${escape(star <= rating ? "⭐" : "☆")} </button>`;
  })}</div> <button class="submit-btn svelte-5wo2q9" data-svelte-h="svelte-7zxfnz">Add Review</button></form> </div>`;
});
const css$3 = {
  code: ".reviews.svelte-jeccma{list-style:none;padding:0;margin:0}.review.svelte-jeccma{margin-bottom:20px}.review-content.svelte-jeccma{padding:10px;background:#eee;border-radius:4px}.reviewer.svelte-jeccma{font-size:0.9em;color:#777}.spacer.svelte-jeccma{margin-left:30px;display:inline-block}.submit-btn.svelte-jeccma{background:#6c0000;color:white;border:none;border-radius:5px;padding:4px 10px;font-size:0.9em;cursor:pointer}",
  map: null
};
const ReviewList = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { reviews = [] } = $$props;
  let { photoId } = $$props;
  let deletedReviewId;
  if ($$props.reviews === void 0 && $$bindings.reviews && reviews !== void 0)
    $$bindings.reviews(reviews);
  if ($$props.photoId === void 0 && $$bindings.photoId && photoId !== void 0)
    $$bindings.photoId(photoId);
  $$result.css.add(css$3);
  return `<ul class="reviews svelte-jeccma">${each(reviews, (review) => {
    return `<li class="review svelte-jeccma"><div class="review-content svelte-jeccma">${escape(review.content)}</div> <div class="reviewer svelte-jeccma">- User ${escape(review.id)} <span class="spacer svelte-jeccma"></span> Rated: ${escape(review.rating)}/5
				<span class="spacer svelte-jeccma"></span> <button class="submit-btn svelte-jeccma" data-svelte-h="svelte-163rahe">Edit</button> <button class="submit-btn svelte-jeccma" data-svelte-h="svelte-1ji20x2">Delete</button> ${deletedReviewId === review.id ? `<p>Successfully deleted ${escape(review.id)}! Loading...</p>` : ``}</div> </li>`;
  })} </ul>`;
});
const css$2 = {
  code: "hr.svelte-h23jd2{height:8px;background-color:#c4c2c2;border:none;border-radius:4px}img.svelte-h23jd2{width:500px;height:500px;object-fit:cover}.flex.svelte-h23jd2{display:flex;gap:20px}",
  map: null
};
const PhotoList = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let photos = [];
  let infos = [];
  let avgRatings = {};
  imageStore.subscribe((store) => {
    photos = store.photos;
    infos = store.infos;
  });
  avgRatingStore.subscribe((ratings) => {
    avgRatings = ratings;
  });
  async function loadAverageRating(photoId) {
    const res = await fetch(`http://localhost:4001/photos/${photoId}/reviews`);
    const data = await res.json();
    avgRatingStore.update((ratings) => {
      ratings[photoId] = data.averageRating;
      return ratings;
    });
  }
  $$result.css.add(css$2);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<div>${photos.length ? `${each(photos, (photo) => {
      return ` ${function(__value) {
        if (is_promise(__value)) {
          __value.then(null, noop);
          return ` <p data-svelte-h="svelte-qdsr2u">Loading...</p> `;
        }
        return function(info) {
          return ` <h3>${escape(info.title)}</h3> <p>${escape(info.description)}</p> <div class="flex svelte-h23jd2"> <img src="${"http://localhost:4000/photos/" + escape(photo._id, true)}"${add_attribute("alt", photo.title, 0)} class="svelte-h23jd2">  ${function(__value2) {
            if (is_promise(__value2)) {
              __value2.then(null, noop);
              return ` <p data-svelte-h="svelte-p8tsjc">Loading ratings...</p> `;
            }
            return function(data) {
              return ` <p>Average Rating: ${escape(avgRatings[photo._id])}</p> `;
            }();
          }(loadAverageRating(photo._id))}  <div>${validate_component(ReviewCreate, "ReviewCreate").$$render(
            $$result,
            { photoId: photo._id },
            {
              photoId: ($$value) => {
                photo._id = $$value;
                $$settled = false;
              }
            },
            {}
          )} ${validate_component(ReviewList, "ReviewList").$$render(
            $$result,
            {
              reviews: info.reviews,
              photoId: photo._id
            },
            {
              photoId: ($$value) => {
                photo._id = $$value;
                $$settled = false;
              }
            },
            {}
          )} </div></div> `;
        }(__value);
      }(infos[photo._id])} <hr class="svelte-h23jd2">`;
    })}` : `<p data-svelte-h="svelte-1i57nq3">Empty post. Perhaps post a new picture of your food? 🧑‍🍳</p>`} </div>`;
  } while (!$$settled);
  return $$rendered;
});
const logo = "/_app/immutable/assets/UMass_Amherst_Athletics_logo.2b5d704b.png";
const css$1 = {
  code: ".main-nav.svelte-1gbkc03{background:#6c0000;color:white;padding:10px;display:flex;justify-content:space-between;align-items:center}a.svelte-1gbkc03{color:white;font-family:'Arial', sans-serif;text-decoration:none;font-weight:bold}.logo-img.svelte-1gbkc03{width:80px;height:60px}.nav-links.svelte-1gbkc03{display:flex;align-items:center}ul.svelte-1gbkc03{display:flex;list-style:none}li.svelte-1gbkc03{padding:0 30px}.title.svelte-1gbkc03{color:white;text-decoration:none;font-weight:bold;font-size:30px;margin-right:200px;font-family:'Arial', sans-serif}.nav-button.svelte-1gbkc03{background:none;color:white;border:none;font-family:'Arial', sans-serif;font-weight:bold;font-size:16px;cursor:pointer}",
  map: null
};
const Nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { togglePostForm } = $$props;
  if ($$props.togglePostForm === void 0 && $$bindings.togglePostForm && togglePostForm !== void 0)
    $$bindings.togglePostForm(togglePostForm);
  $$result.css.add(css$1);
  return `<nav class="main-nav svelte-1gbkc03"><a href="/" class="svelte-1gbkc03" data-svelte-h="svelte-1ul27by"><img${add_attribute("src", logo, 0)} alt="UMass Food Reviews" class="logo-img svelte-1gbkc03"></a>  <ul class="svelte-1gbkc03"><div class="nav-links svelte-1gbkc03"><li class="svelte-1gbkc03" data-svelte-h="svelte-zebvt1"><h class="title svelte-1gbkc03">UMass Food Review</h></li> <li class="svelte-1gbkc03" data-svelte-h="svelte-1huopth"><a href="/" class="svelte-1gbkc03">Home</a></li>  <li class="svelte-1gbkc03"><button class="nav-button svelte-1gbkc03" data-svelte-h="svelte-xw9ep3">Create</button></li> <li class="svelte-1gbkc03" data-svelte-h="svelte-1bc9el4"><a href="/about" class="svelte-1gbkc03">About</a></li> <li class="svelte-1gbkc03" data-svelte-h="svelte-sa8932"><a href="/donate" class="svelte-1gbkc03">Donate</a></li></div></ul> </nav>`;
});
const css = {
  code: ".post-form.svelte-2lwe55{padding:20px;background:#eee;border:1px solid #ddd;border-radius:4px}",
  map: null
};
const App = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let showPostForm = false;
  function togglePostForm() {
    showPostForm = !showPostForm;
  }
  $$result.css.add(css);
  return `${validate_component(Nav, "Nav").$$render($$result, { togglePostForm }, {}, {})}  ${showPostForm ? `<div class="post-form svelte-2lwe55"><h2 data-svelte-h="svelte-1gykm93">Create a post</h2> ${validate_component(PhotoCreate, "PhotoCreate").$$render($$result, {}, {}, {})}</div>` : ``} ${validate_component(PhotoList, "PhotoList").$$render($$result, {}, {}, {})}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(App, "App").$$render($$result, {}, {}, {})}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-caf4577e.js.map
