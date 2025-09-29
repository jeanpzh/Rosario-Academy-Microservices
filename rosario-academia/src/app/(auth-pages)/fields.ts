export const FORM_FIELDS_STEP_ONE = [
  {
    label: "Nombres",
    name: "firstName",
    type: "text",
    required: true,
    placeholder: "José",
  },
  {
    label: "Apellido Paterno",
    name: "paternalLastName",
    type: "text",
    required: true,
    placeholder: "Sernaqué",
  },
  {
    label: "Apellido Materno",
    name: "maternalLastName",
    type: "text",
    required: true,
    placeholder: "González",
  },
  {
    label: "Fecha de Nacimiento",
    name: "birthDate",
    type: "date",
    required: true,
    placeholder: "dd/mm/yyyy",
  },
  {
    label: "DNI",
    name: "dni",
    type: "text",
    required: true,
    placeholder: "12345678",
  },
  {
    label: "Correo Electrónico",
    name: "email",
    type: "email",
    required: true,
    placeholder: " [email protected]",
  },
  {
    label: "Telefono de Contacto",
    name: "phone",
    type: "text",
    required: true,
    placeholder: "987654321",
  },
];
export const LEVELS = [
  {
    id: "beginner",
    name: "Principiante",
    description: "Para aquellos que están comenzando su viaje en el fitness.",
  },
  {
    id: "intermediate",
    name: "Intermedio",
    description: "Para aquellos que tienen experiencia y buscan un desafío mayor.",
  },
  {
    id: "advanced",
    name: "Avanzado",
    description:
      "Para atletas experimentados que buscan llevar su entrenamiento al siguiente nivel.",
  },
];
export const SHIFTS = [
  {
    id: "morning",
    name: "Mañana",
    description: "Para aquellos que prefieren entrenar temprano.",
  },
  {
    id: "afternoon",
    name: "Tarde",
    description: "Para aquellos que prefieren entrenar por la tarde.",
  },
  {
    id: "night",
    name: "Noche",
    description: "Para aquellos que prefieren entrenar por la noche.",
  },
];
