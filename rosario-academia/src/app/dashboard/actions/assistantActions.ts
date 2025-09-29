"use server";

import { getServiceClient } from "@/utils/supabase/server";
import { assistantFormSchema } from "@/app/dashboard/admin/schemas/assistant-schema";
import { encodedRedirect } from "@/utils/utils";
import crypto from "crypto";
import { sendEmail } from "./reutilizableActions";

/**
 * Generate a random password.
 *
 * @param bytes - Number of random bytes to generate (default 16)
 * @returns A hex string representing the random password.
 */
const generateRandomPassword = (bytes = 16): string => crypto.randomBytes(bytes).toString("hex");

/**
 * Validate and parse formData using assistantFormSchema.
 *
 * @param formData - The form data to validate.
 * @returns The validated and parsed data.
 * @throws An error if the data is invalid.
 */
const validateAssistantData = (formData: unknown) => {
  const parsed = assistantFormSchema.safeParse(formData);
  if (!parsed.success) {
    throw new Error("Datos ingresados incorrectos");
  }
  return parsed.data;
};

/**
 * Helper function: withSupabase
 *
 * This function encapsulates the process of obtaining a Supabase client
 * and executing a provided callback with that client. This helps reduce
 * repetitive code when performing operations that require a Supabase client.
 *
 * @param callback - An async callback function that receives the Supabase client.
 * @returns The result of the callback.
 */
async function withSupabase<T>(
  callback: (supabase: Awaited<ReturnType<typeof getServiceClient>>) => Promise<T>,
): Promise<T> {
  // Retrieve the Supabase client (make sure to await if getServiceClient() returns a promise)
  const supabase = await getServiceClient();
  // Execute the callback with the client and return its result
  return callback(supabase);
}

/**
 * Check if a profile with the given DNI already exists.
 *
 * @param dni - The DNI to check for duplicates.
 * @throws An error if a duplicate DNI is found.
 */
const checkDuplicateDNI = async (dni: string) =>
  withSupabase(async (supabase) => {
    const { data } = await supabase.from("profiles").select("dni").eq("dni", dni);
    if (data && data.length > 0) {
      return {
        status: 400,
        message: "Ya existe un usuario con el DNI ingresado",
      };
    }
  });
/**
 * Check if a profile with the given email already exists.
 *
 * @param email - The email to check for duplicates.
 * @throws An error if a duplicate email is found.
 */
const checkDuplicateEmail = async (email: string) =>
  withSupabase(async (supabase) => {
    const { data } = await supabase.from("profiles").select("email").eq("email", email);
    if (data && data.length > 0) {
      return { status: 400, message: "Ya existe un usuario con el email ingresado" };
    }
  });

/**
 * Create an assistant user using the Supabase Admin API.
 *
 * @param email - The user's email.
 * @param phone - The user's phone.
 * @param defaultPassword - The password to assign to the new user.
 * @returns The created user object.
 * @throws An error if user creation fails.
 */
const createAssistantUser = async (email: string, phone: string, defaultPassword: string) =>
  withSupabase(async (supabase) => {
    const { data: user, error } = await supabase.auth.admin.createUser({
      email_confirm: true,
      email,
      password: defaultPassword,
      phone,
    });
    if (error || !user) {
      throw new Error("Error creando el usuario. Intente nuevamente.");
    }
    return user;
  });

/**
 * Create the profile for the assistant.
 *
 * @param userId - The ID of the created user.
 * @param data - The validated data for the assistant.
 * @throws An error if profile creation fails.
 */
const createAssistantProfile = async (
  userId: string,
  data: ReturnType<typeof validateAssistantData>,
) =>
  withSupabase(async (supabase) => {
    const { error } = await supabase.from("profiles").insert({
      id: userId,
      first_name: data.first_name,
      paternal_last_name: data.paternal_last_name,
      maternal_last_name: data.maternal_last_name,
      birth_date: data.birth_date,
      dni: data.dni,
      role: "auxiliar_administrativo",
      avatar_url: null,
      phone: data.phone,
      email: data.email,
    });
    if (error) {
      throw new Error("Error creando el perfil");
    }
  });

