import supabase, { supabaseURL } from "../services/supabase";

export async function signUp({ fullname, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { fullname, avatar: "" } },
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();

  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);

  // return data;
  return data?.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) throw new Error(error.message);
}

export async function updateCurrentUser({ password, fullname, avatar }) {
  // update the current user
  let updateData;
  if (password) updateData = { password };
  if (fullname) updateData = { data: { fullname } };

  const { data, error } = await supabase.auth.updateUser(updateData);
  if (error) throw new Error(error.message);
  // console.log(error);
  if (!avatar) return data;

  // upload the avatar
  const fileName = `avatar-${data.user.id}-${Math.random()}`;
  const { error: storageError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatar);

  if (storageError) throw new Error(storageError.message);

  // if the previous operation is successful, update the user
  const { data: updatedUser, error: updateError } =
    await supabase.auth.updateUser({
      data: {
        avatar: `${supabaseURL}/storage/v1/object/public/avatars/${fileName}`,
      },
    });

  if (updateError) throw new Error(updateError.message);

  return updatedUser;
}
