export class Todo {
    id: string;
    name: string;
    shortDesc?: string;
    fullDesc?: string;
    date: string;
    status: boolean;

    constructor(partial: Partial<Todo>) {
        Object.assign(this, partial);
    }
}