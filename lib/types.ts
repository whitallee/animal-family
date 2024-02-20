export type TaskObjectType = {
    id: number,
    task: string,
    subjectName: string,
    animalId: number | null,
    enclosureId: number | null
    complete: boolean,
    repeatDayInterval: number | null,
    lastCompleted: Date,
    textEnabled: boolean
  };