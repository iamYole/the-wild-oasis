import supabase, { supabaseURL } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.log(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function deleteCabin(id) {
  const { error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.log(error);
    throw new Error("Cabin could not be deleted");
  }
}

export async function addCabin(newCabin) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseURL);
  // Save the date to the table
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    "",
  );

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseURL}/storage/v1/object/public/cabin-images/${imageName}`;
  // const imagePath = `${supabaseURL}/storage/v1/object/public/cabin-images/${imageName}`;

  // Add  a Cabin
  const { data, error } = await supabase
    .from("cabins")
    .insert([{ ...newCabin, image: imagePath }])
    .select();

  if (error) {
    console.log(error);
    throw new Error("Cabin could not be created");
  }

  if (hasImagePath) return data;

  // Upload the image to a Supabase bucket

  const { error: StorageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // delete data from table if file upload fails

  if (StorageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.log(StorageError);
    throw new Error(
      "Cabin image could not be uploaded, and the cabin was not created",
    );
  }

  return data;
}

export async function editCabin(newCabinData, id) {
  const hasImagePath = newCabinData.image?.startsWith?.(supabaseURL);
  // Save the date to the table
  const imageName = `${Math.random()}-${newCabinData.image?.name}`.replaceAll(
    "/",
    "",
  );
  const imagePath = hasImagePath
    ? newCabinData.image
    : `${supabaseURL}/storage/v1/object/public/cabin-images/${imageName}`;

  const { data, error } = await supabase
    .from("cabins")
    .update({ ...newCabinData, image: imagePath })
    .eq("id", id)
    .select();

  if (error) {
    console.log(error);
    throw new Error("Cabins could not be updated");
  }

  // No new image was selected, so skip uploading
  if (hasImagePath) return data;

  // Upload the image to a Supabase bucket
  const { error: StorageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabinData.image);

  // delete data from table if file upload fails

  if (StorageError) {
    // await supabase.from("cabins").delete().eq("id", data.id);
    console.log(StorageError);
    throw new Error("Cabin updated, but the image upload failed");
  }

  return data;
}