/**
 * Create the employee record for the assistant.
 *
 * @param userId - The ID of the created user.
 * @throws An error if creating the employee record fails.
 */
const createEmployeeRecord = async (userId: string) =>
  withSupabase(async (supabase) => {
    const { error } = await supabase.from("employees").insert({
      employee_id: userId,
    });
    if (error) {
      throw new Error("Error creando el empleado");
    }
  });

/**
 * Action for assistant sign-up.
 *
 * This function handles the entire sign-up process:
 * - Validate the incoming form data.
 * - Check for duplicate DNI.
 * - Create the assistant user.
 * - Create the assistant profile and employee record concurrently.
 * - Send an email with credentials.
 *
 * @param formData - The form data for sign-up.
 * @returns The validated data if successful, or an encoded redirect with error details.
 */
export const assistantSignUpAction = async (formData: unknown) => {
  try {
    const validatedData = validateAssistantData(formData);
    // Check if DNI already exists
    const checkDNI = await checkDuplicateDNI(validatedData.dni);

    if (checkDNI) {
      return checkDNI;
    }

    const checkEmail = await checkDuplicateEmail(validatedData.email);

    if (checkEmail) {
      return checkEmail;
    }

    // Generate a default random password for the user
    const defaultPassword = generateRandomPassword();

    // Create the user via Supabase Admin API
    const userResponse = await createAssistantUser(
      validatedData.email,
      validatedData.phone,
      defaultPassword,
    );
    const userId = userResponse.user.id;

    // Create profile and employee record concurrently using Promise.all
    await Promise.all([
      createAssistantProfile(userId, validatedData),
      createEmployeeRecord(userId),
    ]);

    // Send an email with the credentials to the assistant
    await sendEmail(
      validatedData.email,
      validatedData.first_name,
      defaultPassword,
      "auxiliar administrativo",
    );

    return validatedData;
  } catch (error: any) {
    console.error(error);
    return encodedRedirect("error", "/sign-up", error.message || "Error en el registro");
  }
};

/**
 * Action for updating an assistant's data.
 *
 * @param formData - The new data to update.
 * @param id - The assistant's user ID.
 * @returns The validated data if successful, or an error object.
 */
export const updateAssistantAction = async (formData: unknown, id: string) => {
  try {
    const validatedData = validateAssistantData(formData);

    await withSupabase(async (supabase) => {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: validatedData.first_name,
          paternal_last_name: validatedData.paternal_last_name,
          maternal_last_name: validatedData.maternal_last_name,
          birth_date: validatedData.birth_date,
          dni: validatedData.dni,
          phone: validatedData.phone,
        })
        .eq("id", id);
      if (error) {
        throw new Error("Error actualizando el perfil");
      }
    });
    return validatedData;
  } catch (error: any) {
    return { status: 400, message: error.message };
  }
};

/**
 * Action for deleting an assistant.
 *
 * @param id - The assistant's user ID.
 * @returns An object indicating success or failure.
 */
export const deleteAssistantAction = async (id: string) => {
  try {
    return await withSupabase(async (supabase) => {
      const { data, error } = await supabase.auth.admin.deleteUser(id);
      if (error || !data) {
        throw new Error("Error eliminando el auxiliar");
      }
      return { status: 200, message: "Auxiliar eliminado correctamente", id };
    });
  } catch (error: any) {
    console.error("Error deleting assistant", error);
    return { status: 500, message: error.message };
  }
};

/**
 * Action for retrieving the list of assistants.
 *
 * @returns The list of assistant profiles.
 */
export const getAssistantsAction = async () =>
  withSupabase(async (supabase) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "auxiliar_administrativo");
    if (error || !data) {
      throw new Error("Error obteniendo los auxiliares");
    }
    return data;
  });

/**
 * Action for retrieving the count of assistants.
 *
 * @returns The number of assistant profiles.
 */
export const getAssistantCount = async () => {
  try {
    return await withSupabase(async (supabase) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "auxiliar_administrativo");
      if (error || !data) {
        console.error("Error getting assistant count", error);
        return 0;
      }
      return data.length;
    });
  } catch (error) {
    console.error("Error in getAssistantCount", error);
    return 0;
  }
};
