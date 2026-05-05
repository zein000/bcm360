import { Model } from "sequelize-typescript";
import { Language } from "../enums/language.enum";
export default class Translation extends Model {
    id: number;
    key: string;
    language: Language;
    text: string;
}
