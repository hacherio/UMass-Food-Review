// stores.js

import { writable } from 'svelte/store';

export const imageStore = writable({
  photos: [], infos: []
});

export const avgRatingStore = writable({});
