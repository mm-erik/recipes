# Recipes

A platform where users create and manage their own cooking recipes, including step-by-step instructions and photos.

## Language

**Recipe**:
A single dish a User has authored: title, description, RecipeIngredients, Steps, Images (with one Thumbnail), prep time, cook time, and servings. Visible only to its owning User.
_Avoid_: Dish, meal

**Ingredient**:
A named foodstuff (e.g. "Flour"), shared and normalized across all Recipes. Referenced by RecipeIngredient lines rather than duplicated per Recipe.
_Avoid_: Item

**RecipeIngredient**:
One line item within a Recipe: a reference to an Ingredient, a numeric quantity, and a Unit chosen from a fixed set. This is where the Recipe-specific amount lives.
_Avoid_: Ingredient line, Ingredient (when the amount, not the foodstuff, is meant)

**Unit**:
The fixed, enumerated set of measurement units a RecipeIngredient's quantity is expressed in (e.g. grams, cups, tsp).

**User**:
A person who owns Recipes. Authenticated via Clerk; mirrored into a local Postgres record (via webhook) so Recipes and Images can foreign-key against a stable local id.

**Image**:
A photo uploaded to a Recipe. Exactly one Image per Recipe is the Thumbnail; the rest are ordered by upload order and paired positionally with the Recipe's Steps (1st non-Thumbnail Image with 1st Step, and so on). Counts need not match — surplus Steps have no Image, surplus Images stay unpaired.

**Thumbnail**:
The one Image per Recipe flagged as its cover image. Excluded from the Step-pairing order.

**Step**:
One instruction in a Recipe's ordered sequence. May have a paired Image (see Image).
