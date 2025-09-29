import React from 'react'
import { AlertCircle, Clock, CheckCircle } from 'lucide-react'

interface ApprovalStatusProps {
  isNotApproved: boolean
  error?: string | null
}

const ApprovalStatus: React.FC<ApprovalStatusProps> = ({
  isNotApproved,
  error
}) => {
  if (!isNotApproved) return null

  return (
    <div className='max-w-md mx-auto mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm'>
      <div className='flex items-start space-x-3'>
        <AlertCircle className='h-6 w-6 text-yellow-600 mt-1 flex-shrink-0' />
        <div className='flex-1'>
          <h3 className='text-lg font-semibold text-yellow-800 mb-2'>
            Inscripción Pendiente de Aprobación
          </h3>
          <p className='text-yellow-700 mb-4'>
            Tu solicitud de inscripción está siendo revisada por nuestro equipo
            administrativo.
          </p>

          <div className='space-y-3'>
            <div className='flex items-center space-x-2 text-sm text-yellow-600'>
              <Clock className='h-4 w-4' />
              <span>Estado: Pendiente de revisión</span>
            </div>

            <div className='bg-yellow-100 p-3 rounded border-l-4 border-yellow-400'>
              <p className='text-sm text-yellow-800'>
                <strong>¿Qué puedes hacer mientras tanto?</strong>
              </p>
              <ul className='mt-2 text-sm text-yellow-700 space-y-1'>
                <li>• Revisar y completar tu perfil</li>
                <li>
                  • Contactar al administrador si han pasado más de 48 horas
                </li>
                <li>• Verificar que toda tu documentación esté en orden</li>
              </ul>
            </div>

            <div className='pt-3 border-t border-yellow-200'>
              <p className='text-xs text-yellow-600'>
                Una vez aprobada tu solicitud, podrás acceder a:
              </p>
              <div className='mt-2 flex items-center space-x-4 text-xs text-yellow-600'>
                <div className='flex items-center space-x-1'>
                  <CheckCircle className='h-3 w-3' />
                  <span>Horarios de entrenamiento</span>
                </div>
                <div className='flex items-center space-x-1'>
                  <CheckCircle className='h-3 w-3' />
                  <span>Carnet digital</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApprovalStatus
