import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card'
import { getPaymentStatus } from '@/utils/payment-status'

interface PaymentStatusProps {
  isPaid: boolean
  onPayNow: () => void
  payment_method: string
  last_payment_date: string
  payment_amount: string
  daysUntilNextPayment: number
}

export function PaymentStatus({ ...props }: PaymentStatusProps) {
  // Get the payment status
  const { icon, message, colorClasses } = getPaymentStatus(
    props.isPaid,
    props.daysUntilNextPayment
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className='w-full overflow-hidden'>
        <CardHeader className='bg-gray-100 dark:bg-[#222222]'>
          <CardTitle className='text-xl'>
            {props.isPaid ? 'Estado de mensualidad' : 'Estado de matrícula'}
          </CardTitle>
        </CardHeader>
        <CardContent className='p-6'>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            className={`flex items-center space-x-2 ${colorClasses}`}
          >
            {icon}
            <p className='text-lg font-medium'>{message}</p>
          </motion.div>
        </CardContent>
        <CardFooter className='bg-gray-50 p-4 dark:bg-[#1e1e1e]'>
          {props.isPaid ? (
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Último pago: {props.last_payment_date} | Método:{' '}
              {props.payment_method} | Monto: S/. {props.payment_amount}
            </p>
          ) : (
            <Button onClick={props.onPayNow} className='w-full'>
              Pagar ahora
            </Button>
          )}
          {props.isPaid &&
            props.daysUntilNextPayment <= 15 &&
            props.daysUntilNextPayment >= 0 && (
              <Button onClick={props.onPayNow} className='ml-4'>
                Pagar próxima mensualidad
              </Button>
            )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
