'use server'

import { Payment } from 'mercadopago'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { MP } from '@/app/dashboard/athlete'

/**
 * Retrieves an active subscription for the athlete.
 * If a subscription exists and is near expiration (<= 5 days left),
 * extends it by one month. Otherwise, creates a new subscription.
 *
 * @param supabase - The Supabase client instance.
 * @param athlete_id - The ID of the athlete.
 * @param currentDate - The current date.
 * @returns The active or newly created subscription object.
 * @throws Error if there is an issue retrieving or updating the subscription.
 */
async function getOrUpdateSubscription(
  supabase: any,
  athlete_id: string,
  currentDate: Date
) {
  // Try to retrieve an active subscription for the athlete.
  const { data: activeSub, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('athlete_id', athlete_id)
    .eq('status', 'active')
    .single()

  // If there is an error (other than "no rows" error) throw an error.
  if (error && error.code !== 'PGRST116')
    throw new Error('Error retrieving subscription')

  if (activeSub) {
    // Calculate remaining days of the current subscription.
    const endDate = new Date(activeSub.end_date)
    const diffDays =
      (endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)

    // If less than or equal to 5 days remain, extend the subscription by 1 month.
    if (diffDays <= 5) {
      const newEndDate = new Date(endDate)
      newEndDate.setMonth(newEndDate.getMonth() + 1)
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          end_date: newEndDate.toISOString().split('T')[0],
          updated_at: new Date().toISOString()
        })
        .eq('id', activeSub.id)
      if (updateError) throw new Error('Error updating subscription')
      activeSub.end_date = newEndDate.toISOString().split('T')[0]
    }
    return activeSub
  } else {
    // If no active subscription exists, create a new one with a 1-month validity.
    const start_date = currentDate.toISOString().split('T')[0]
    const endDate = new Date(currentDate)
    endDate.setMonth(endDate.getMonth() + 1)
    const end_date = endDate.toISOString().split('T')[0]
    const { data: newSub, error: newSubError } = await supabase
      .from('subscriptions')
      .insert([{ athlete_id, start_date, end_date, status: 'active' }])
      .select()
    if (newSubError) throw new Error('Error creating subscription')
    return newSub[0]
  }
}

/**
 * Updates the athlete's enrollment record by linking the active subscription.
 *
 * @param supabase - The Supabase client instance.
 * @param athlete_id - The ID of the athlete.
 * @param subscription_id - The ID of the active subscription.
 * @throws Error if the enrollment update fails.
 */
async function updateEnrollment(
  supabase: any,
  athlete_id: string,
  subscription_id: string
) {
  const { error } = await supabase
    .from('enrollment_requests')
    .update({ status: 'approved', subscription_id })
    .eq('athlete_id', athlete_id)
  if (error) throw new Error('Error updating enrollment')
}

/**
 * Calls an RPC function to decrement the available spots for the given schedule.
 *
 * @param supabase - The Supabase client instance.
 * @param schedule_id - The ID of the schedule.
 * @throws Error if the RPC call fails.
 */
async function decrementSpot(supabase: any, schedule_id: string) {
  const { error } = await supabase.rpc('decrement_available_spot', {
    p_schedule_id: schedule_id
  })
  if (error) throw new Error('Error decrementing available spot')
}

/**
 * Checks whether a payment with the specified transaction reference already exists.
 *
 * @param supabase - The Supabase client instance.
 * @param payment_id - The unique payment transaction ID.
 * @returns True if a duplicate payment is found, false otherwise.
 * @throws Error if there is an issue querying the payments table.
 */
async function isDuplicatePayment(supabase: any, payment_id: string) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('transaction_reference', payment_id)
  if (error) throw new Error('Error checking duplicate payment')
  return data && data.length > 0
}

/**
 * Records a new payment in the payments table.
 *
 * @param supabase - The Supabase client instance.
 * @param athlete_id - The ID of the athlete.
 * @param subscription_id - The ID of the active subscription.
 * @param payment - The payment details from MercadoPago.
 * @throws Error if recording the payment fails.
 */
async function recordPayment(
  supabase: any,
  athlete_id: string,
  subscription_id: string,
  payment: any
) {
  const { error } = await supabase.from('payments').insert([
    {
      athlete_id,
      subscription_id,
      payment_date: new Date(),
      amount: payment.transaction_amount,
      payment_method_id: 3, // Hardcoded payment method ID for MercadoPago
      transaction_reference: payment.id
    }
  ])
  if (error) throw new Error('Error recording payment')
}

/**
 * Main POST handler for MercadoPago payment webhooks.
 *
 * This endpoint:
 * 1. Validates the webhook payload and payment status.
 * 2. Retrieves or creates an active subscription.
 * 3. Updates the athlete's enrollment record.
 * 4. Decrements available spots for the schedule.
 * 5. Checks for duplicate payments.
 * 6. Records the new payment.
 * 7. Revalidates the payments page cache.
 *
 * @param request - The incoming Request object.
 * @returns A Response object with the appropriate HTTP status.
 */
export async function POST(request: Request) {
  try {
    // Parse the incoming JSON body.
    const body: { data: { id: string }; type: any } = await request.json()

    // Validate that the webhook is for a payment event.
    if (body.type !== 'payment') return new Response(null, { status: 400 })

    // Retrieve the payment details from MercadoPago.
    const payment = await new Payment(MP).get({ id: body.data.id })
    if (payment.status !== 'approved')
      return new Response(null, { status: 400 })

    // Initialize Supabase client and extract necessary metadata.
    const supabase = await createClient()
    const { athlete_id, schedule_id } = payment.metadata
    const currentDate = new Date()

    // 1. Retrieve or update the athlete's subscription.
    const subscription = await getOrUpdateSubscription(
      supabase,
      athlete_id,
      currentDate
    )

    // 2. Update the enrollment request to mark it as approved with the subscription id.
    await updateEnrollment(supabase, athlete_id, subscription.id)

    // 3. Decrement available spots for the given schedule.
    await decrementSpot(supabase, schedule_id)

    // 4. Check if a payment with this transaction reference has already been recorded.
    if (await isDuplicatePayment(supabase, payment.id?.toString() as string))
      return new Response(null, { status: 200 })

    // 5. Record the new payment in the payments table.
    await recordPayment(supabase, athlete_id, subscription.id, payment)

    // 6. Revalidate the cache for the athlete payments page.
    revalidatePath('/dashboard/athlete/payments')

    // Return success response.
    return new Response(null, { status: 200 })
  } catch (error) {
    console.error('Error processing payment webhook:', error)
    return new Response(null, { status: 500 })
  }
}
