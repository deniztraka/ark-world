import { Enum } from 'enumify';

export class MenuPosition extends Enum {}
MenuPosition.initEnum(["Center", "Top", "Bottom", "Left", "Right"]);