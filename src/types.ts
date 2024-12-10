// import { Id, column } from './types';
export type Id = string | number;

export type column = {
    id: Id;
    title: string;
};

export type Task = {
    id:Id;
    columnId:Id;
    content:string
};