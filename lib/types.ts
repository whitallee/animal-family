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

export type AnimalObjectType = {
    id: number,
    name: string,
    species: string
  };

export type EnclosureObjectType = {
    id: number;
    name: string;
    userEmail: string;
    enclosureFamily: {
      id: number;
      name: string;
      species: string;
      userId: string;
      enclosureId: number | null;
  }[]
}