import type TaskInterface from '../components/task/TaskInterface';

const taskList: { tasks: TaskInterface[] } = {
  tasks: [
    {
      id: 1,
      title: 'Revisar apuntes de clase',
      description: 'Repasar los conceptos de arquitectura en capas y componentes de Ionic.',
      completed: false,
    },
    {
      id: 2,
      title: 'Completar evaluación Unidad 1',
      description: 'Implementar To-Do List con ion-list, ion-item, ion-input e ion-button.',
      completed: false,
    },
    {
      id: 3,
      title: 'Planificar la semana',
      description: 'Organizar entregas del semestre y reuniones de equipo.',
      completed: true,
    },
    {
      id: 4,
      title: 'Preparar informe y capturas',
      description: 'Documentar la estructura de archivos y los patrones de diseño aplicados.',
      completed: false,
    },
  ],
};

export default taskList;

