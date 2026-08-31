# Recipes

A fullstack application for managing personal cooking recipes: browsing, searching, and editing recipes with images.

## Language

**User**:
An individual authenticated via Clerk. Owns a private collection of Recipes.
_Avoid_: Account, member

**Recipe**:
A single dish's instructions: title, ingredients, ordered steps, servings, time, tags, and images. Owned by exactly one User; not shared or visible to other Users in v1.
_Avoid_: Dish, meal (a Recipe describes how to make a dish; it is not the dish itself)

**Ingredient**:
A structured line item on a Recipe: an amount, a unit, and a name (e.g. "2, cups, flour"). The amount is optional, for entries like "salt, to taste".
_Avoid_: Item

**Tag**:
A free-form label a User attaches to a Recipe for filtering and search (e.g. "vegan", "quick"). Not drawn from a fixed category list.
_Avoid_: Category, label

**Cover Image**:
The one Image, among a Recipe's Gallery, designated to represent the Recipe in list views.
_Avoid_: Thumbnail (a Thumbnail is a rendering of an Image, not a distinct concept)

**Gallery**:
The ordered collection of Images belonging to a Recipe.
_Avoid_: Photos, pictures

**Prep Time**:
How long a Recipe takes to prepare before cooking begins. Stored separately from Cook Time; not summed into a stored "total time".
_Avoid_: Total time

**Cook Time**:
How long a Recipe takes to actively cook, once prep is done. Stored separately from Prep Time.
_Avoid_: Total time
