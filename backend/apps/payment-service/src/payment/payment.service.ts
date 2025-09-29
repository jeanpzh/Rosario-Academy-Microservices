import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Request } from 'express'
import MercadoPagoConfig, {
  Payment,
  PreApproval,
  Preference
} from 'mercadopago'
@Injectable()
export class PaymentService {
  private supabase: SupabaseClient
  private mercadopago: MercadoPagoConfig

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY')!
    )
    this.mercadopago = new MercadoPagoConfig({
      accessToken: this.configService.get<string>('MP_ACCESS_TOKEN')!
    })
  }

  async createSubscription(
    athleteId: string,
    scheduleId: string,
    email: string
  ) {
    try {
      const baseUrl =
        this.configService.get<string>('FRONTEND_URL') ||
        'http://localhost:3000'

      const suscription = await new PreApproval(this.mercadopago).create({
        body: {
          back_url: baseUrl ?? 'http://localhost:3000',
          reason: 'Suscripción mensual - Academia Rosario',
          auto_recurring: {
            frequency: 1,
            frequency_type: 'months',
            transaction_amount: 2, // TODO : Use data from DB,
            currency_id: 'PEN'
          },
          payer_email: email,
          status: 'pending',
          external_reference: athleteId
        }
      })
      return suscription.init_point
    } catch (error) {
      console.error('Error creating subscription:', error)
      throw error
    }
  }

  // Obtener pagos de un atleta
  async getAthletePayments(athleteId: string) {
    const { data, error } = await this.supabase.rpc('get_payments', {
      athlete_uuid: athleteId
    })

    if (error) {
      throw new Error(`Error fetching payments: ${error.message}`)
    }

    return data
  }

  // Obtener solicitudes de inscripción de un atleta
  async getAthleteEnrollmentRequests(athleteId: string) {
    const { data, error } = await this.supabase.rpc('get_enrollment_requests', {
      athlete_uuid: athleteId
    })

    if (error) {
      throw new Error(`Error fetching enrollment requests: ${error.message}`)
    }

    return data
  }

  // Obtener o actualizar suscripción activa
  async getOrUpdateSubscription(athleteId: string): Promise<any> {
    const currentDate = new Date()
    // Buscar suscripción activa
    const { data: activeSub, error } = await this.supabase
      .schema('payments')
      .from('subscriptions')
      .select('*')
      .eq('athlete_id', athleteId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error && error.code !== 'PGRST116')
      throw new Error(`Error fetching subscription: ${error}`)

    if (activeSub) {
      // Calcular días restantes
      const endDate = new Date(activeSub.end_date)
      const diffDays = Math.ceil(
        (endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      )
      // Si quedan 5 días o menos, extender 1 mes
      if (diffDays <= 5) {
        const newEndDate = new Date(endDate)
        newEndDate.setMonth(newEndDate.getMonth() + 1)
        const { error: updateError } = await this.supabase
          .schema('payments')
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
      // Si no existe, crear nueva suscripción por 1 mes
      const start_date = currentDate.toISOString().split('T')[0]
      const endDate = new Date(currentDate)
      endDate.setMonth(endDate.getMonth() + 1)
      const end_date = endDate.toISOString().split('T')[0]
      const { data: newSub, error: newSubError } = await this.supabase
        .schema('payments')
        .from('subscriptions')
        .insert({
          athlete_id: athleteId,
          start_date,
          end_date,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()
      if (newSubError) throw new Error('Error creating subscription')
      return newSub
    }
  }

  // Obtener suscripción activa de un atleta
  async getAthleteSubscription(athleteId: string) {
    const { data, error } = await this.supabase
      .schema('payments')
      .from('subscriptions')
      .select('*')
      .eq('athlete_id', athleteId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      throw new Error(`Error fetching subscription: ${error.message}`)
    }

    return data
  }

  // Obtener métodos de pago disponibles
  async getPaymentMethods() {
    const { data, error } = await this.supabase
      .schema('payments')
      .from('payment_methods')
      .select('*')

    if (error) {
      throw new Error(`Error fetching payment methods: ${error.message}`)
    }

    return data
  }

  // Crear un registro de pago
  async createPaymentRecord(
    athleteId: string,
    paymentData: {
      amount: number
      payment_method_id: string
      transaction_reference: string
      payment_date: string
      subscription_start_date: string
      subscription_end_date: string
    }
  ) {
    const { data: subscription, error: subscriptionError } = await this.supabase
      .schema('payments')
      .from('subscriptions')
      .insert({
        athlete_id: athleteId,
        start_date: paymentData.subscription_start_date,
        end_date: paymentData.subscription_end_date,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (subscriptionError) throw subscriptionError

    const { data: payment, error: paymentError } = await this.supabase
      .schema('payments')
      .from('payments')
      .insert({
        athlete_id: athleteId,
        amount: paymentData.amount,
        payment_date: paymentData.payment_date,
        payment_method_id: paymentData.payment_method_id,
        transaction_reference: paymentData.transaction_reference,
        subscription_id: subscription.id
      })
      .select()
      .single()

    if (paymentError) throw paymentError

    // Actualizar el estado de la solicitud de inscripción
    const { error: updateError } = await this.supabase
      .schema('users')
      .from('enrollment_requests')
      .update({ status: 'approved' })
      .eq('athlete_id', athleteId)

    if (updateError) throw updateError

    return { payment, subscription }
  }

  // Actualizar estado de inscripción desde webhook
  async updateEnrollmentStatus(athleteId: string, subscriptionId: string) {
    const { error } = await this.supabase
      .schema('users')
      .from('enrollment_requests')
      .update({ status: 'approved', subscription_id: subscriptionId })
      .eq('athlete_id', athleteId)
    if (error) {
      console.log('Error actualizando inscripción:', error)
      throw new Error('Error actualizando inscripción')
    }
  }

  // Decrementar cupos disponibles en el horario
  async decrementScheduleSpot(scheduleId: string) {
    const { error } = await this.supabase.rpc('decrement_available_spot', {
      p_schedule_id: scheduleId
    })
    if (error) {
      console.log('Error decrementando cupos:', error)
      throw new Error('Error decrementando cupos')
    }
  }

  // Registrar pago desde webhook
  async recordPaymentWebhook(
    athleteId: string,
    subscriptionId: string,
    payment: any
  ) {
    const { error } = await this.supabase
      .schema('payments')
      .from('payments')
      .insert([
        {
          athlete_id: athleteId,
          subscription_id: subscriptionId,
          payment_date: new Date().toISOString().split('T')[0],
          amount: payment.transaction_amount || payment.amount,
          payment_method_id: 3,
          transaction_reference: payment.id || payment.transaction_reference
        }
      ])
    if (error) {
      console.log('Error registrando pago:', error)
      throw new Error('Error registrando pago')
    }
  }

  // Obtener todos los datos de pago de un atleta
  async getAllPaymentData(athleteId: string) {
    const [payments, enrollmentRequests, subscription, paymentMethods] =
      await Promise.all([
        this.getAthletePayments(athleteId),
        this.getAthleteEnrollmentRequests(athleteId),
        this.getAthleteSubscription(athleteId),
        this.getPaymentMethods()
      ])

    return {
      payments,
      enrollmentRequests,
      subscription,
      paymentMethods
    }
  }

  // Obtener atletas con sus pagos (para admin/auxiliar)
  async getAthletesWithPayments() {
    const { data: athletes, error } = await this.supabase
      .schema('users')
      .from('athletes').select(`
        athlete_id,
        profiles (
          first_name,
          paternal_last_name,
          maternal_last_name,
          avatar_url
        )
      `)
    const { data: payments, error: paymentError } = await this.supabase
      .schema('payments')
      .from('payments').select(`
        athlete_id,
        amount,
        payment_date,
        payment_methods (
          method_name
        )
      `)

    if (paymentError || !payments) {
      throw new Error(`Error fetching payments: ${paymentError?.message}`)
    }

    if (error || !athletes) {
      throw new Error(
        `Error fetching athletes with payments: ${error?.message}`
      )
    }

    const athletesWithPayments = athletes.map((athlete) => {
      const athletePayments = payments.filter(
        (payment) => payment.athlete_id === athlete.athlete_id
      )

      return {
        ...athlete,
        payments: athletePayments
      }
    })

    return athletesWithPayments
  }

  async handleMercadoPagoWebhook(req: Request) {
    // Parse the incoming JSON body (NestJS uses req.body).
    const body: { data: { id: string }; type: any } = req.body

    // Validate that the webhook is for a payment event.
    if (body.type !== 'subscription_preapproval')
      return new Response(null, { status: 400 })

    const payment = await new Payment(this.mercadopago).get({
      id: body.data.id
    })

    if (payment.status !== 'approved')
      return new Response(null, { status: 400 })

    const preApproval = await new PreApproval(this.mercadopago).get({
      id: body.data.id
    })

    if (preApproval.status === 'authorized') {
      await this.supabase.from('subscriptions').update({
        status: 'active'
      })
    }

    const athleteId = payment.metadata?.athlete_id
    const scheduleId = payment.metadata?.schedule_id

    try {
      // Obtener o actualizar suscripción activa
      const subscription = await this.getOrUpdateSubscription(athleteId)
      console.log('📅 Suscripción obtenida/actualizada:', subscription)
      // Actualizar estado de inscripción
      await this.updateEnrollmentStatus(athleteId, subscription.id)

      // Decrementar cupos disponibles en el horario
      await this.decrementScheduleSpot(scheduleId)

      // Registrar pago
      await this.recordPaymentWebhook(athleteId, subscription.id, payment)

      return { success: true }
    } catch (error) {
      console.log('Error procesando webhook:', error)
      return { success: false, error: error.message }
    }
  }

  // Métodos con lógica de controller migrados al service
  async createPaymentPreference(body: {
    athleteId: string
    scheduleId: string
    email: string
  }) {
    try {
      const preference = await this.createSubscription(
        body.athleteId,
        body.scheduleId,
        body.email
      )
      return {
        success: true,
        data: preference
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  async handleWebhook(req: Request) {
    return this.handleMercadoPagoWebhook(req)
  }

  async getAthletePaymentsWithResponse(athleteId: string) {
    try {
      const payments = await this.getAthletePayments(athleteId)
      return {
        success: true,
        data: payments
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  async getAthleteEnrollmentRequestsWithResponse(athleteId: string) {
    try {
      const enrollmentRequests =
        await this.getAthleteEnrollmentRequests(athleteId)
      return {
        success: true,
        data: enrollmentRequests
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  async getAthleteSubscriptionWithResponse(athleteId: string) {
    try {
      const subscription = await this.getAthleteSubscription(athleteId)
      return {
        success: true,
        data: subscription
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  async getAllPaymentDataWithResponse(athleteId: string) {
    try {
      const data = await this.getAllPaymentData(athleteId)
      return {
        success: true,
        data
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  async getPaymentMethodsWithResponse() {
    try {
      const methods = await this.getPaymentMethods()
      return {
        success: true,
        data: methods
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  async createPaymentRecordWithResponse(
    athleteId: string,
    paymentData: {
      amount: number
      payment_method_id: string
      transaction_reference: string
      payment_date: string
      subscription_start_date: string
      subscription_end_date: string
    }
  ) {
    try {
      const result = await this.createPaymentRecord(athleteId, paymentData)
      return {
        success: true,
        data: result
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  async getAthletesWithPaymentsWithResponse() {
    try {
      const athletes = await this.getAthletesWithPayments()
      return {
        success: true,
        data: athletes
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}
