/** Cover assets and creator/publisher destinations; provenance in docs/ASSET_MANIFEST.md. */
export interface BibliographyBook { title: string; cover: string; href: string; width: number; height: number; credit?: string; rendered?: boolean; }
export interface BibliographyCollection { title: string; books: BibliographyBook[]; }
export const sarahLibrary: BibliographyCollection[] = [
  {
    "title": "The Expeditioners",
    "books": [
      {
        "title": "The Treasure of Drowned Man’s Canyon",
        "cover": "/images/covers/book-1-front.jpg",
        "href": "/books/the-treasure-of-drowned-mans-canyon",
        "width": 880,
        "height": 1360
      },
      {
        "title": "The Secret of King Triton’s Lair",
        "cover": "/images/covers/book-2-front.jpg",
        "href": "/books/the-secret-of-king-tritons-lair",
        "width": 880,
        "height": 1360
      },
      {
        "title": "The Lost City of Maps",
        "cover": "/images/covers/book-3-front.jpg",
        "href": "/books/the-lost-city-of-maps",
        "width": 880,
        "height": 1360
      }
    ]
  },
  {
    "title": "Maggie D’Arcy",
    "books": [
      {
        "title": "The Mountains Wild",
        "cover": "/images/bibliography/the-mountains-wild.webp",
        "href": "https://www.sarahstewarttaylor.com/maggie-d-arcy-series",
        "rendered": false,
        "width": 428,
        "height": 650
      },
      {
        "title": "A Distant Grave",
        "cover": "/images/bibliography/a-distant-grave.webp",
        "href": "https://www.sarahstewarttaylor.com/maggie-d-arcy-series",
        "rendered": false,
        "width": 426,
        "height": 650
      },
      {
        "title": "The Drowning Sea",
        "cover": "/images/bibliography/the-drowning-sea.webp",
        "href": "https://www.sarahstewarttaylor.com/maggie-d-arcy-series",
        "rendered": false,
        "width": 424,
        "height": 650
      },
      {
        "title": "A Stolen Child",
        "cover": "/images/bibliography/a-stolen-child.webp",
        "href": "https://www.sarahstewarttaylor.com/maggie-d-arcy-series",
        "rendered": false,
        "width": 428,
        "height": 650
      }
    ]
  },
  {
    "title": "Sweeney St. George",
    "books": [
      {
        "title": "O’ Artful Death",
        "cover": "/images/bibliography/o-artful-death.webp",
        "href": "https://www.sarahstewarttaylor.com/sweeney-st-george",
        "rendered": false,
        "width": 302,
        "height": 499
      },
      {
        "title": "Mansions of the Dead",
        "cover": "/images/bibliography/mansions-of-the-dead.webp",
        "href": "https://www.sarahstewarttaylor.com/sweeney-st-george",
        "rendered": false,
        "width": 293,
        "height": 499
      },
      {
        "title": "Judgment of the Grave",
        "cover": "/images/bibliography/judgment-of-the-grave.webp",
        "href": "https://www.sarahstewarttaylor.com/sweeney-st-george",
        "rendered": false,
        "width": 192,
        "height": 320
      },
      {
        "title": "Still as Death",
        "cover": "/images/bibliography/still-as-death.webp",
        "href": "https://www.sarahstewarttaylor.com/sweeney-st-george",
        "rendered": false,
        "width": 312,
        "height": 499
      }
    ]
  },
  {
    "title": "Franklin Warren and Alice Bellows",
    "books": [
      {
        "title": "Agony Hill",
        "cover": "/images/bibliography/agony-hill.webp",
        "href": "https://us.macmillan.com/books/9781250826626/agony-hill",
        "rendered": false,
        "width": 428,
        "height": 650
      },
      {
        "title": "Hunter’s Heart Ridge",
        "cover": "/images/bibliography/hunters-heart-ridge.webp",
        "href": "https://us.macmillan.com/books/9781250370730/huntersheartridge",
        "rendered": false,
        "width": 428,
        "height": 650
      }
    ]
  },
  {
    "title": "More by Sarah",
    "books": [
      {
        "title": "Amelia Earhart: This Broad Ocean",
        "cover": "/images/bibliography/amelia-earhart.webp",
        "href": "https://www.sarahstewarttaylor.com/other-books",
        "credit": "Illustrated by Ben Towle",
        "rendered": false,
        "width": 344,
        "height": 499
      },
      {
        "title": "Mud Season",
        "cover": "/images/bibliography/mud-season.webp",
        "href": "https://us.macmillan.com/books/9781250378552/mudseason/",
        "credit": "A Bethany, Vermont story",
        "rendered": false,
        "width": 487,
        "height": 650
      }
    ]
  }
];
export const katherineLibrary: BibliographyCollection[] = [
  {
    "title": "Written and illustrated by Katherine Roy",
    "books": [
      {
        "title": "Neighborhood Sharks",
        "cover": "/images/bibliography/neighborhood-sharks.webp",
        "href": "https://www.katherineroy.com/sharks",
        "rendered": true,
        "width": 488,
        "height": 650
      },
      {
        "title": "How to Be an Elephant",
        "cover": "/images/bibliography/how-to-be-an-elephant.webp",
        "href": "https://www.katherineroy.com/elephants",
        "rendered": true,
        "width": 488,
        "height": 650
      },
      {
        "title": "Making More",
        "cover": "/images/bibliography/making-more.webp",
        "href": "https://www.katherineroy.com/makingmore",
        "rendered": true,
        "width": 488,
        "height": 650
      }
    ]
  },
  {
    "title": "Illustrated by Katherine Roy",
    "books": [
      {
        "title": "Otis and Will Discover the Deep",
        "cover": "/images/bibliography/otis-and-will.webp",
        "href": "https://www.katherineroy.com/otisandwill",
        "credit": "By Barb Rosenstock",
        "rendered": true,
        "width": 488,
        "height": 650
      },
      {
        "title": "Red Rover",
        "cover": "/images/bibliography/red-rover.webp",
        "href": "https://www.katherineroy.com/redrover",
        "credit": "By Richard Ho",
        "rendered": true,
        "width": 517,
        "height": 650
      },
      {
        "title": "The Fire of Stars",
        "cover": "/images/bibliography/the-fire-of-stars.webp",
        "href": "https://www.katherineroy.com/fireofstars",
        "credit": "By Kirsten W. Larson",
        "rendered": true,
        "width": 650,
        "height": 496
      },
      {
        "title": "Sea Without a Shore",
        "cover": "/images/bibliography/sea-without-a-shore.webp",
        "href": "https://www.katherineroy.com/seawithoutashore",
        "credit": "By Barb Rosenstock",
        "rendered": true,
        "width": 488,
        "height": 650
      },
      {
        "title": "Chasing Eruptions",
        "cover": "/images/bibliography/chasing-eruptions.webp",
        "href": "https://www.katherineroy.com/chasingeruptions",
        "credit": "By Curtis Manley",
        "rendered": true,
        "width": 474,
        "height": 650
      }
    ]
  },
  {
    "title": "The Expeditioners",
    "books": [
      {
        "title": "The Treasure of Drowned Man’s Canyon",
        "cover": "/images/covers/book-1-front.jpg",
        "href": "/books/the-treasure-of-drowned-mans-canyon",
        "credit": "By S. S. Taylor",
        "width": 880,
        "height": 1360
      },
      {
        "title": "The Secret of King Triton’s Lair",
        "cover": "/images/covers/book-2-front.jpg",
        "href": "/books/the-secret-of-king-tritons-lair",
        "credit": "By S. S. Taylor",
        "width": 880,
        "height": 1360
      }
    ]
  }
];
